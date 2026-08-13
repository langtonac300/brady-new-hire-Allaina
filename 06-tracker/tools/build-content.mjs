#!/usr/bin/env node
/**
 * build-content.mjs — turns the Markdown in this repo into Apps Script data modules.
 *
 * Run it from anywhere:
 *
 *     node 06-tracker/tools/build-content.mjs
 *
 * It walks every `.md` file, works out a title, a kind and a reading order, and writes the
 * `Data*.gs` files in `06-tracker/apps-script/`. Those files are the seed the workbook
 * imports on first setup — after that the Sheet is the live copy, and re-importing is a
 * deliberate act from the menu.
 *
 * Nothing here is hand-edited. Change the Markdown, re-run this, commit both.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname, basename, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..', '..');
const OUT = join(HERE, '..', 'apps-script');

/**
 * Files that must never reach the workbook.
 *
 * CLAUDE.md is the important one: it carries the boundary rule, and the terms quoted in
 * that rule must not be copied into a corporate Google system. The tracker's own docs are
 * excluded because the app does not need to contain its own manual.
 */
const EXCLUDE_FILES = new Set(['CLAUDE.md']);
const EXCLUDE_DIRS = new Set(['.git', '.github', 'node_modules', '06-tracker']);

/** Which bucket each folder lands in, and how the app groups it. */
const FOLDERS = {
  '.': { label: 'Overview', kind: 'Orientation', module: 'Overview' },
  '01-start-here': { label: 'Start here', kind: 'Orientation', module: 'StartHere' },
  '02-learning': { label: 'Learning', kind: 'Learning', module: 'Learning' },
  '03-projects': { label: 'Projects', kind: 'Project', module: 'Projects' },
  '04-my-work': { label: 'My work', kind: 'Workspace', module: 'Workspace' },
  '05-self-assessment': { label: 'Self-assessment', kind: 'Assessment', module: 'Workspace' },
};

/**
 * Curated reading order. Anything not listed sorts alphabetically after the listed files
 * in its own folder, so adding a file never breaks the build — it just lands at the end.
 */
const ORDER = [
  'README.md',

  '01-start-here/README.md',
  '01-start-here/how-the-ramp-works.md',
  '01-start-here/your-first-two-weeks.md',
  '01-start-here/about-how-you-work.md',
  '01-start-here/who-everyone-is.md',
  '01-start-here/your-week.md',
  '01-start-here/when-youre-stuck-or-idle.md',

  '02-learning/README.md',
  '02-learning/ppc-fundamentals.md',
  '02-learning/cheat-sheet.md',
  '02-learning/how-brady-measures.md',
  '02-learning/pdc-primer.md',
  '02-learning/seton-emedco-primer.md',
  '02-learning/how-to-run-a-project.md',
  '02-learning/what-a-deliverable-looks-like.md',
  '02-learning/the-l10-huddle.md',
  '02-learning/who-else-is-searching.md',
  '02-learning/before-it-ships.md',
  '02-learning/running-a-real-test.md',

  '03-projects/README.md',
  '03-projects/t1-01-account-tour.md',
  '03-projects/t1-02-a-different-animal.md',
  '03-projects/t1-03-keyword-vs-search-term.md',
  '03-projects/t1-04-conversion-action-inventory.md',
  '03-projects/t1-05-source-and-caveat-the-slide.md',
  '03-projects/t1-06-guardrail-drill.md',
  '03-projects/t1-07-brand-vs-nonbrand.md',
  '03-projects/t1-08-the-timezone-trap.md',
  '03-projects/t1-09-pmax-with-no-feed.md',
  '03-projects/t1-10-competitor-outrank-teardown.md',
  '03-projects/t1-11-the-roas-puzzle.md',
  '03-projects/t1-12-dont-clean-that-up.md',
  '03-projects/t2-01-sqr-predict-then-compare.md',
  '03-projects/t2-02-the-same-drill-at-scale.md',
  '03-projects/t2-03-negative-keyword-build-v1.md',
  '03-projects/t2-04-the-pacing-note.md',
  '03-projects/t2-05-feed-label-qa.md',
  '03-projects/t2-06-ad-copy-audit.md',
  '03-projects/t2-08-trace-one-click.md',
  '03-projects/t3-01-first-conversion-tracking-pass.md',
  '03-projects/t3-02-waste-at-scale.md',
  '03-projects/t3-03-a-budget-recommendation.md',
  '03-projects/t3-04-a-process-gap-found-and-specced.md',
  '03-projects/t3-05-your-first-experiment.md',
  '03-projects/m-01-the-defect-audit.md',
  '03-projects/m-02-fix-the-conversion-values.md',
  '03-projects/m-03-attach-and-build-the-negatives.md',
  '03-projects/m-05-own-it.md',
  '03-projects/t4-01-where-the-money-goes.md',
  '03-projects/t4-02-a-second-way-in.md',
  '03-projects/t4-03-the-landing-page-test.md',
  '03-projects/t4-04-what-it-should-spend.md',
  '03-projects/the-tools-thread.md',
  '03-projects/the-ai-thread.md',
  '03-projects/after-the-ramp.md',

  '04-my-work/README.md',
  '04-my-work/questions/README.md',
  '04-my-work/notes/README.md',
  '04-my-work/projects/README.md',
  '04-my-work/drafts/README.md',
  '04-my-work/what-i-got-wrong/README.md',

  '05-self-assessment/baseline.md',
];

const ORDER_INDEX = new Map(ORDER.map((p, i) => [p, i]));

/** Titles for the handful of files that have no `# heading` of their own. */
const TITLE_FALLBACK = {
  '04-my-work/questions/README.md': 'Questions',
  '04-my-work/notes/README.md': 'Notes',
  '04-my-work/projects/README.md': 'Project deliverables',
  '04-my-work/drafts/README.md': 'Drafts',
};

function walk(dir, found = []) {
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    const rel = relative(REPO, full).split(sep).join('/');
    if (statSync(full).isDirectory()) {
      if (EXCLUDE_DIRS.has(entry) || EXCLUDE_DIRS.has(rel)) continue;
      walk(full, found);
    } else if (entry.endsWith('.md') && !EXCLUDE_FILES.has(rel)) {
      found.push(rel);
    }
  }
  return found;
}

function titleOf(path, body) {
  const heading = body.match(/^#\s+(.+?)\s*$/m);
  if (heading) return heading[1].trim();
  if (TITLE_FALLBACK[path]) return TITLE_FALLBACK[path];
  const name = basename(path, '.md');
  return name === 'README' ? basename(dirname(path)) : name.replace(/[-_]/g, ' ');
}

/**
 * A one-line summary for the library list. The repo's files nearly all open with a heading
 * and then a short standfirst line, so that line is the summary. Tables, quotes and rules
 * are skipped rather than guessed at.
 */
function summaryOf(body) {
  const lines = body.split('\n');
  let seenHeading = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (/^#{1,6}\s/.test(line)) {
      if (seenHeading) break;
      seenHeading = true;
      continue;
    }
    if (!seenHeading) continue;
    if (/^([-*_]{3,}|[|>]|```)/.test(line)) continue;
    return line
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[*_`]/g, '')
      .replace(/\s+/g, ' ')
      .slice(0, 240);
  }
  return '';
}

function folderKeyOf(path) {
  const top = path.includes('/') ? path.split('/')[0] : '.';
  return FOLDERS[top] ? top : '.';
}

/** A project brief is a file in 03-projects whose name starts with a tier code. */
function projectIdOf(path) {
  const m = path.match(/^03-projects\/((?:t[1-4]|m)-\d+)-/i);
  if (!m) return '';
  const [tier, num] = m[1].toUpperCase().split('-');
  return `${tier}-${parseInt(num, 10)}`;
}

const paths = walk(REPO);

const docs = paths.map((path) => {
  const body = readFileSync(join(REPO, path), 'utf8').replace(/\r\n/g, '\n').trimEnd();
  const folderKey = folderKeyOf(path);
  const folder = FOLDERS[folderKey];
  const projectId = projectIdOf(path);
  return {
    id: path.replace(/\.md$/, ''),
    folder: folder.label,
    folderKey,
    module: folder.module,
    source: path,
    title: titleOf(path, body),
    summary: summaryOf(body),
    kind: projectId ? 'Project' : folder.kind,
    projectId,
    words: body.split(/\s+/).filter(Boolean).length,
    body,
  };
});

docs.sort((a, b) => {
  const ai = ORDER_INDEX.has(a.source) ? ORDER_INDEX.get(a.source) : Number.MAX_SAFE_INTEGER;
  const bi = ORDER_INDEX.has(b.source) ? ORDER_INDEX.get(b.source) : Number.MAX_SAFE_INTEGER;
  if (ai !== bi) return ai - bi;
  return a.source.localeCompare(b.source);
});

docs.forEach((doc, i) => {
  doc.order = (i + 1) * 10;
});

/**
 * A Google Sheets cell holds 50,000 characters. One document is one cell, so a file that
 * grows past that would fail at import rather than here — which is a much worse place to
 * find out. Stop at 45,000 and say which file and what to do about it.
 */
const CELL_LIMIT = 45000;
const oversized = docs.filter((d) => d.body.length > CELL_LIMIT);
if (oversized.length) {
  console.error('\nERROR: these documents are too long for a single spreadsheet cell:\n');
  oversized.forEach((d) => console.error(`  ${d.source} - ${d.body.length} characters (limit ${CELL_LIMIT})`));
  console.error('\nSplit the file, or change the Library to store the body across several rows.');
  process.exit(1);
}

/**
 * Apps Script has no folders, so the content is split by area to keep any one file
 * openable in the editor. `03-projects` is split in two — it is half the repo by size.
 */
const MODULES = [
  { file: 'Data01Overview', fn: 'DATA_OVERVIEW', pick: (d) => d.module === 'Overview' },
  { file: 'Data02StartHere', fn: 'DATA_START_HERE', pick: (d) => d.module === 'StartHere' },
  { file: 'Data03Learning', fn: 'DATA_LEARNING', pick: (d) => d.module === 'Learning' },
  {
    file: 'Data04ProjectsA',
    fn: 'DATA_PROJECTS_A',
    pick: (d) => d.module === 'Projects' && !/^(T[34]|M)-/.test(d.projectId || 'x'),
  },
  {
    file: 'Data05ProjectsB',
    fn: 'DATA_PROJECTS_B',
    pick: (d) => d.module === 'Projects' && /^(T[34]|M)-/.test(d.projectId || 'x'),
  },
  { file: 'Data06Workspace', fn: 'DATA_WORKSPACE', pick: (d) => d.module === 'Workspace' },
];

const HEADER = [
  '/**',
  ' * GENERATED FILE - do not edit here.',
  ' *',
  ' * Rebuild it from the source Markdown with the build script kept alongside this',
  ' * project, then paste the result back in. Editing this file by hand means the next',
  ' * rebuild silently discards your change.',
  ' */',
  '',
].join('\n');

let written = 0;
for (const mod of MODULES) {
  const picked = docs.filter(mod.pick);
  const rows = picked
    .map((d) =>
      [
        '  {',
        `    id: ${JSON.stringify(d.id)},`,
        `    title: ${JSON.stringify(d.title)},`,
        `    folder: ${JSON.stringify(d.folder)},`,
        `    kind: ${JSON.stringify(d.kind)},`,
        `    projectId: ${JSON.stringify(d.projectId)},`,
        `    source: ${JSON.stringify(d.source)},`,
        `    summary: ${JSON.stringify(d.summary)},`,
        `    order: ${d.order},`,
        `    words: ${d.words},`,
        `    body: ${JSON.stringify(d.body)}`,
        '  }',
      ].join('\n')
    )
    .join(',\n');

  const contents = `${HEADER}
/** ${picked.length} document${picked.length === 1 ? '' : 's'}. */
function ${mod.fn}() {
  return [
${rows}
  ];
}
`;
  writeFileSync(join(OUT, `${mod.file}.gs`), contents, 'utf8');
  written += picked.length;
  const kb = Math.round(Buffer.byteLength(contents) / 1024);
  console.log(`${mod.file}.gs  ${String(picked.length).padStart(3)} docs  ${kb} KB`);
}

if (written !== docs.length) {
  console.error(`\nERROR: ${docs.length} documents found but ${written} written.`);
  console.error('Every document must land in exactly one module. Check the pick() rules.');
  process.exit(1);
}

const missing = ORDER.filter((p) => !paths.includes(p));
if (missing.length) {
  console.log(`\nListed in ORDER but not on disk (harmless, just stale):`);
  missing.forEach((p) => console.log(`  ${p}`));
}

const unordered = docs.filter((d) => !ORDER_INDEX.has(d.source));
if (unordered.length) {
  console.log(`\nNot in ORDER, appended alphabetically - add them if the order matters:`);
  unordered.forEach((d) => console.log(`  ${d.source}`));
}

console.log(`\n${docs.length} documents, ${Math.round(docs.reduce((n, d) => n + d.body.length, 0) / 1024)} KB of content.`);
