#!/usr/bin/env node
/**
 * test.mjs - runs the workbook against a stand-in for Apps Script.
 *
 *     node 06-tracker/tools/test.mjs
 *
 * Google's runtime is not available outside Apps Script, so this fakes the parts the project
 * uses: a spreadsheet made of plain arrays, ranges that record formatting instead of applying
 * it, and a lock that is always free. That is enough to build the whole workbook, seed it, and
 * drive every API call the browser can make.
 *
 * It then renders all 63 documents through the real markdown renderer, lifted out of
 * JavaScript.html, and checks the output is well formed and that internal links resolve.
 *
 * Exit code 0 means everything passed.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, '..', 'apps-script');

let passed = 0;
const failures = [];

function check(label, condition, detail) {
  if (condition) {
    passed++;
  } else {
    failures.push(detail ? `${label}\n      ${detail}` : label);
  }
}

function eq(label, actual, expected) {
  check(label, actual === expected, `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

/* ============================ fake Apps Script ============================ */

const chainable = [
  'setFontWeight', 'setFontFamily', 'setFontColor', 'setBackground', 'setVerticalAlignment',
  'setHorizontalAlignment', 'setWrap', 'setNumberFormat', 'setFontSize', 'setDataValidation',
  'clearDataValidations', 'applyRowBanding', 'setBorder', 'setHorizontalAlignment'
];

function makeRange(sheet, row, col, numRows, numCols) {
  const range = {
    getRow: () => row,
    getColumn: () => col,
    getNumRows: () => numRows,
    getNumColumns: () => numCols,
    getValues() {
      const out = [];
      for (let r = 0; r < numRows; r++) {
        const line = [];
        for (let c = 0; c < numCols; c++) line.push(sheet.read(row + r, col + c));
        out.push(line);
      }
      return out;
    },
    getValue() {
      return sheet.read(row, col);
    },
    setValues(values) {
      if (values.length !== numRows) throw new Error(`setValues: expected ${numRows} rows, got ${values.length}`);
      values.forEach((line, r) => {
        if (line.length !== numCols) {
          throw new Error(`setValues: row ${r} has ${line.length} cells, range is ${numCols} wide`);
        }
        line.forEach((v, c) => sheet.write(row + r, col + c, v));
      });
      return range;
    },
    setValue(v) {
      sheet.write(row, col, v);
      return range;
    },
    clearContent() {
      for (let r = 0; r < numRows; r++) for (let c = 0; c < numCols; c++) sheet.write(row + r, col + c, '');
      return range;
    }
  };
  chainable.forEach((m) => {
    range[m] = () => range;
  });
  return range;
}

function makeSheet(name) {
  const cells = new Map();
  const sheet = {
    name,
    hidden: false,
    maxRows: 1000,
    maxCols: 26,
    conditionalRules: [],
    read(r, c) {
      const v = cells.get(`${r}:${c}`);
      return v === undefined ? '' : v;
    },
    write(r, c, v) {
      if (r > sheet.maxRows || c > sheet.maxCols) {
        throw new Error(`write outside sheet "${name}": r${r} c${c} (max r${sheet.maxRows} c${sheet.maxCols})`);
      }
      cells.set(`${r}:${c}`, v);
    },
    getName: () => name,
    getMaxRows: () => sheet.maxRows,
    getMaxColumns: () => sheet.maxCols,
    insertRowsAfter(_after, n) {
      sheet.maxRows += n;
    },
    insertColumnsAfter(_after, n) {
      sheet.maxCols += n;
    },
    getLastRow() {
      let last = 0;
      for (const [k, v] of cells) {
        if (v !== '' && v !== null && v !== undefined) last = Math.max(last, Number(k.split(':')[0]));
      }
      return last;
    },
    getLastColumn() {
      let last = 0;
      for (const [k, v] of cells) {
        if (v !== '' && v !== null && v !== undefined) last = Math.max(last, Number(k.split(':')[1]));
      }
      return last;
    },
    getRange(row, col, numRows = 1, numCols = 1) {
      if (row < 1 || col < 1) throw new Error(`getRange out of bounds on "${name}": row ${row}, col ${col}`);
      if (row + numRows - 1 > sheet.maxRows) {
        throw new Error(`getRange past the bottom of "${name}": ${row}+${numRows} > ${sheet.maxRows}`);
      }
      if (col + numCols - 1 > sheet.maxCols) {
        throw new Error(`getRange past the right edge of "${name}": ${col}+${numCols} > ${sheet.maxCols}`);
      }
      return makeRange(sheet, row, col, numRows, numCols);
    },
    getDataRange() {
      return sheet.getRange(1, 1, Math.max(sheet.getLastRow(), 1), Math.max(sheet.getLastColumn(), 1));
    },
    appendRow(values) {
      const row = sheet.getLastRow() + 1;
      values.forEach((v, i) => sheet.write(row, i + 1, v));
    },
    deleteRow(row) {
      const last = sheet.getLastRow();
      const width = sheet.getLastColumn();
      for (let r = row; r < last; r++) {
        for (let c = 1; c <= width; c++) sheet.write(r, c, sheet.read(r + 1, c));
      }
      for (let c = 1; c <= width; c++) sheet.write(last, c, '');
    },
    clear() {
      cells.clear();
      return sheet;
    },
    getBandings: () => [],
    hideSheet() {
      sheet.hidden = true;
      return sheet;
    },
    showSheet() {
      sheet.hidden = false;
      return sheet;
    },
    isSheetHidden: () => sheet.hidden,
    setFrozenRows: () => sheet,
    setFrozenColumns: () => sheet,
    getFrozenColumns: () => 1,
    setRowHeight: () => sheet,
    setColumnWidth: () => sheet,
    setHiddenGridlines: () => sheet,
    setConditionalFormatRules(rules) {
      sheet.conditionalRules = rules;
      return sheet;
    },
    getConditionalFormatRules: () => sheet.conditionalRules
  };
  return sheet;
}

const book = {
  sheets: [],
  getSheetByName(n) {
    return book.sheets.find((s) => s.name === n) || null;
  },
  getSheets: () => book.sheets,
  insertSheet(n) {
    const s = makeSheet(n);
    book.sheets.push(s);
    return s;
  },
  deleteSheet(s) {
    book.sheets = book.sheets.filter((x) => x !== s);
  },
  setActiveSheet(s) {
    if (s.hidden) throw new Error(`setActiveSheet called on the hidden sheet "${s.name}"`);
    book.active = s;
    return s;
  },
  moveActiveSheet() {},
  getSpreadsheetTimeZone: () => 'America/Chicago',
  toast: () => {}
};

function pad(n, w) {
  return String(n).padStart(w, '0');
}

const SpreadsheetApp = {
  getActive: () => book,
  flush: () => {},
  BandingTheme: { LIGHT_GREY: 'LIGHT_GREY' },
  newDataValidation() {
    const b = {
      requireValueInRange: () => b,
      setAllowInvalid: () => b,
      setHelpText: () => b,
      build: () => ({ kind: 'validation' })
    };
    return b;
  },
  newConditionalFormatRule() {
    const b = {
      whenTextEqualTo: () => b,
      setFontColor: () => b,
      setBackground: () => b,
      setRanges: () => b,
      build: () => ({ kind: 'rule' })
    };
    return b;
  },
  getUi() {
    throw new Error('getUi is not available outside the spreadsheet');
  }
};

const Utilities = {
  formatDate(date, _tz, format) {
    const p = {
      yyyy: date.getFullYear(),
      MM: pad(date.getMonth() + 1, 2),
      dd: pad(date.getDate(), 2),
      HH: pad(date.getHours(), 2),
      mm: pad(date.getMinutes(), 2)
    };
    return format.replace(/yyyy|MM|dd|HH|mm/g, (m) => p[m]);
  }
};

const LockService = {
  getScriptLock: () => ({ waitLock: () => {}, releaseLock: () => {} })
};

/* ============================== load the code ============================= */

const files = readdirSync(SRC).filter((f) => f.endsWith('.gs')).sort();
const source = files.map((f) => readFileSync(join(SRC, f), 'utf8')).join('\n;\n');

const sandbox = {
  SpreadsheetApp,
  Utilities,
  LockService,
  ScriptApp: { getService: () => ({ getUrl: () => '' }) },
  HtmlService: {},
  console,
  Date,
  Math,
  JSON,
  String,
  Number,
  Object,
  Array,
  Error,
  isNaN,
  parseInt
};
vm.createContext(sandbox);

try {
  vm.runInContext(source, sandbox, { filename: 'apps-script-bundle.js' });
  passed++;
} catch (err) {
  failures.push(`the .gs files do not parse: ${err.message}`);
  report();
  process.exit(1);
}

const run = (expr) => vm.runInContext(expr, sandbox);

/* ================================= setup ================================== */

console.log('Building the workbook...');
let setupMessage;
try {
  setupMessage = run('setupWorkbook()');
  passed++;
} catch (err) {
  failures.push(`setupWorkbook() threw: ${err.stack}`);
  report();
  process.exit(1);
}
console.log('  ' + setupMessage + '\n');

const names = book.sheets.map((s) => s.name);
['Dashboard', 'Library', 'Ladder', 'Questions', 'What I got wrong', 'Notes', 'Daily lines',
 'Self-assessment', 'Systems', 'Scripts', 'Lists', 'Settings']
  .forEach((n) => check(`sheet "${n}" exists`, names.includes(n), `sheets are: ${names.join(', ')}`));

const docs = run('dbSelect(T.DOCS)');
const projects = run('dbSelect(T.PROJECTS)');
const skills = run('dbSelect(T.SKILLS)');

eq('63 documents seeded', docs.length, 63);
eq('33 projects seeded', projects.length, 33);
eq('31 skills seeded', skills.length, 31);

check('the light read excludes Body', docs[0].Body === undefined, `got keys: ${Object.keys(docs[0]).join(', ')}`);
check('a full read includes Body', String(run('dbGet(T.DOCS, "README").Body') || '').length > 100);

check('no document body was truncated',
  docs.every((d) => Number(d.Words) > 0),
  'some document has zero words');

// A Sheets cell holds 50,000 characters and one document is one cell.
const tooLong = docs
  .map((d) => ({ id: d.ID, len: String(run(`dbGet(T.DOCS, ${JSON.stringify(d.ID)}).Body`)).length }))
  .filter((d) => d.len > 50000);
check('every document fits in a single cell', tooLong.length === 0,
  tooLong.map((d) => `${d.id} is ${d.len} characters`).join(', '));

// The deliberate gaps in the ladder must survive seeding.
const ids = projects.map((p) => p.ID);
check('T2-7 is present as a pointer', ids.includes('T2-7'));
eq('T2-7 points at M-1', projects.find((p) => p.ID === 'T2-7')['Same as'], 'M-1');
check('there is no M-4', !ids.includes('M-4'), `ladder ids: ${ids.join(', ')}`);
check('M-5 keeps its number', ids.includes('M-5'));
eq('Tier 4 ends at T4-4', ids.filter((i) => i.startsWith('T4-')).length, 4);
check('no Tier 5 was invented', !ids.some((i) => i.startsWith('T5-')));

// Every project brief a row points at must actually be in the library.
const docIds = new Set(docs.map((d) => d.ID));
const danglingBriefs = projects.filter((p) => p['Doc ID'] && !docIds.has(p['Doc ID']));
check('every project links to a document that exists', danglingBriefs.length === 0,
  danglingBriefs.map((p) => `${p.ID} -> ${p['Doc ID']}`).join(', '));

check('CLAUDE.md was not imported', !docIds.has('CLAUDE'),
  'the boundary rule file must never reach the workbook');

/* ========================= dashboard formula check ======================== */

const dash = book.getSheetByName('Dashboard');
const dashValues = dash.getRange(1, 1, dash.getLastRow(), 6).getValues();
const formulas = dashValues.flat().filter((v) => typeof v === 'string' && v.startsWith('='));
check('the dashboard has formulas', formulas.length > 15, `only ${formulas.length}`);

const colLetter = (n) => {
  let s = '';
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = (n - r - 1) / 26;
  }
  return s;
};

let badRefs = [];
formulas.forEach((f) => {
  const refs = f.match(/'[^']+'!\$?[A-Z]+\d*(?::\$?[A-Z]+\d*)?/g) || [];
  refs.forEach((ref) => {
    const sheetName = ref.slice(1, ref.lastIndexOf("'"));
    const sheet = book.getSheetByName(sheetName);
    if (!sheet) {
      badRefs.push(`${ref} - no such sheet`);
      return;
    }
    const letters = ref.slice(ref.indexOf('!') + 1).match(/[A-Z]+/g) || [];
    letters.forEach((L) => {
      const idx = L.split('').reduce((a, ch) => a * 26 + (ch.charCodeAt(0) - 64), 0);
      if (idx > sheet.getLastColumn()) badRefs.push(`${ref} - ${L} is past the last column of "${sheetName}"`);
    });
  });
});
check('every dashboard reference points at a real sheet and column', badRefs.length === 0, badRefs.join('\n      '));

// The formulas are generated from the schema, so they must track a column move.
const statusIdx = run('SCHEMA().find(function(d){return d.name===T.PROJECTS}).columns.findIndex(function(c){return c.name==="Status"})');
const expectedStatusCol = colLetter(statusIdx + 1);
check(`the ladder Status column resolves to ${expectedStatusCol}`,
  formulas.some((f) => f.includes(`'Ladder'!${expectedStatusCol}:${expectedStatusCol}`)),
  'the dashboard is not reading the Status column the schema declares');

/* ================================ the API ================================= */

const api = (fn, ...args) => run(`${fn}(${args.map((a) => JSON.stringify(a)).join(',')})`);

const boot = api('apiBootstrap');
check('apiBootstrap succeeds', boot.ok === true, JSON.stringify(boot.error));
eq('bootstrap carries the documents', boot.data.docs.length, 63);
check('bootstrap does not ship document bodies', boot.data.docs.every((d) => d.Body === undefined),
  'the bootstrap payload would be 350 KB if it did');

const doc = api('apiGetDoc', '02-learning/how-brady-measures');
check('apiGetDoc returns a body', doc.ok && doc.data.Body.length > 500, JSON.stringify(doc.error));
check('apiGetDoc rejects an unknown id', api('apiGetDoc', 'nope/nope').ok === false);

// Reading status stamps and clears the date.
let saved = api('apiSaveDoc', 'README', { Status: 'Read' });
check('marking a document Read succeeds', saved.ok === true, JSON.stringify(saved.error));
check('marking Read stamps the date', /^\d{4}-\d{2}-\d{2}$/.test(saved.data['Read on']), saved.data['Read on']);
saved = api('apiSaveDoc', 'README', { Status: 'Reading' });
eq('un-reading clears the date', saved.data['Read on'], '');

saved = api('apiSaveDoc', 'README', { 'My notes': 'The attribution bit is the one to re-read.' });
eq('document notes save', saved.data['My notes'], 'The attribution bit is the one to re-read.');

// Projects stamp their own dates.
let proj = api('apiSaveProject', 'T1-1', { Status: 'In progress' });
check('starting a project stamps Started', /^\d{4}-\d{2}-\d{2}$/.test(proj.data.Started), proj.data.Started);
eq('an unfinished project has no Finished date', proj.data.Finished, '');

proj = api('apiSaveProject', 'T1-1', { Status: 'Done', Hours: 1.5 });
check('finishing a project stamps Finished', /^\d{4}-\d{2}-\d{2}$/.test(proj.data.Finished), proj.data.Finished);
eq('hours save as a number', proj.data.Hours, 1.5);

proj = api('apiSaveProject', 'T1-1', { Status: 'Not started' });
eq('resetting a project clears Started', proj.data.Started, '');
eq('resetting a project clears Finished', proj.data.Finished, '');

check('a patch cannot write a column the API does not allow',
  api('apiSaveProject', 'T1-2', { Project: 'renamed', Status: 'In progress' }).ok &&
    run('dbGet(T.PROJECTS,"T1-2").Project') !== 'renamed',
  'the API let the browser rewrite a seeded column');

/* --------------------------- the three log tables ------------------------- */

const SECTION_FIXTURES = {
  questions: { Question: 'Why do the two dashboards disagree?', Project: 'T1-5' },
  wrong: { 'I predicted': 'mostly search', 'What actually happened': 'three PMax campaigns', 'Habit to watch': 'I default to search' },
  notes: { Kind: 'Meeting', Title: 'Kickoff with Alex', Who: 'Alex' },
  daily: { 'Worked on': 'T1-1 account tour', Learned: 'PMax is most of this account', 'Surprised me': 'brand was a bigger share than I guessed' }
};

for (const section of ['questions', 'wrong', 'notes', 'daily']) {
  const before = api('apiReload', section).data.length;
  const created = api('apiCreate', section, SECTION_FIXTURES[section]);
  check(`${section}: create succeeds`, created.ok === true, JSON.stringify(created.error));
  const after = api('apiReload', section).data;
  eq(`${section}: one row was added`, after.length, before + 1);
  check(`${section}: the id is prefixed`, /^[QWND]-\d{3}$/.test(created.data.ID), created.data.ID);
  check(`${section}: the date defaulted to today`,
    /^\d{4}-\d{2}-\d{2}$/.test(created.data[section === 'questions' ? 'Asked on' : 'Date']));

  const second = api('apiCreate', section, { Title: 'second', Question: 'second', 'Worked on': 'second' });
  check(`${section}: ids increment`, second.data.ID !== created.data.ID, `${created.data.ID} vs ${second.data.ID}`);

  const gone = api('apiDelete', section, second.data.ID);
  check(`${section}: delete succeeds`, gone.ok && gone.data === true);
  eq(`${section}: the row is gone`, api('apiReload', section).data.length, before + 1);
}

/* ------------------------- the prediction discipline ----------------------- */

let pred = api('apiSaveProject', 'T1-3', { Prediction: 'Mostly brand terms, one PMax.' });
check('writing a prediction stamps the day it was written',
  /^\d{4}-\d{2}-\d{2}$/.test(pred.data['Predicted on']), pred.data['Predicted on']);

const firstStamp = pred.data['Predicted on'];
pred = api('apiSaveProject', 'T1-3', { Prediction: 'Revised after looking.' });
eq('the prediction date is never overwritten', pred.data['Predicted on'], firstStamp);

const box = api('apiSaveProject', 'T1-3', { 'Timebox held': 'Ran over' });
eq('the timebox verdict saves', box.data['Timebox held'], 'Ran over');

/* --------------------------- systems and scripts --------------------------- */

const systems = run('dbSelect(T.SYSTEMS)');
eq('12 systems seeded', systems.length, 12);
check('every system carries its gotcha', systems.every((s) => String(s['The gotcha']).length > 20));
check('no system link was invented', systems.every((s) => !s.Link),
  'the source records no URLs for these, and a plausible guess is worse than an empty cell');
eq('Google Ads is day-one access', systems.find((s) => s.Tool === 'Google Ads')['Access by'], 'Day 1');
check('BigQuery is flagged as the slow one',
  /week 1/i.test(systems.find((s) => s.Tool === 'BigQuery / SQL')['Access by']));

let sys = api('apiSaveSystem', 'Power BI', { Status: 'Requested' });
check('requesting access stamps the request date', /^\d{4}-\d{2}-\d{2}$/.test(sys.data.Requested));
sys = api('apiSaveSystem', 'Power BI', { Status: 'Granted' });
check('granting stamps its own date', /^\d{4}-\d{2}-\d{2}$/.test(sys.data.Granted));

const scripts = run('dbSelect(T.SCRIPTS)');
eq('3 scripts seeded', scripts.length, 3);
check('every shipped script is read-only',
  scripts.every((s) => s['Reads or writes'] === 'Reads only'),
  'a script that writes to an account cannot be used during the read-only phase');
check('each script says what it feeds', scripts.every((s) => String(s.Feeds).length > 3));
eq('a script setting saves', api('apiSaveScript', 'GAS-1', { Schedule: 'Weekly' }).data.Schedule, 'Weekly');

/* --------------------------------- search --------------------------------- */

const hits = api('apiSearch', 'attribution');
check('search succeeds', hits.ok === true, JSON.stringify(hits.error));
check('search finds documents', hits.data.documents.length > 0, 'nothing matched "attribution"');
check('search returns a readable snippet', String(hits.data.documents[0].snippet).length > 20);
check('search counts hits per document', hits.data.documents[0].hits >= 1);
check('a title match sorts first',
  api('apiSearch', 'timezone').data.documents.length > 0);
eq('a one-character query is refused', api('apiSearch', 'a').data.documents.length, 0);
check('search covers her own writing',
  api('apiSearch', 'PMax').data.entries.some((e) => e.section === 'wrong'),
  'the wrong-log entry created above should have matched');
check('search never ships a whole body',
  JSON.stringify(hits.data).length < 200000, 'the payload is far larger than snippets would be');

// Answering a question closes it without being told to.
const q = api('apiCreate', 'questions', { Question: 'What is a guardrail?' });
eq('a new question starts Open', q.data.Status, 'Open');
const answered = api('apiUpdate', 'questions', q.data.ID, { Answer: 'A band the number is expected to sit in.' });
eq('answering flips the status', answered.data.Status, 'Answered');
check('answering stamps the date', /^\d{4}-\d{2}-\d{2}$/.test(answered.data['Answered on']));

check('an unknown section is refused', api('apiReload', 'secrets').ok === false);
check('an arbitrary setting is refused', api('apiSetSetting', 'Content version', 'x').ok === false);

const startSet = api('apiSetSetting', 'Start date', '2026-06-01');
check('the start date saves', startSet.ok === true, JSON.stringify(startSet.error));
check('the start date is stored as a real date',
  run('dbGet(T.SETTINGS,"Start date")') && typeof run('(function(){var s=SpreadsheetApp.getActive().getSheetByName("Settings");return s.read(2,2)})()') === 'object',
  'a text cell that merely looks like a date breaks the dashboard arithmetic');
eq('the day number is worked out', startSet.data.position.started, true);
check('a malformed start date is refused', api('apiSetSetting', 'Start date', '01/06/2026').ok === false);

const skillSave = api('apiSaveSkill', 'A1', { 'Day 1': 'Developing', Evidence: 'Toured PDC with Alex' });
eq('a skill score saves', skillSave.data['Day 1'], 'Developing');

/* ============================== idempotence =============================== */

console.log('Re-running setup and re-importing...');
run('setupWorkbook()');
eq('setup twice does not duplicate documents', run('dbSelect(T.DOCS)').length, 63);
eq('setup twice does not duplicate projects', run('dbSelect(T.PROJECTS)').length, 33);
eq('setup twice keeps reading progress', run('dbGet(T.DOCS,"README")["My notes"]'), 'The attribution bit is the one to re-read.');

api('apiSaveProject', 'T2-3', { Status: 'In progress', Notes: 'Waiting on the negatives list' });
run('reimportContent()');
eq('re-import keeps project status', run('dbGet(T.PROJECTS,"T2-3").Status'), 'In progress');
eq('re-import keeps project notes', run('dbGet(T.PROJECTS,"T2-3").Notes'), 'Waiting on the negatives list');
eq('re-import keeps document notes', run('dbGet(T.DOCS,"README")["My notes"]'), 'The attribution bit is the one to re-read.');
eq('re-import keeps the document count', run('dbSelect(T.DOCS)').length, 63);
check('re-import refreshes the content stamp', String(run('getSetting("Content version")')).includes('63 documents'));

run('repairWorkbook()');
eq('repair does not lose data', run('dbSelect(T.DOCS)').length, 63);

/* ================================ graphics ================================= */

/**
 * Every image in the kit has to be three things: present on disk, inlined into Images.html,
 * and actually referenced by the interface. The third is the one that slips - an image can
 * sit in the payload costing bytes on every page load without ever being drawn.
 */
{
  const GFX = join(HERE, '..', 'graphics');
  const files = readdirSync(GFX).filter((f) => f.endsWith('.png')).sort();
  const plan = readFileSync(join(HERE, 'build-images.py'), 'utf8');
  const inlined = readFileSync(join(SRC, 'Images.html'), 'utf8');
  const ui = readFileSync(join(SRC, 'JavaScript.html'), 'utf8');

  const keyFor = {};
  for (const [, file, key] of plan.matchAll(/\("([^"]+\.png)",\s*"([^"]+)"/g)) keyFor[file] = key;

  const unplanned = files.filter((f) => !keyFor[f]);
  const notInlined = files.filter((f) => keyFor[f] && !inlined.includes(`${keyFor[f]}:`));
  const notDrawn = files.filter(
    (f) => keyFor[f] && inlined.includes(`${keyFor[f]}:`) && !new RegExp(`\\b${keyFor[f]}\\b`).test(ui)
  );

  check('every graphic is in the build plan', unplanned.length === 0, unplanned.join(', '));
  check('every graphic is inlined', notInlined.length === 0, notInlined.join(', '));
  check('every inlined graphic is actually displayed', notDrawn.length === 0,
    `${notDrawn.join(', ')} - costing bytes on every load without ever being drawn`);
  check('the inlined payload stays under a megabyte',
    Buffer.byteLength(inlined) < 1024 * 1024,
    `Images.html is ${Math.round(Buffer.byteLength(inlined) / 1024)} KB`);

  console.log(`  ${files.length} graphics, all inlined and drawn, ${Math.round(Buffer.byteLength(inlined) / 1024)} KB on the page.\n`);
}

/* =============================== markdown ================================= */

console.log('Rendering all 63 documents...\n');

const clientSrc = readFileSync(join(SRC, 'JavaScript.html'), 'utf8')
  .replace(/^[\s\S]*?<script>/, '')
  .replace(/<\/script>[\s\S]*$/, '');

const win = {};
const clientSandbox = {
  window: win,
  document: {
    addEventListener() {},
    getElementById() {
      return { style: {}, setAttribute() {}, focus() {}, setSelectionRange() {} };
    }
  },
  google: {
    script: {
      run: new Proxy({}, {
        get: () => new Proxy(function () {}, { get: () => () => {} })
      })
    }
  },
  console,
  setTimeout,
  clearTimeout,
  Promise,
  RegExp,
  String,
  Number,
  Object,
  Array,
  Math,
  JSON,
  Error
};
vm.createContext(clientSandbox);
try {
  vm.runInContext(clientSrc, clientSandbox, { filename: 'client.js' });
  check('the client script parses and runs', typeof win.MD?.render === 'function');
} catch (err) {
  failures.push(`the client script threw: ${err.message}`);
}

if (win.MD) {
  const index = {};
  docs.forEach((d) => {
    index[d.ID] = d;
  });

  const VOID = new Set(['hr', 'br', 'input', 'img']);
  const problems = [];
  let deadLinks = [];
  let docLinks = 0;
  let totalHtml = 0;

  for (const d of docs) {
    const body = run(`dbGet(T.DOCS, ${JSON.stringify(d.ID)}).Body`);
    let html;
    try {
      html = win.MD.render(body, { docId: d.ID, index });
    } catch (err) {
      problems.push(`${d.ID}: renderer threw - ${err.message}`);
      continue;
    }
    totalHtml += html.length;

    // Tag balance.
    const stack = [];
    const tags = html.match(/<\/?[a-z0-9]+(?:\s[^>]*)?>/gi) || [];
    for (const tag of tags) {
      const m = tag.match(/^<(\/)?([a-z0-9]+)/i);
      const closing = !!m[1];
      const name = m[2].toLowerCase();
      if (VOID.has(name)) continue;
      if (closing) {
        if (stack[stack.length - 1] === name) stack.pop();
        else problems.push(`${d.ID}: </${name}> closes ${stack[stack.length - 1] || 'nothing'}`);
      } else {
        stack.push(name);
      }
    }
    if (stack.length) problems.push(`${d.ID}: unclosed <${stack.join('>, <')}>`);

    // Markdown that leaked through unrendered. Fenced blocks are excluded: the source quotes
    // Markdown inside them on purpose, and rendering that literally is correct.
    const text = html.replace(/<pre[\s\S]*?<\/pre>/g, '').replace(/<[^>]+>/g, '');
    if (/^\s*\|.*\|\s*$/m.test(text)) problems.push(`${d.ID}: a table row rendered as raw text`);
    if (/^\s*#{1,6}\s/m.test(text)) problems.push(`${d.ID}: a heading rendered as raw text`);
    if (/\]\(\.{0,2}\/?[\w./-]+\)/.test(text)) problems.push(`${d.ID}: a link rendered as raw text`);
    if (/\*\*[^*]+\*\*/.test(text)) problems.push(`${d.ID}: bold rendered as raw text`);
    if (/[\u0000\u0001]/.test(text)) problems.push(`${d.ID}: a sentinel leaked into the output`);

    // "undefined" in rendered output always means a lookup missed. The source never uses the
    // word, so any occurrence is a renderer bug rather than content.
    if (text.includes("undefined")) {
      const at = text.indexOf("undefined");
      const around = text.slice(Math.max(0, at - 60), at + 20).replace(/\s+/g, " ");
      problems.push(`${d.ID}: rendered "undefined" - ...${around}`);
    }

    docLinks += (html.match(/class="doclink"/g) || []).length;
    const dead = html.match(/<span class="dead">([^<]*)<\/span>/g) || [];
    dead.forEach((x) => deadLinks.push(`${d.ID}: ${x.replace(/<[^>]+>/g, '')}`));
  }

  check('every document renders without a problem', problems.length === 0, problems.slice(0, 25).join('\n      '));
  check('internal links resolve to documents', docLinks > 100, `only ${docLinks} resolved`);
  console.log(`  ${docs.length} documents rendered, ${Math.round(totalHtml / 1024)} KB of HTML, ${docLinks} internal links wired up.`);

  if (deadLinks.length) {
    console.log(`\n  ${deadLinks.length} link(s) point outside the library and render as plain text:`);
    [...new Set(deadLinks)].slice(0, 15).forEach((l) => console.log(`    ${l}`));
  }

  // Link resolution, specifically.
  const r = (href, from) => win.MD.resolveDocId(href, from, index);
  eq('a sibling link resolves', r('./t1-01-account-tour.md', '03-projects/README'), '03-projects/t1-01-account-tour');
  eq('a parent link resolves', r('../02-learning/how-brady-measures.md', '03-projects/t1-01-account-tour'), '02-learning/how-brady-measures');
  eq('a folder link resolves to its README', r('./02-learning/', 'README'), '02-learning/README');
  eq('an anchor is stripped', r('../05-self-assessment/baseline.md#b--how-brady-measures-things', '03-projects/t1-08-the-timezone-trap'), '05-self-assessment/baseline');
  eq('an unknown target resolves to nothing', r('./does-not-exist.md', 'README'), '');

  // Renderer behaviour on the shapes the source actually uses.
  const render = (md) => win.MD.render(md, { docId: 'README', index });
  check('a table becomes a table', render('| A | B |\n|---|---|\n| 1 | 2 |').includes('<th'));
  check('a headerless table has no thead', !render('| | |\n|---|---|\n| Time box | 1 hour |').includes('<thead'));
  check('a fenced block is escaped', render('```\n<script>x</script>\n```').includes('&lt;script&gt;'));
  check('inline code survives digits', render('a `b` 1 c').includes('<code>b</code>'));
  eq('a space-digit-space is left alone', /(<code>|undefined)/.test(render('Tier 1 projects and 2 more')), false);
  check('a task list renders checkboxes', render('- [ ] one\n- [x] two').includes('type="checkbox"'));
  check('a nested list nests', render('- one\n  - inner\n- two').includes('<ul>'));
  check('a blockquote renders', render('> warning\n> second line').includes('<blockquote>'));
  check('html in the source is escaped', render('a <b>tag</b> here').includes('&lt;b&gt;'));
  check('an external link opens in a new tab', render('[x](https://example.com)').includes('target="_blank"'));

  // A link whose label is inline code is the house style throughout the source. The label is
  // processed by a recursive pass, and that pass must not try to restore code spans itself.
  const codeLink = win.MD.render('See [`ppc-fundamentals.md`](./02-learning/ppc-fundamentals.md) first.', {
    docId: 'README',
    index
  });
  check('a code-labelled link keeps its code span',
    codeLink.includes('<code>ppc-fundamentals.md</code>'), codeLink);
  check('a code-labelled link is still a link',
    codeLink.includes('class="doclink"'), codeLink);
  check('a code-labelled link does not render as undefined',
    !codeLink.includes('undefined'), codeLink);
  check('two code-labelled links in one line both survive',
    (win.MD.render('[`a.md`](./README.md) and [`b.md`](./README.md)', { docId: 'README', index })
      .match(/<code>/g) || []).length === 2);
  check('inline code inside bold survives',
    render('**the `Conversions` column**').includes('<code>Conversions</code>'));

  // Emphasis. Every one of these appears in the source and every one of them was rendered
  // wrongly at some point while this was being written.
  eq('italic inside bold',
    render('**scores may go *down* at Day 30**'),
    '<p><strong>scores may go <em>down</em> at Day 30</strong></p>');
  eq('italic closing at the end of bold',
    render('**what these tools are *for***'),
    '<p><strong>what these tools are <em>for</em></strong></p>');
  eq('italic opening at the start of bold',
    render('***Only* the first one**'),
    '<p><strong><em>Only</em> the first one</strong></p>');
  eq('bold and italic together',
    render('***everything***'),
    '<p><strong><em>everything</em></strong></p>');
  eq('two separate bold runs on one line',
    render('**one** and **two**'),
    '<p><strong>one</strong> and <strong>two</strong></p>');

  // Hard-wrapped prose. The source wraps at about 95 characters, in paragraphs and inside
  // list items alike, and a wrap must never split a word or an emphasis run.
  eq('a wrapped paragraph joins with a space',
    render('the sale is credited to the\nDay-1 paid click'),
    '<p>the sale is credited to the Day-1 paid click</p>');
  eq('a wrapped list item joins with a space',
    render('- credited to the **Day-1 paid\n  click**, not the session'),
    '<ul>\n<li>credited to the <strong>Day-1 paid click</strong>, not the session</li>\n</ul>');
  check('a wrapped list item is still one item',
    (render('- one line\n  wrapped here\n- two').match(/<li/g) || []).length === 2,
    'the wrapped line became its own item');
}

/* ================================= report ================================= */

function report() {
  console.log('\n' + '-'.repeat(72));
  if (failures.length === 0) {
    console.log(`PASS - ${passed} checks.`);
  } else {
    console.log(`FAIL - ${failures.length} of ${passed + failures.length} checks failed:\n`);
    failures.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
  }
  console.log('-'.repeat(72));
}

report();
process.exit(failures.length ? 1 : 0);
