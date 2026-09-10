/**
 * STARTER 4 - Yesterday's most expensive search terms.  (READ ONLY)
 *
 * The first script that asks a real question with a query. Prints the ten search terms that
 * cost the most yesterday - which is the raw material of the daily Keep/Kill review.
 *
 * What you'll learn:
 *   - AdsApp.search() and GAQL, the query language behind the reports
 *   - segments.date, and why yesterday has to be computed in the ACCOUNT's timezone
 *   - MICROS - the single most common way to be wrong by a factor of a million
 *
 * Writes nothing. Output goes to the LOGS panel.
 */

var HOW_MANY = 10;

function main() {
  var account = AdsApp.currentAccount();

  // Yesterday, on the account's clock. Getting this from the script's own clock is exactly
  // the T1-8 trap, and on an account in Los Angeles it will bite you regularly.
  var yesterday = Utilities.formatDate(
    new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    account.getTimeZone(),
    'yyyy-MM-dd'
  );

  // GAQL reads like SQL with dots. The FROM decides the grain - here, one row per search term.
  var query =
    'SELECT ' +
    '  search_term_view.search_term, ' +
    '  metrics.impressions, ' +
    '  metrics.clicks, ' +
    '  metrics.cost_micros, ' +
    '  metrics.conversions ' +
    'FROM search_term_view ' +
    'WHERE segments.date = "' + yesterday + '" ' +
    '  AND metrics.impressions > 0 ' +
    'ORDER BY metrics.cost_micros DESC ' +
    'LIMIT ' + HOW_MANY;

  var results = AdsApp.search(query);

  Logger.log('Top ' + HOW_MANY + ' search terms by cost on ' + yesterday +
             ' (' + account.getTimeZone() + ')');
  Logger.log('');

  var found = 0;
  while (results.hasNext()) {
    var row = results.next();
    found++;

    // ⚠️ COST COMES BACK IN MICROS. 1,000,000 micros = 1 unit of currency. Forget this
    // division and you will report a $12 search term as $12,000,000. Only cost fields are
    // in micros - conversions and clicks are plain numbers.
    var cost = Number(row.metrics.costMicros) / 1000000;

    Logger.log(
      found + '. "' + row.searchTermView.searchTerm + '"  ' +
      cost.toFixed(2) + ' ' + account.getCurrencyCode() +
      '  ·  ' + row.metrics.clicks + ' clicks' +
      '  ·  ' + row.metrics.impressions + ' impressions' +
      '  ·  ' + row.metrics.conversions + ' conversions (platform)'
    );
  }

  Logger.log('');
  if (found === 0) {
    Logger.log('Nothing yesterday. Try an older date, or an account that actually spent.');
  }
  Logger.log('⚠️ "conversions (platform)" is Google Ads own model on its own window.');
  Logger.log('   It is NOT the first-touch number the team reports. Never quote it as revenue.');
}
