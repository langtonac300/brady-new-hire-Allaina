/**
 * Account structure snapshot - READ ONLY.
 *
 * Lists every campaign in the account with its type, bidding strategy, daily budget and
 * 30-day spend. This is the map you would otherwise build by hand on an account tour, and
 * having it does not replace doing that once - it replaces doing it every time afterwards.
 *
 * This script only reads. It runs one query and writes the result to a Sheet.
 *
 * Paused and removed campaigns are included on purpose. What has been turned off, and when,
 * is often the most interesting thing about an account you have just been handed.
 *
 * Set SPREADSHEET_URL below before the first run.
 */

var CONFIG = {
  SPREADSHEET_URL: '',
  TAB_NAME: 'Account structure',
  DATE_RANGE: 'LAST_30_DAYS',

  // Set to true to list only campaigns that are currently serving.
  ENABLED_ONLY: false
};

function main() {
  var account = AdsApp.currentAccount();
  var sheet = openTab_(CONFIG.SPREADSHEET_URL, CONFIG.TAB_NAME);

  var query =
    'SELECT ' +
    '  campaign.id, ' +
    '  campaign.name, ' +
    '  campaign.status, ' +
    '  campaign.advertising_channel_type, ' +
    '  campaign.advertising_channel_sub_type, ' +
    '  campaign.bidding_strategy_type, ' +
    '  campaign_budget.amount_micros, ' +
    '  metrics.impressions, ' +
    '  metrics.clicks, ' +
    '  metrics.cost_micros, ' +
    '  metrics.conversions, ' +
    '  metrics.conversions_value ' +
    'FROM campaign ' +
    'WHERE segments.date DURING ' + CONFIG.DATE_RANGE +
    (CONFIG.ENABLED_ONLY ? " AND campaign.status = 'ENABLED'" : '') + ' ' +
    'ORDER BY metrics.cost_micros DESC';

  var rows = [];
  var results = AdsApp.search(query);

  while (results.hasNext()) {
    var row = results.next();
    var cost = micros_(get_(row, ['metrics', 'costMicros']));
    var conversions = num_(get_(row, ['metrics', 'conversions']));
    var value = num_(get_(row, ['metrics', 'conversionsValue']));

    rows.push([
      get_(row, ['campaign', 'name']),
      get_(row, ['campaign', 'status']),
      get_(row, ['campaign', 'advertisingChannelType']),
      get_(row, ['campaign', 'advertisingChannelSubType']),
      get_(row, ['campaign', 'biddingStrategyType']),
      micros_(get_(row, ['campaignBudget', 'amountMicros'])),
      num_(get_(row, ['metrics', 'impressions'])),
      num_(get_(row, ['metrics', 'clicks'])),
      cost,
      conversions,
      round_(value, 2),
      cost > 0 ? round_(value / cost, 2) : '',
      // Blank on purpose - this is where the tour actually happens.
      ''
    ]);
  }

  var headers = [
    'Campaign',
    'Status',
    'Type',
    'Sub-type',
    'Bidding strategy',
    'Daily budget',
    'Impressions',
    'Clicks',
    'Cost',
    'Conversions (platform)',
    'Conv. value (platform)',
    'ROAS (platform)',
    'What is it for?'
  ];

  writeTab_(sheet, account, headers, rows, [
    'Conversions, Conv. value and ROAS here are the PLATFORM numbers, on Google Ads’ own model',
    'and window. They are not reported revenue and they will not match it. A ROAS in this tab is',
    'a platform ROAS - say so whenever you quote it.',
    '',
    'Daily budget is what the campaign is set to spend per day, not a monthly figure.'
  ]);

  Logger.log('Wrote ' + rows.length + ' campaigns to "' + CONFIG.TAB_NAME + '".');
}

/* ------------------------------------------------------------------ helpers */

function openTab_(url, tabName) {
  if (!url) {
    throw new Error('Set SPREADSHEET_URL at the top of this script before running it.');
  }
  var book = SpreadsheetApp.openByUrl(url);
  return book.getSheetByName(tabName) || book.insertSheet(tabName);
}

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
    sheet.getRange(line + 1, 1).setValue('No campaigns matched. Check the date range.');
  }
}

function get_(row, path) {
  var value = row;
  for (var i = 0; i < path.length; i++) {
    if (value === null || value === undefined) return '';
    value = value[path[i]];
  }
  return value === null || value === undefined ? '' : value;
}

function num_(value) {
  var n = Number(value);
  return isNaN(n) ? 0 : n;
}

function micros_(value) {
  return round_(num_(value) / 1000000, 2);
}

function round_(n, places) {
  var factor = Math.pow(10, places);
  return Math.round(n * factor) / factor;
}
