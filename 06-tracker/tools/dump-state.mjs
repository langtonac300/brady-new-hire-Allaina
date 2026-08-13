#!/usr/bin/env node
/**
 * dump-state.mjs - build the workbook in memory and print a bootstrap snapshot as JSON.
 *
 * Used by preview.mjs. It seeds a plausible few weeks of use so the interface can be looked
 * at with something in it rather than empty, which is the state it is hardest to judge.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, '..', 'apps-script');

/* The same stand-in the test harness uses, kept deliberately minimal here. */
const chainable = [
  'setFontWeight', 'setFontFamily', 'setFontColor', 'setBackground', 'setVerticalAlignment',
  'setHorizontalAlignment', 'setWrap', 'setNumberFormat', 'setFontSize', 'setDataValidation',
  'clearDataValidations', 'applyRowBanding', 'setBorder'
];

function makeRange(sheet, row, col, numRows, numCols) {
  const range = {
    getValues() {
      const out = [];
      for (let r = 0; r < numRows; r++) {
        const line = [];
        for (let c = 0; c < numCols; c++) line.push(sheet.read(row + r, col + c));
        out.push(line);
      }
      return out;
    },
    getValue: () => sheet.read(row, col),
    setValues(values) {
      values.forEach((line, r) => line.forEach((v, c) => sheet.write(row + r, col + c, v)));
      return range;
    },
    setValue(v) { sheet.write(row, col, v); return range; },
    clearContent() {
      for (let r = 0; r < numRows; r++) for (let c = 0; c < numCols; c++) sheet.write(row + r, col + c, '');
      return range;
    }
  };
  chainable.forEach((m) => { range[m] = () => range; });
  return range;
}

function makeSheet(name) {
  const cells = new Map();
  const sheet = {
    name, hidden: false, maxRows: 1000, maxCols: 40, rules: [],
    read: (r, c) => (cells.has(`${r}:${c}`) ? cells.get(`${r}:${c}`) : ''),
    write: (r, c, v) => cells.set(`${r}:${c}`, v),
    getName: () => name,
    getMaxRows: () => sheet.maxRows,
    getMaxColumns: () => sheet.maxCols,
    insertRowsAfter: (_a, n) => { sheet.maxRows += n; },
    insertColumnsAfter: (_a, n) => { sheet.maxCols += n; },
    getLastRow() {
      let last = 0;
      for (const [k, v] of cells) if (v !== '' && v != null) last = Math.max(last, Number(k.split(':')[0]));
      return last;
    },
    getLastColumn() {
      let last = 0;
      for (const [k, v] of cells) if (v !== '' && v != null) last = Math.max(last, Number(k.split(':')[1]));
      return last;
    },
    getRange: (row, col, nr = 1, nc = 1) => makeRange(sheet, row, col, nr, nc),
    getDataRange: () => makeRange(sheet, 1, 1, Math.max(sheet.getLastRow(), 1), Math.max(sheet.getLastColumn(), 1)),
    appendRow(values) {
      const row = sheet.getLastRow() + 1;
      values.forEach((v, i) => sheet.write(row, i + 1, v));
    },
    deleteRow(row) {
      const last = sheet.getLastRow();
      const width = sheet.getLastColumn();
      for (let r = row; r < last; r++) for (let c = 1; c <= width; c++) sheet.write(r, c, sheet.read(r + 1, c));
      for (let c = 1; c <= width; c++) sheet.write(last, c, '');
    },
    clear() { cells.clear(); return sheet; },
    getBandings: () => [],
    hideSheet() { sheet.hidden = true; return sheet; },
    showSheet() { sheet.hidden = false; return sheet; },
    isSheetHidden: () => sheet.hidden,
    setFrozenRows: () => sheet, setFrozenColumns: () => sheet, getFrozenColumns: () => 1,
    setRowHeight: () => sheet, setColumnWidth: () => sheet, setHiddenGridlines: () => sheet,
    setConditionalFormatRules(r) { sheet.rules = r; return sheet; },
    getConditionalFormatRules: () => sheet.rules
  };
  return sheet;
}

const book = {
  sheets: [],
  getSheetByName: (n) => book.sheets.find((s) => s.name === n) || null,
  getSheets: () => book.sheets,
  insertSheet(n) { const s = makeSheet(n); book.sheets.push(s); return s; },
  deleteSheet(s) { book.sheets = book.sheets.filter((x) => x !== s); },
  setActiveSheet: (s) => s,
  moveActiveSheet() {},
  getSpreadsheetTimeZone: () => 'America/Chicago',
  toast: () => {}
};

const pad = (n, w) => String(n).padStart(w, '0');

const sandbox = {
  SpreadsheetApp: {
    getActive: () => book,
    flush: () => {},
    BandingTheme: { LIGHT_GREY: 'LIGHT_GREY' },
    newDataValidation() { const b = { requireValueInRange: () => b, setAllowInvalid: () => b, setHelpText: () => b, build: () => ({}) }; return b; },
    newConditionalFormatRule() { const b = { whenTextEqualTo: () => b, setFontColor: () => b, setBackground: () => b, setRanges: () => b, build: () => ({}) }; return b; }
  },
  Utilities: {
    formatDate(date, _tz, format) {
      const p = {
        yyyy: date.getFullYear(), MM: pad(date.getMonth() + 1, 2), dd: pad(date.getDate(), 2),
        HH: pad(date.getHours(), 2), mm: pad(date.getMinutes(), 2)
      };
      return format.replace(/yyyy|MM|dd|HH|mm/g, (m) => p[m]);
    }
  },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  ScriptApp: { getService: () => ({ getUrl: () => '' }) },
  console, Date, Math, JSON, String, Number, Object, Array, Error, isNaN, parseInt
};

vm.createContext(sandbox);
const files = readdirSync(SRC).filter((f) => f.endsWith('.gs')).sort();
vm.runInContext(files.map((f) => readFileSync(join(SRC, f), 'utf8')).join('\n;\n'), sandbox);

const run = (expr) => vm.runInContext(expr, sandbox);
run('setupWorkbook()');

/* A plausible five weeks in, so the interface is judged with content in it. */
const start = new Date();
start.setDate(start.getDate() - 32);
const iso = `${start.getFullYear()}-${pad(start.getMonth() + 1, 2)}-${pad(start.getDate(), 2)}`;

const api = (fn, ...args) => run(`${fn}(${args.map((a) => JSON.stringify(a)).join(',')})`);

api('apiSetSetting', 'Start date', iso);
api('apiSetSetting', 'Display name', 'Allaina');

['T1-1', 'T1-2', 'T1-3', 'T1-4', 'T1-5', 'T1-6', 'T1-7'].forEach((id) => {
  api('apiSaveProject', id, { Status: 'Done', Hours: 1, 'Timebox held': 'Held' });
});
api('apiSaveProject', 'T1-8', { Status: 'In progress', Prediction: 'I expect PDC to be a day behind the others, and I have no idea which rolls over first.' });
api('apiSaveProject', 'T2-1', { Status: 'Ready for readout', Hours: 4 });
api('apiSaveProject', 'M-1', { Status: 'Blocked', Notes: 'Waiting on Mecco access.' });

['01-start-here/README', '01-start-here/how-the-ramp-works', '01-start-here/your-first-two-weeks',
 '02-learning/ppc-fundamentals', '02-learning/cheat-sheet', 'README'].forEach((id) => {
  api('apiSaveDoc', id, { Status: 'Read' });
});
api('apiSaveDoc', '02-learning/how-brady-measures', { Status: 'Reading', 'My notes': 'Third read. The first-touch window is the bit that keeps sliding off.' });

api('apiCreate', 'questions', { Question: 'Why does the MTD dashboard disagree with the platform for the same day?', Project: 'T1-5' });
api('apiCreate', 'questions', { Question: 'What counts as a business day when a holiday falls mid-week?', Project: 'T2-4' });
api('apiCreate', 'questions', { Question: 'Is PMax cannibalising brand on Wristbands, and how would I even tell?' });
api('apiUpdate', 'questions', 'Q-001', { Answer: 'Timezone. PDC is on Los Angeles and the dashboard rolls up on Chicago.', 'Answered by': 'Alex' });

api('apiCreate', 'wrong', {
  Project: 'T1-1',
  'I predicted': 'Mostly search, one PMax, brand a small share of spend.',
  'What actually happened': 'Three PMax campaigns, and brand was a much bigger share than I guessed.',
  'Why I was off': 'I assumed PMax was a small experiment. It is most of how this account runs.',
  'Habit to watch': 'I default to search being the main thing because it is what I learned first.'
});
api('apiCreate', 'wrong', {
  Project: 'T1-4',
  'I predicted': 'One conversion action per account.',
  'What actually happened': 'Nine, and four of them are counted as primary.',
  'Why I was off': 'I read the inventory as a list rather than as a set of decisions someone made.',
  'Habit to watch': 'I treat configuration as fact instead of as somebody past choice.'
});

api('apiCreate', 'notes', { Kind: 'Meeting', Title: 'First L10 huddle', Who: 'The team', Body: 'Seven segments, same order every week. Segue first.', 'Follow-up': 'Bring a segue item next week' });
api('apiCreate', 'notes', { Kind: 'Capture', Title: 'Wristbands stack', Who: 'Alex', Body: 'Shopify, different from everything else at Brady. Steepest part of the curve.', Project: 'T1-9' });

api('apiCreate', 'daily', {
  'Worked on': 'T1-8, pulled one day of spend from all three accounts.',
  Learned: 'An account timezone is set at creation and cannot be changed afterwards.',
  'Surprised me': 'Yesterday means three different windows, and nobody flags it anywhere in the UI.'
});

api('apiSaveSystem', 'Google Ads', { Status: 'Granted' });
api('apiSaveSystem', 'MTD Spend dashboard', { Status: 'Granted' });
api('apiSaveSystem', 'Power BI', { Status: 'Requested' });
api('apiSaveSystem', 'BigQuery / SQL', { Status: 'Requested' });

[['A1', 'Developing'], ['A2', 'Independent'], ['A3', 'Developing'], ['B1', 'Not yet'], ['B2', 'Developing'], ['C1', 'Developing']]
  .forEach(([id, score]) => api('apiSaveSkill', id, { 'Day 1': score }));
[['A1', 'Independent'], ['A2', 'Independent'], ['A3', 'Independent'], ['B1', 'Developing'], ['B2', 'Not yet'], ['C1', 'Independent']]
  .forEach(([id, score]) => api('apiSaveSkill', id, { 'Day 30': score }));

const boot = api('apiBootstrap').data;

/* A few document bodies so the reader has something real in it. */
const bodies = {};
['02-learning/how-brady-measures', '03-projects/t1-08-the-timezone-trap', '01-start-here/how-the-ramp-works',
 '03-projects/README', '02-learning/cheat-sheet'].forEach((id) => {
  bodies[id] = api('apiGetDoc', id).data;
});

process.stdout.write(JSON.stringify({ boot, bodies }));
