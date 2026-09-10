/**
 * STARTER 1 - Read a cell, write a cell.
 *
 * The foundation. Everything else in Apps Script is this, repeated.
 *
 * What you'll learn:
 *   - SpreadsheetApp.getActive() - "the Sheet this script is attached to"
 *   - getRange / getValue / setValue
 *   - Logger.log() and where the output shows up (View -> Execution log)
 *
 * BEFORE YOU RUN: type anything into cell A1 of the active tab.
 * Then pick sayHello from the function dropdown and press Run.
 */

function sayHello() {
  var sheet = SpreadsheetApp.getActive().getActiveSheet();

  // A1 notation and (row, column) are the same thing said two ways.
  var whatsInA1 = sheet.getRange('A1').getValue();
  var alsoA1    = sheet.getRange(1, 1).getValue();     // row 1, column 1

  Logger.log('A1 contains: ' + whatsInA1);
  Logger.log('Same cell, asked the other way: ' + alsoA1);

  // Now write. B1 gets a timestamp so you can see it happen.
  sheet.getRange('B1').setValue('Script ran at ' + new Date());

  // Reading the sheet's own facts is often more useful than reading a cell.
  Logger.log('Tab name    : ' + sheet.getName());
  Logger.log('Rows used   : ' + sheet.getLastRow());
  Logger.log('Columns used: ' + sheet.getLastColumn());
}

/**
 * The same job done badly, on purpose - so you can feel the difference.
 *
 * Run this and watch how long 200 cells takes. Every setValue() is a separate round trip to
 * Google's servers. Starter 4 shows the fast way: build an array, write once.
 */
function theSlowWay() {
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var started = new Date();

  for (var i = 1; i <= 200; i++) {
    sheet.getRange(i, 5).setValue(i);          // column E, one cell at a time
  }

  Logger.log('200 separate writes took ' + (new Date() - started) + ' ms.');
  Logger.log('Starter 4 does the same thing in one call. Compare the numbers.');
}
