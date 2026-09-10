/**
 * STARTER 3 - Your own menu.
 *
 * Until now you've run scripts from the editor. This puts them in the Sheet itself, as a
 * menu next to Help - which is what turns a script into a tool other people can use.
 *
 * What you'll learn:
 *   - onOpen() - a "simple trigger", a function Google runs for you at a known moment
 *   - SpreadsheetApp.getUi() - menus, alerts and prompts
 *   - toast() - the small message in the bottom-right corner
 *
 * AFTER YOU PASTE THIS: save, then RELOAD the Sheet tab. A "My tools" menu appears.
 * You don't run onOpen yourself - opening the Sheet is what runs it.
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('My tools')
    .addItem('Tidy this tab', 'tidyThisTab')
    .addItem('How big is this tab?', 'howBig')
    .addSeparator()
    .addItem('Stamp today', 'stampToday')
    .addToUi();
}

/** Freeze the header, bold it, and size the columns to fit. */
function tidyThisTab() {
  var sheet = SpreadsheetApp.getActive().getActiveSheet();

  if (sheet.getLastRow() === 0) {
    SpreadsheetApp.getUi().alert('This tab is empty - nothing to tidy.');
    return;
  }

  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, sheet.getLastColumn())
    .setFontWeight('bold')
    .setBackground('#EEEEEE');
  sheet.autoResizeColumns(1, sheet.getLastColumn());

  // A toast is the polite version of an alert: it says "done" without needing a click.
  SpreadsheetApp.getActive().toast('Header frozen, bolded and columns resized.', 'Tidied', 3);
}

/** An alert box, for when you want the user to actually stop and read. */
function howBig() {
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  SpreadsheetApp.getUi().alert(
    'Tab: ' + sheet.getName() + '\n\n' +
    'Rows with data: ' + sheet.getLastRow() + '\n' +
    'Columns with data: ' + sheet.getLastColumn()
  );
}

/** Writes today's date into whichever cell is selected. */
function stampToday() {
  var cell = SpreadsheetApp.getActive().getActiveCell();
  var tz = SpreadsheetApp.getActive().getSpreadsheetTimeZone();
  cell.setValue(Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd'));
}
