/**
 * Search terms export - READ ONLY.
 *
 * Pulls the search terms an account actually matched, with impressions, clicks, cost and
 * conversions, and writes them to a tab in your workbook.
 *
 * This script only reads. It runs one query and writes the result to a Sheet. It does not
 * add negatives, change bids, or touch the account in any way - which is why it is safe to
 * run during the read-only phase.
 *
 * Set SPREADSHEET_URL below before the first run.
 */

var CONFIG = {
  // The URL of your workbook. Open it, copy the address bar, paste it here.
  SPREADSHEET_URL: '',

  // The tab to write to. It gets created if it does not exist, and overwritten each run.
  TAB_NAME: 'Search terms',

  // LAST_7_DAYS, LAST_14_DAYS, LAST_30_DAYS, THIS_MONTH, LAST_MONTH.
  DATE_RANGE: 'LAST_30_DAYS',

  // Terms below this many impressions are noise for a keep/kill pass. Set to 0 for all.
  MIN_IMPRESSIONS: 10
};

function main() {
  var account = AdsApp.currentAccount();
  var sheet = openTab_(CONFIG.SPREADSHEET_URL, CONFIG.TAB_NAME);

  var query =
    'SELECT ' +
    '  search_term_view.search_term, ' +
    '  campaign.name, ' +
    '  ad_group.name, ' +
    '  metrics.impressions, ' +
    '  metrics.clicks, ' +
    '  metrics.cost_micros, ' +
    '  metrics.conversions, ' +
    '  metrics.conversions_value ' +
    'FROM search_term_view ' +
    'WHERE segments.date DURING ' + CONFIG.DATE_RANGE + ' ' +
    '  AND metrics.impressions >= ' + CONFIG.MIN_IMPRESSIONS + ' ' +
    'ORDER BY metrics.cost_micros DESC';

  var rows = [];
  var results = AdsApp.search(query);

  while (results.hasNext()) {
    var row = results.next();
    var cost = micros_(get_(row, ['metrics', 'costMicros']));
    var clicks = num_(get_(row, ['metrics', 'clicks']));
    var conversions = num_(get_(row, ['metrics', 'conversions']));

    rows.push([
      get_(row, ['searchTermView', 'searchTerm']),
      get_(row, ['campaign', 'name']),
      get_(row, ['adGroup', 'name']),
      num_(get_(row, ['metrics', 'impressions'])),
      clicks,
      cost,
      conversions,
      // conversions_value is a plain number, not micros. Only cost fields are in micros.
      round_(num_(get_(row, ['metrics', 'conversionsValue'])), 2),
      clicks > 0 ? round_(cost / clicks, 2) : '',
      conversions > 0 ? round_(cost / conversions, 2) : '',
      // Left blank on purpose. This is the column you fill in - it is the review, and the
      // judgment in it is the part that is worth anything.
      ''
    ]);
  }

  var headers = [
    'Search term',
    'Campaign',
    'Ad group',
    'Impressions',
    'Clicks',
    'Cost',
    'Conversions (platform)',
    'Conv. value (platform)',
    'CPC',
    'Cost / conv.',
    'Keep or kill'
  ];

  writeTab_(sheet, account, headers, rows, [
    'Conversions and Conv. value are the PLATFORM numbers - Google Ads’ own model, on its own',
    'window. They are not reported revenue, which is first-touch, 180-day, and lives elsewhere.',
    'Do not quote one as the other.'
  ]);

  Logger.log('Wrote ' + rows.length + ' search terms to "' + CONFIG.TAB_NAME + '".');
}

/* ------------------------------------------------------------------ helpers */

/**
 * Open the target tab, creating it if it is not there yet.
 *
 * Fails loudly on a missing URL rather than writing somewhere unexpected.
 */
function openTab_(url, tabName) {
  if (!url) {
    throw new Error('Set SPREADSHEET_URL at the top of this script before running it.');
  }
  var book = SpreadsheetApp.openByUrl(url);
  return book.getSheetByName(tabName) || book.insertSheet(tabName);
}

/**
 * Write the export, with its provenance across the top.
 *
 * The stamp is the point of this function as much as the data is: account, timezone,
 * currency, date range and run time, so a number lifted out of this tab can always be traced
 * back to what produced it.
 */
function writeTab_(sheet, account, headers, rows, caveats) {
  sheet.clear();

  var stamp = [
    ['Account', account.getName()],
    ['Account timezone', account.getTimeZone()],
    ['Currency', account.getCurrencyCode()],
    ['Date range', CONFIG.DATE_RANGE],
    ['Pulled', Utilities.formatDate(new Date(), account.getTimeZone(), 'yyyy-MM-dd HH:mm') + ' (account time)']
  ];

  sheet.getRange(1, 1, stamp.length, 2).setValues(stamp);
  sheet.getRange(1, 1, stamp.length, 1).setFontWeight('bold');

  var line = stamp.length + 2;
  if (caveats && caveats.length) {
    for (var i = 0; i < caveats.length; i++) {
      sheet.getRange(line + i, 1).setValue(caveats[i]);
    }
    sheet.getRange(line, 1, caveats.length, 1).setFontColor('#8C1D18');
    line += caveats.length + 1;
  }

  sheet.getRange(line, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  sheet.setFrozenRows(line);

  if (rows.length) {
    sheet.getRange(line + 1, 1, rows.length, headers.length).setValues(rows);
  } else {
    sheet.getRange(line + 1, 1).setValue('No rows matched. Widen the date range or lower MIN_IMPRESSIONS.');
  }
}

/** Read a nested field without throwing when a level is missing. */
function get_(row, path) {
  var value = row;
  for (var i = 0; i < path.length; i++) {
    if (value === null || value === undefined) return '';
    value = value[path[i]];
  }
  return value === null || value === undefined ? '' : value;
}

/** Metrics arrive as strings often enough that this is worth doing everywhere. */
function num_(value) {
  var n = Number(value);
  return isNaN(n) ? 0 : n;
}

/** Money comes back in micros - millionths of the account currency. */
function micros_(value) {
  return round_(num_(value) / 1000000, 2);
}

function round_(n, places) {
  var factor = Math.pow(10, places);
  return Math.round(n * factor) / factor;
}
