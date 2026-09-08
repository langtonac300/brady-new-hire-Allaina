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
            // Saves persist across a reload in this preview, the way they do against the real
            // Sheet. Without this every save looked like data loss the moment the page was
            // refreshed, which is exactly the thing the tests most need to see.
            try {
              var remembered = JSON.parse(window.localStorage.getItem('preview.boot') || 'null');
              if (remembered) Object.keys(remembered).forEach(function (k) { SNAPSHOT.boot[k] = remembered[k]; });
            } catch (e) { /* no storage here - in-memory only */ }
            function remember() {
              try { window.localStorage.setItem('preview.boot', JSON.stringify(SNAPSHOT.boot)); } catch (e) { /* fine */ }
            }
            var runner = {};
            runner.withSuccessHandler = function (fn) { handlers.ok = fn; return runner; };
            runner.withFailureHandler = function (fn) { handlers.fail = fn; return runner; };
            ['apiBootstrap','apiGetDoc','apiGetDiagram','apiSaveDoc','apiSaveProject','apiSaveSkill',
             'apiCreate','apiUpdate','apiDelete','apiReload','apiSetSetting','apiSaveSystem',
             'apiSaveScript','apiSearch','apiSaveIntake'].forEach(function (name) {
              runner[name] = function () {
                var args = arguments;
                setTimeout(function () {
                  if (name === 'apiBootstrap') return handlers.ok({ ok: true, data: SNAPSHOT.boot });
                  if (name === 'apiGetDoc') return handlers.ok({ ok: true, data: SNAPSHOT.bodies[args[0]] || { Body: '# Not in the snapshot' } });
                  if (name === 'apiGetDiagram') {
                    var uri = SNAPSHOT.diagrams[args[0]];
                    return uri ? handlers.ok({ ok: true, data: uri })
                               : handlers.ok({ ok: false, error: 'No diagram called "' + args[0] + '".' });
                  }
                  if (name === 'apiReload') return handlers.ok({ ok: true, data: SNAPSHOT.boot[args[0]] || [] });
                  if (name === 'apiSearch') return handlers.ok({ ok: true, data: { query: args[0], documents: [], entries: [] } });
                  // Writes echo a plausible row. Returning {} here used to wipe the saved
                  // record's metadata in the page's own state, which made every save look
                  // like data loss in the preview when the real app keeps it fine.
                  if (name === 'apiCreate') {
                    var made = Object.assign({ ID: args[0].slice(0, 1).toUpperCase() + '-9' + String(Date.now() % 100).padStart(2, '0'),
                      Date: new Date().toISOString().slice(0, 10) }, args[1] || {});
                    (SNAPSHOT.boot[args[0]] = SNAPSHOT.boot[args[0]] || []).push(made);
                    remember(); return handlers.ok({ ok: true, data: made });
                  }
                  if (name === 'apiUpdate') {
                    var list = SNAPSHOT.boot[args[0]] || [];
                    var hit = list.filter(function (r) { return r.ID === args[1]; })[0] || { ID: args[1] };
                    Object.assign(hit, args[2] || {});
                    remember(); return handlers.ok({ ok: true, data: hit });
                  }
                  if (name === 'apiSaveProject') {
                    var pr = (SNAPSHOT.boot.projects || []).filter(function (p) { return p.ID === args[0]; })[0] || { ID: args[0] };
                    Object.assign(pr, args[1] || {});
                    remember(); return handlers.ok({ ok: true, data: pr });
                  }
                  if (name === 'apiSaveDoc') {
                    var doc = (SNAPSHOT.boot.docs || []).filter(function (d) { return d.ID === args[0]; })[0] || { ID: args[0] };
                    Object.assign(doc, args[1] || {});
                    remember(); return handlers.ok({ ok: true, data: doc });
                  }
                  if (name === 'apiSaveIntake') {
                    var iq = (SNAPSHOT.boot.intake || []).filter(function (r) { return r.Key === args[0]; })[0] || { Key: args[0] };
                    iq.Answer = args[1];
                    remember(); return handlers.ok({ ok: true, data: iq });
                  }
                  if (name === 'apiDelete') {
                    var rows = SNAPSHOT.boot[args[0]] || [];
                    var victim = rows.filter(function (r) { return r.ID === args[1]; })[0];
                    if (args[0] === 'notes' && victim) victim.Archived = 'Yes';
                    else SNAPSHOT.boot[args[0]] = rows.filter(function (r) { return r.ID !== args[1]; });
                    remember();
                    return handlers.ok({ ok: true, data: true });
                  }
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
