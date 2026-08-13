#!/usr/bin/env node
/**
 * preview.mjs - render the interface outside Apps Script, so it can be looked at.
 *
 *     node 06-tracker/tools/preview.mjs
 *
 * Builds the workbook in memory exactly as the test harness does, seeds it with a plausible
 * few weeks of use, then writes a single self-contained HTML file with google.script.run
 * mocked out against that data. Open it in any browser - or screenshot it - to see what the
 * app actually looks like without deploying anything.
 *
 * Writes to the scratch path given as the first argument, or ./preview.html.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, '..', 'apps-script');
const OUT = process.argv[2] || join(process.cwd(), 'preview.html');

// Reuse the harness's fake Apps Script by asking it for a bootstrap payload.
const bootstrap = JSON.parse(
  execFileSync('node', [join(HERE, 'dump-state.mjs')], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
);

const read = (name) => readFileSync(join(SRC, name), 'utf8');

// Every replacement goes through a function, never a replacement string. The client code
// contains "$&" (it escapes a regex in the search highlighter), and in a replacement string
// that means "the text that matched" - which silently pastes the include tag into the middle
// of the app. Took a browser syntax error to notice.
const inject = (haystack, needle, payload) => haystack.replace(needle, () => payload);

const page = [
  ["<?!= include('Stylesheet'); ?>", read('Stylesheet.html')],
  ["<?!= include('Images'); ?>", read('Images.html')],
  [
    "<?!= include('JavaScript'); ?>",
    `<script>
      // Stand-in for google.script.run. Everything is served from the snapshot below, and
      // writes are acknowledged without going anywhere.
      var SNAPSHOT = ${JSON.stringify(bootstrap)};
      window.google = {
        script: {
          run: (function () {
            var handlers = {};
            var runner = {};
            runner.withSuccessHandler = function (fn) { handlers.ok = fn; return runner; };
            runner.withFailureHandler = function (fn) { handlers.fail = fn; return runner; };
            ['apiBootstrap','apiGetDoc','apiSaveDoc','apiSaveProject','apiSaveSkill','apiCreate',
             'apiUpdate','apiDelete','apiReload','apiSetSetting','apiSaveSystem','apiSaveScript',
             'apiSearch'].forEach(function (name) {
              runner[name] = function () {
                var args = arguments;
                setTimeout(function () {
                  if (name === 'apiBootstrap') return handlers.ok({ ok: true, data: SNAPSHOT.boot });
                  if (name === 'apiGetDoc') return handlers.ok({ ok: true, data: SNAPSHOT.bodies[args[0]] || { Body: '# Not in the snapshot' } });
                  if (name === 'apiReload') return handlers.ok({ ok: true, data: SNAPSHOT.boot[args[0]] || [] });
                  if (name === 'apiSearch') return handlers.ok({ ok: true, data: { query: args[0], documents: [], entries: [] } });
                  handlers.ok({ ok: true, data: {} });
                }, 0);
                return runner;
              };
            });
            return runner;
          })()
        }
      };
    </script>` + read('JavaScript.html')
  ]
].reduce((html, [needle, payload]) => inject(html, needle, payload), read('Index.html'));

writeFileSync(OUT, page, 'utf8');
console.log(`${OUT}  ${Math.round(Buffer.byteLength(page) / 1024)} KB`);
