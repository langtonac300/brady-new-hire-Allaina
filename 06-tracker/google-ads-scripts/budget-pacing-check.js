/**
 * Budget pacing check - READ ONLY.
 *
 * Month-to-date spend against what the campaigns are budgeted to spend, normalized per
 * business day. It answers "are we ahead or behind, and by how much" without you having to
 * do the arithmetic in your head at 9am.
 *
 * This script only reads. It runs two queries and writes the result to a Sheet.
 *
 * Two things it deliberately does not do:
 *
 *   1. It does not know a monthly target. It reads the DAILY budget set on each campaign and
 *      multiplies. If your team plans to a monthly number that is not the sum of the daily
 *      budgets, this will not match it - put the real number in the Notes column yourself.
 *   2. It does not know about holidays. It counts Monday to Friday. A month with a holiday
 *      in it has fewer real business days than this says, and that has to be checked by hand.
 *
 * Set SPREADSHEET_URL below before the first run.
 */

var CONFIG = {
  SPREADSHEET_URL: '',
  TAB_NAME: 'Pacing',

  // Set to true to count every day rather than Monday to Friday. Use it if the account
  // genuinely spends at the weekend at the same rate.
  COUNT_WEEKENDS: false
};

function main() {
  var account = AdsApp.currentAccount();
  var timeZone = account.getTimeZone();
  var sheet = openTab_(CONFIG.SPREADSHEET_URL, CONFIG.TAB_NAME);

  // "Today" has to be today in the ACCOUNT's timezone, not the script runner's. Getting this
  // wrong is a whole day's error at either end of the month.
  var todayStr = Utilities.formatDate(new Date(), timeZone, 'yyyy-MM-dd');
  var parts = todayStr.split('-');
  var year = Number(parts[0]);
  var month = Number(parts[1]);
  var day = Number(parts[2]);

  var daysInMonth = new Date(year, month, 0).getDate();
  var elapsed = countDays_(year, month, 1, day);
  var total = countDays_(year, month, 1, daysInMonth);
  var remaining = total - elapsed;

  var spendByCampaign = queryMap_(
    'SELECT campaign.id, campaign.name, metrics.cost_micros ' +
      'FROM campaign WHERE segments.date DURING THIS_MONTH',
    ['metrics', 'costMicros']
  );

  var budgetByCampaign = queryMap_(
    'SELECT campaign.id, campaign.name, campaign_budget.amount_micros ' +
      "FROM campaign WHERE campaign.status = 'ENABLED'",
    ['campaignBudget', 'amountMicros']
  );

  var rows = [];
  var totals = { spend: 0, expected: 0, budget: 0 };

  for (var id in budgetByCampaign) {
    if (!Object.prototype.hasOwnProperty.call(budgetByCampaign, id)) continue;

    var entry = budgetByCampaign[id];
    var dailyBudget = micros_(entry.value);
    var spent = spendByCampaign[id] ? micros_(spendByCampaign[id].value) : 0;

    var expected = round_(dailyBudget * elapsed, 2);
    var monthBudget = round_(dailyBudget * total, 2);
    var variance = round_(spent - expected, 2);

    totals.spend += spent;
    totals.expected += expected;
    totals.budget += monthBudget;

    rows.push([
      entry.name,
      dailyBudget,
      monthBudget,
      spent,
      expected,
      variance,
      expected > 0 ? round_((spent / expected) * 100, 1) : '',
      remaining > 0 ? round_((monthBudget - spent) / remaining, 2) : '',
      pace_(spent, expected),
      ''
    ]);
  }

  rows.sort(function (a, b) {
    return Math.abs(b[5]) - Math.abs(a[5]);
  });

  rows.push([
    'ALL CAMPAIGNS',
    '',
    round_(totals.budget, 2),
    round_(totals.spend, 2),
    round_(totals.expected, 2),
    round_(totals.spend - totals.expected, 2),
    totals.expected > 0 ? round_((totals.spend / totals.expected) * 100, 1) : '',
    remaining > 0 ? round_((totals.budget - totals.spend) / remaining, 2) : '',
    pace_(totals.spend, totals.expected),
    ''
  ]);

  var headers = [
    'Campaign',
    'Daily budget',
    'Month budget',
    'Spent MTD',
    'Expected by now',
    'Variance',
    '% of expected',
    'Daily run-rate needed',
    'Pacing',
    'Why / what I would do'
  ];

  writeTab_(sheet, account, headers, rows, [
    'Business days counted: ' + elapsed + ' elapsed of ' + total + ', ' + remaining + ' remaining.',
    (CONFIG.COUNT_WEEKENDS ? 'Counting every day.' : 'Counting Monday to Friday only.') +
      ' HOLIDAYS ARE NOT ACCOUNTED FOR - check them by hand.',
    '',
    'Month budget is the sum of the DAILY budgets set on the campaigns, multiplied out. If the',
    'team plans to a different monthly number, this will not match it and this one is not the',
    'authority. Reconcile against the spend dashboard before repeating any figure from here.'
  ]);

  Logger.log(
    'Pacing: ' + round_(totals.spend, 2) + ' spent vs ' + round_(totals.expected, 2) +
      ' expected across ' + elapsed + ' business days.'
  );
}

/* ------------------------------------------------------------------ helpers */

/** Business days between two days of the same month, inclusive. */
function countDays_(year, month, fromDay, toDay) {
  var count = 0;
  for (var d = fromDay; d <= toDay; d++) {
    var weekday = new Date(year, month - 1, d).getDay();
    if (CONFIG.COUNT_WEEKENDS || (weekday !== 0 && weekday !== 6)) count++;
  }
  return count;
}

/** Run a query and key the result by campaign id. */
function queryMap_(query, valuePath) {
  var out = {};
  var results = AdsApp.search(query);
  while (results.hasNext()) {
    var row = results.next();
    var id = String(get_(row, ['campaign', 'id']));
    out[id] = { name: get_(row, ['campaign', 'name']), value: get_(row, valuePath) };
  }
  return out;
}

/** A word rather than only a number - the number alone reads as fine at a glance. */
function pace_(spent, expected) {
  if (expected <= 0) return 'No budget set';
  var ratio = spent / expected;
  if (ratio > 1.15) return 'Over';
  if (ratio < 0.85) return 'Under';
  return 'On track';
}

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
    ['Period', 'This month to date'],
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
    sheet.getRange(line + rows.length, 1, 1, headers.length).setFontWeight('bold');
  } else {
    sheet.getRange(line + 1, 1).setValue('No enabled campaigns with a budget were found.');
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
