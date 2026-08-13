/**
 * Code.gs - the way in.
 *
 * Three entry points:
 *   onOpen()  the menu inside the spreadsheet
 *   doGet()   the deployed web app
 *   showApp() the same app in a window over the Sheet, which works before you deploy anything
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Ramp workbook')
    .addItem('Open the app', 'showApp')
    .addSeparator()
    .addItem('Set up workbook', 'menuSetup')
    .addItem('Re-import content', 'menuReimport')
    .addItem('Repair workbook', 'menuRepair')
    .addSeparator()
    .addItem('Show the web app link', 'menuShowUrl')
    .addToUi();
}

/** The deployed web app. */
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('The ramp')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** Pull one HTML file into another. Used by Index to bring in the CSS and the client script. */
function include(name) {
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}

/** The app in a window over the spreadsheet - handy before the web app is deployed, and the
 *  quickest route in when the Sheet is already open. */
function showApp() {
  var html = HtmlService.createTemplateFromFile('Index').evaluate().setWidth(1400).setHeight(900);
  SpreadsheetApp.getUi().showModelessDialog(html, 'The ramp');
}

function menuSetup() {
  runWithToast(setupWorkbook, 'Setting up');
}

function menuReimport() {
  var ui = SpreadsheetApp.getUi();
  var answer = ui.alert(
    'Re-import content',
    'This refreshes the document text from the imported source and rebuilds the ladder.\n\n' +
      'Your progress, notes, questions and scores are kept. Anything you typed into the Body ' +
      'column of the Library will be replaced.\n\nGo ahead?',
    ui.ButtonSet.YES_NO
  );
  if (answer === ui.Button.YES) runWithToast(reimportContent, 'Re-importing');
}

function menuRepair() {
  runWithToast(repairWorkbook, 'Repairing');
}

function menuShowUrl() {
  var url = '';
  try {
    url = ScriptApp.getService().getUrl() || '';
  } catch (err) {
    url = '';
  }
  var ui = SpreadsheetApp.getUi();
  if (url) {
    ui.alert('Web app link', url + '\n\nBookmark it. Open it from your phone too.', ui.ButtonSet.OK);
  } else {
    ui.alert(
      'Not deployed yet',
      'There is no web app link until you deploy one.\n\n' +
        'Extensions > Apps Script, then Deploy > New deployment > Web app.\n\n' +
        'Until then, use Ramp workbook > Open the app.',
      ui.ButtonSet.OK
    );
  }
}

/** Run a menu action with a progress toast, and surface failures as a dialog rather than a
 *  silent stack trace in the execution log. */
function runWithToast(fn, verb) {
  var book = ss();
  book.toast(verb + '...', 'Ramp workbook', -1);
  try {
    var message = fn();
    book.toast(message || 'Done.', 'Ramp workbook', 8);
  } catch (err) {
    book.toast('Failed.', 'Ramp workbook', 3);
    SpreadsheetApp.getUi().alert('Something went wrong', String(err && err.message ? err.message : err), SpreadsheetApp.getUi().ButtonSet.OK);
    throw err;
  }
}
