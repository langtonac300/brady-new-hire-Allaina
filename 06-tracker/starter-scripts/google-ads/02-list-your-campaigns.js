/**
 * STARTER 2 - List your campaigns.  (READ ONLY)
 *
 * The first script that loops over things. Prints every enabled campaign with its budget and
 * what it actually spent over the last 30 days.
 *
 * What you'll learn:
 *   - Selectors      - AdsApp.campaigns() is a QUESTION, not a list
 *   - .withCondition() / .forDateRange() / .orderBy() - narrowing that question
 *   - Iterators      - while (it.hasNext()) is how you walk the answer
 *
 * Still writes nothing. Output goes to the LOGS panel.
 */

function main() {
  var account = AdsApp.currentAccount();

  // Nothing has been fetched yet. This is a question you are still building.
  var selector = AdsApp.campaigns()
    .withCondition('campaign.status = ENABLED')
    .forDateRange('LAST_30_DAYS')
    .orderBy('metrics.cost_micros DESC')
    .withLimit(25);

  // .get() is the moment the question is actually asked.
  var campaigns = selector.get();

  Logger.log('Enabled campaigns in ' + account.getName() + ', last 30 days, top 25 by cost:');
  Logger.log('');

  var count = 0;
  var totalCost = 0;

  while (campaigns.hasNext()) {
    var campaign = campaigns.next();
    var stats = campaign.getStatsFor('LAST_30_DAYS');
    var cost = stats.getCost();

    count++;
    totalCost += cost;

    Logger.log(
      pad_(count + '.', 4) +
      pad_(campaign.getName(), 45) +
      ' budget/day ' + pad_(campaign.getBudget().getAmount().toFixed(2), 10) +
      ' spent(30d) ' + cost.toFixed(2)
    );
  }

  Logger.log('');
  Logger.log(count + ' campaigns, ' + totalCost.toFixed(2) + ' ' + account.getCurrencyCode() + ' total.');

  if (count === 0) {
    Logger.log('Nothing came back. Either the account has no enabled campaigns, or the');
    Logger.log('condition above is narrower than you meant. Try removing .withCondition().');
  }
}

/** Pads a string so the log lines up in columns. Cosmetic only. */
function pad_(text, width) {
  text = String(text);
  while (text.length < width) text += ' ';
  return text;
}
