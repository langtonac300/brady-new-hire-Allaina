/**
 * STARTER 3 - Put it in a Sheet.  (READ ONLY in Google Ads; writes to YOUR Sheet)
 *
 * Same campaign data as Starter 2, but into a spreadsheet instead of the log. This is the
 * one that turns a script from a toy into something you'd actually use, because a Sheet is
 * where the rest of your work already happens.
 *
 * What you'll learn:
 *   - Talking to SpreadsheetApp from inside a Google Ads script
 *   - Writing a whole block at once with setValues() instead of cell by cell
 *   - Stamping provenance on an export so nobody has to ask where it came from
 *
 * SET THIS FIRST: paste your spreadsheet URL into SPREADSHEET_URL below. The script stops
 * with a clear message if you forget.
 */

var SPREADSHEET_URL = '';   // <-- paste your Sheet URL between the quotes
var TAB_NAME = 'Campaigns';

function main() {
  if (!SPREADSHEET_URL) {
    throw new Error('Set SPREADSHEET_URL at the top of this script before running it.');
  }

  var account = AdsApp.currentAccount();
  var book = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  var sheet = book.getSheetByName(TAB_NAME) || book.insertSheet(TAB_NAME);
  sheet.clear();

  // --- The stamp -------------------------------------------------------------------------
  // Do this on every export you ever build. A number with no provenance is the thing that
  // gets quoted in a meeting and turns out to have meant something else.
  var stamp = [
    ['Account', account.getName()],
    ['Currency', account.getCurrencyCode()],
    ['Timezone', account.getTimeZone()],
    ['Date range', 'LAST_30_DAYS'],
    ['Pulled', Utilities.formatDate(new Date(), account.getTimeZone(), 'yyyy-MM-dd HH:mm')]
  ];
  sheet.getRange(1, 1, stamp.length, 2).setValues(stamp);
  sheet.getRange(1, 1, stamp.length, 1).setFontWeight('bold');

  // --- Collect the rows in memory first --------------------------------------------------
  // Build an array, THEN write it in one call. Writing cell by cell inside the loop is the
  // classic beginner script that takes four minutes to do a four-second job: every single
  // setValue() is a separate round trip to Google's servers.
  var headers = ['Campaign', 'Status', 'Daily budget', 'Cost (30d)', 'Clicks', 'Impressions'];
  var rows = [];

  var campaigns = AdsApp.campaigns()
    .forDateRange('LAST_30_DAYS')
    .orderBy('metrics.cost_micros DESC')
    .get();

  while (campaigns.hasNext()) {
    var campaign = campaigns.next();
    var stats = campaign.getStatsFor('LAST_30_DAYS');
    rows.push([
      campaign.getName(),
      campaign.isEnabled() ? 'Enabled' : 'Paused',
      campaign.getBudget().getAmount(),
      stats.getCost(),
      stats.getClicks(),
      stats.getImpressions()
    ]);
  }

  // --- Write it ---------------------------------------------------------------------------
  var headerRow = stamp.length + 2;
  sheet.getRange(headerRow, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');

  if (rows.length > 0) {
    sheet.getRange(headerRow + 1, 1, rows.length, headers.length).setValues(rows);   // one call
    sheet.setFrozenRows(headerRow);
    sheet.autoResizeColumns(1, headers.length);
  } else {
    sheet.getRange(headerRow + 1, 1).setValue('No campaigns found in this account.');
  }

  Logger.log('Wrote ' + rows.length + ' rows to the "' + TAB_NAME + '" tab.');
}
