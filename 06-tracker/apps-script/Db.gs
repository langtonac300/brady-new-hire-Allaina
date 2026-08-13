/**
 * Db.gs - the thin layer that treats each sheet as a table.
 *
 * Everything reads and writes by column *name*, never by column letter or index. That is the
 * whole point: you can insert a column in the middle of a sheet, or drag one somewhere more
 * convenient, and nothing here breaks.
 *
 * Two rules worth knowing:
 *   - Columns marked `heavy` in Schema.gs are not loaded unless asked for. The Library's
 *     Body column is 350 KB of text; loading it to draw a list of titles would be slow.
 *   - Every write takes a script lock. Two browser tabs saving at once is a normal thing to
 *     do and it should not interleave into a half-written row.
 */

var LOCK_MS = 20000;

function ss() {
  return SpreadsheetApp.getActive();
}

function tz() {
  return ss().getSpreadsheetTimeZone();
}

function sheetFor(name) {
  var sheet = ss().getSheetByName(name);
  if (!sheet) {
    throw new Error(
      'The "' + name + '" sheet is missing. Run Ramp workbook > Repair workbook from the menu.'
    );
  }
  return sheet;
}

/** Column name -> zero-based index, read from row 1. */
function headerMap(sheet) {
  var width = sheet.getLastColumn();
  if (width === 0) return {};
  var headers = sheet.getRange(1, 1, 1, width).getValues()[0];
  var map = {};
  headers.forEach(function (h, i) {
    var key = String(h).trim();
    if (key) map[key] = i;
  });
  return map;
}

/** How many columns can be read before the first heavy one. Heavy columns sit at the end. */
function lightWidth(def) {
  for (var i = 0; i < def.columns.length; i++) {
    if (def.columns[i].heavy) return i;
  }
  return def.columns.length;
}

function columnDef(def, name) {
  for (var i = 0; i < def.columns.length; i++) {
    if (def.columns[i].name === name) return def.columns[i];
  }
  return null;
}

/** Sheet value -> something safe to hand to the browser. Dates become strings; the client
 *  never has to think about time zones, and google.script.run never has to serialise a Date. */
function toDisplay(value, colDef) {
  if (value === null || value === undefined || value === '') return '';
  if (Object.prototype.toString.call(value) === '[object Date]') {
    var fmt = colDef && colDef.name === 'Updated' ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd';
    return Utilities.formatDate(value, tz(), fmt);
  }
  return value;
}

/** Browser value -> something worth storing. Empty stays empty rather than becoming 0 or
 *  an Invalid Date, which is what makes blank cells stay genuinely blank. */
function fromInput(value, colDef) {
  if (value === null || value === undefined || value === '') return '';
  var type = colDef && colDef.type;
  if (type === 'date') {
    if (Object.prototype.toString.call(value) === '[object Date]') return value;
    var parts = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!parts) return '';
    return new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
  }
  if (type === 'number') {
    var n = Number(value);
    return isNaN(n) ? '' : n;
  }
  return value;
}

/**
 * Read a table.
 *
 * @param {string} name  sheet name
 * @param {Object} [opts]  {heavy: true} to include heavy columns
 * @return {Array<Object>} one object per row, keyed by column name, plus `_row`
 */
function dbSelect(name, opts) {
  opts = opts || {};
  var def = tableDef(name);
  var sheet = sheetFor(name);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  var width = opts.heavy ? sheet.getLastColumn() : Math.min(lightWidth(def), sheet.getLastColumn());
  if (width < 1) return [];

  var headers = sheet.getRange(1, 1, 1, width).getValues()[0];
  var values = sheet.getRange(2, 1, lastRow - 1, width).getValues();

  return values
    .map(function (row, i) {
      var obj = { _row: i + 2 };
      headers.forEach(function (h, c) {
        var key = String(h).trim();
        if (key) obj[key] = toDisplay(row[c], columnDef(def, key));
      });
      return obj;
    })
    .filter(function (obj) {
      return String(obj[def.key] || '').length > 0;
    });
}

/** Find the sheet row number for a key, or -1. Reads only the key column. */
function rowNumberFor(sheet, def, id) {
  var map = headerMap(sheet);
  var keyCol = map[def.key];
  var lastRow = sheet.getLastRow();
  if (lastRow < 2 || keyCol === undefined) return -1;

  var keys = sheet.getRange(2, keyCol + 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < keys.length; i++) {
    if (String(keys[i][0]) === String(id)) return i + 2;
  }
  return -1;
}

/**
 * One row by key, heavy columns included.
 *
 * This reads the key column to locate the row and then that row alone - it deliberately does
 * not go through dbSelect, because on the Library that would pull every document body into
 * memory to return one of them.
 */
function dbGet(name, id) {
  var def = tableDef(name);
  var sheet = sheetFor(name);
  var target = rowNumberFor(sheet, def, id);
  if (target === -1) return null;

  var width = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, width).getValues()[0];
  var values = sheet.getRange(target, 1, 1, width).getValues()[0];

  var obj = { _row: target };
  headers.forEach(function (h, c) {
    var key = String(h).trim();
    if (key) obj[key] = toDisplay(values[c], columnDef(def, key));
  });
  return obj;
}

/** Patch one row in place. Only the keys present in `patch` are touched, so two callers
 *  editing different fields of the same row cannot clobber each other's work. */
function dbUpdate(name, id, patch) {
  var lock = LockService.getScriptLock();
  lock.waitLock(LOCK_MS);
  try {
    var def = tableDef(name);
    var sheet = sheetFor(name);
    var map = headerMap(sheet);
    if (map[def.key] === undefined) throw new Error('No "' + def.key + '" column on ' + name + '.');

    var target = rowNumberFor(sheet, def, id);
    if (target === -1) throw new Error('No row with ' + def.key + ' "' + id + '" on ' + name + '.');

    if (map.Updated !== undefined && patch.Updated === undefined) patch.Updated = new Date();

    Object.keys(patch).forEach(function (field) {
      var col = map[field];
      if (col === undefined) return;
      sheet.getRange(target, col + 1).setValue(fromInput(patch[field], columnDef(def, field)));
    });

    SpreadsheetApp.flush();
    return dbGet(name, id);
  } finally {
    lock.releaseLock();
  }
}

/** The body of an append, without the lock. Callers below hold it. */
function insertRow(name, obj) {
  var def = tableDef(name);
  var sheet = sheetFor(name);
  var map = headerMap(sheet);
  if (map.Updated !== undefined && obj.Updated === undefined) obj.Updated = new Date();

  var width = sheet.getLastColumn();
  var row = new Array(width).fill('');
  Object.keys(obj).forEach(function (field) {
    var col = map[field];
    if (col === undefined) return;
    row[col] = fromInput(obj[field], columnDef(def, field));
  });

  sheet.appendRow(row);
  SpreadsheetApp.flush();
  return dbGet(name, obj[def.key]);
}

/** Append a row. Missing fields are written as blanks so the row stays rectangular. */
function dbInsert(name, obj) {
  var lock = LockService.getScriptLock();
  lock.waitLock(LOCK_MS);
  try {
    return insertRow(name, obj);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Append a row and give it the next ID, both under one lock.
 *
 * Working out the next ID and then inserting are two separate steps, and if they take the
 * lock separately then two saves landing together can both read the same highest number and
 * both claim it. One lock around the pair closes that.
 */
function dbInsertWithId(name, prefix, obj) {
  var lock = LockService.getScriptLock();
  lock.waitLock(LOCK_MS);
  try {
    obj[tableDef(name).key] = nextId(name, prefix);
    return insertRow(name, obj);
  } finally {
    lock.releaseLock();
  }
}

/** Delete a row by key. Used only by the web app's delete buttons. */
function dbDelete(name, id) {
  var lock = LockService.getScriptLock();
  lock.waitLock(LOCK_MS);
  try {
    var def = tableDef(name);
    var sheet = sheetFor(name);
    var target = rowNumberFor(sheet, def, id);
    if (target === -1) return false;

    sheet.deleteRow(target);
    SpreadsheetApp.flush();
    return true;
  } finally {
    lock.releaseLock();
  }
}

/**
 * Write many rows in one call. Used by setup and re-import, where appending row by row would
 * be hundreds of round trips.
 */
function dbWriteAll(name, objects) {
  var lock = LockService.getScriptLock();
  lock.waitLock(LOCK_MS);
  try {
    var def = tableDef(name);
    var sheet = sheetFor(name);
    var map = headerMap(sheet);
    var width = sheet.getLastColumn();

    if (sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, width).clearContent();
    }
    if (!objects.length) return 0;

    var rows = objects.map(function (obj) {
      var row = new Array(width).fill('');
      Object.keys(obj).forEach(function (field) {
        var col = map[field];
        if (col === undefined) return;
        row[col] = fromInput(obj[field], columnDef(def, field));
      });
      return row;
    });

    sheet.getRange(2, 1, rows.length, width).setValues(rows);
    SpreadsheetApp.flush();
    return rows.length;
  } finally {
    lock.releaseLock();
  }
}

/** Next ID for the log tables: Q-001, W-014, N-003. Derived from what is already there, so
 *  deleting the last row and adding another does reuse the number - which is fine, these are
 *  handles for the UI rather than an audit trail. */
function nextId(name, prefix) {
  var def = tableDef(name);
  var rows = dbSelect(name);
  var max = 0;
  rows.forEach(function (r) {
    var m = String(r[def.key] || '').match(/^[A-Z]+-(\d+)$/);
    if (m) max = Math.max(max, Number(m[1]));
  });
  var next = String(max + 1);
  while (next.length < 3) next = '0' + next;
  return prefix + '-' + next;
}

/** Settings are a two-column key/value sheet rather than script properties, so they can be
 *  edited in the Sheet without opening the script editor. */
function getSetting(key) {
  var rows = dbSelect(T.SETTINGS);
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].Key === key) return rows[i].Value;
  }
  return '';
}

function setSetting(key, value) {
  var rows = dbSelect(T.SETTINGS);
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].Key === key) return dbUpdate(T.SETTINGS, key, { Value: value });
  }
  return dbInsert(T.SETTINGS, { Key: key, Value: value });
}
