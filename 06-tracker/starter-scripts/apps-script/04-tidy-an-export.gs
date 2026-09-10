/**
 * STARTER 4 - Clean up a pasted export.
 *
 * The genuinely useful one. You paste an export out of Google Ads, and the numbers arrive as
 * TEXT - "$1,234.56" is a string, not a number, so it won't sum and it won't sort. This
 * fixes that, then adds a CPA column and flags the expensive rows.
 *
 * What you'll learn:
 *   - getValues() / setValues() - reading and writing a whole block as an array (the fast way)
 *   - Turning "$1,234.56" into 1234.56
 *   - Adding a calculated column, and highlighting rows worth looking at
 *
 * SET UP: a tab with a header row and columns named (in any order):
 *   Campaign · Cost · Conversions
 * Then select that tab and run cleanUpExport.
 *
 * ⚠️ It rewrites the columns in place. Work on a copy the first time.
 */

var FLAG_CPA_ABOVE = 200;      // rows costing more than this per conversion get highlighted

function cleanUpExport() {
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var ui = SpreadsheetApp.getUi();

  if (sheet.getLastRow() < 2) {
    ui.alert('Need a header row and at least one row of data.');
    return;
  }

  // ONE read for the whole block. Not a loop of getValue() calls.
  var range = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn());
  var data = range.getValues();
  var headers = data[0];

  var costCol = headers.indexOf('Cost');
  var convCol = headers.indexOf('Conversions');

  if (costCol === -1 || convCol === -1) {
    ui.alert('Could not find a "Cost" and a "Conversions" column.\n\n' +
             'Found: ' + headers.join(', '));
    return;
  }

  // --- Clean the numbers, row by row, in memory -------------------------------------------
  for (var i = 1; i < data.length; i++) {
    data[i][costCol] = toNumber_(data[i][costCol]);
    data[i][convCol] = toNumber_(data[i][convCol]);
  }

  // ONE write back.
  range.setValues(data);

  // --- Add a CPA column -------------------------------------------------------------------
  var cpaCol = headers.length + 1;
  sheet.getRange(1, cpaCol).setValue('CPA').setFontWeight('bold');

  var cpaValues = [];
  var flagRows = [];

  for (var r = 1; r < data.length; r++) {
    var cost = data[r][costCol];
    var conv = data[r][convCol];
    var cpa = conv ? cost / conv : '';
    cpaValues.push([cpa]);

    if (cpa !== '' && cpa > FLAG_CPA_ABOVE) flagRows.push(r + 1);   // +1: arrays start at 0
  }

  sheet.getRange(2, cpaCol, cpaValues.length, 1).setValues(cpaValues);

  // --- Flag the expensive ones ------------------------------------------------------------
  for (var f = 0; f < flagRows.length; f++) {
    sheet.getRange(flagRows[f], 1, 1, cpaCol).setBackground('#FCE8E6');
  }

  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, cpaCol);

  SpreadsheetApp.getActive().toast(
    (data.length - 1) + ' rows cleaned · ' + flagRows.length + ' flagged over ' + FLAG_CPA_ABOVE,
    'Done', 5);
}

/**
 * "$1,234.56" -> 1234.56 · "12%" -> 0.12 · "" -> 0
 *
 * Anything that is already a number is passed straight through. Anything that can't be read
 * as a number becomes 0, which is a deliberate choice: a visible 0 is easier to spot than a
 * cell that silently stayed text.
 */
function toNumber_(value) {
  if (typeof value === 'number') return value;
  if (value === '' || value === null) return 0;

  var text = String(value).trim();
  var isPercent = text.indexOf('%') !== -1;

  // Strip everything that isn't a digit, a minus sign or a decimal point.
  var cleaned = text.replace(/[^0-9.\-]/g, '');
  var number = parseFloat(cleaned);

  if (isNaN(number)) return 0;
  return isPercent ? number / 100 : number;
}
