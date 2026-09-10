/**
 * STARTER 5 - Which campaigns aren't tagged?  (READ ONLY)
 *
 * The first script that answers a question somebody actually cares about.
 *
 * Brady campaign names carry a [B] or [NB] tag - brand or non-brand. That tag is how spend
 * gets classified in reporting. A campaign missing it doesn't fail loudly; it just quietly
 * files as "Unclassified" and stops being counted in the brand/non-brand split.
 *
 * This script finds them, and adds up what they spent - so the answer is "$X of spend is
 * invisible to the split", not just "some campaigns look odd".
 *
 * What you'll learn:
 *   - Plain string checks (indexOf) as a real analysis tool
 *   - Building a total while you loop
 *   - Turning "here's a list" into "here's what it's worth", which is the actual job
 *
 * Writes nothing. Output goes to the LOGS panel.
 *
 * ⚠️ Naming is not enforced across Brady's accounts, so on some accounts almost everything
 * will come back untagged. That is a real finding, not a broken script - see
 * campaign-architecture.md.
 */

function main() {
  var account = AdsApp.currentAccount();

  var campaigns = AdsApp.campaigns()
    .withCondition('campaign.status = ENABLED')
    .forDateRange('LAST_30_DAYS')
    .get();

  var untagged = [];
  var taggedCost = 0;
  var untaggedCost = 0;

  while (campaigns.hasNext()) {
    var campaign = campaigns.next();
    var name = campaign.getName().toUpperCase();
    var cost = campaign.getStatsFor('LAST_30_DAYS').getCost();

    // Does the name contain a tag anywhere in it?
    var hasTag = name.indexOf('[B]') !== -1 || name.indexOf('[NB]') !== -1;

    if (hasTag) {
      taggedCost += cost;
    } else {
      untaggedCost += cost;
      untagged.push({ name: campaign.getName(), cost: cost });
    }
  }

  // Most expensive first - if you only fix three, fix these three.
  untagged.sort(function (a, b) { return b.cost - a.cost; });

  var currency = ' ' + account.getCurrencyCode();
  var total = taggedCost + untaggedCost;

  Logger.log('Tag check on ' + account.getName() + ' - enabled campaigns, last 30 days');
  Logger.log('');
  Logger.log('Tagged [B]/[NB] : ' + taggedCost.toFixed(2) + currency);
  Logger.log('Untagged        : ' + untaggedCost.toFixed(2) + currency +
             '   <-- files as Unclassified');
  Logger.log('Share untagged  : ' + (total > 0 ? (untaggedCost / total * 100).toFixed(1) : '0') + '%');
  Logger.log('');

  if (untagged.length === 0) {
    Logger.log('Every enabled campaign carries a tag. Rare. Enjoy it.');
    return;
  }

  Logger.log(untagged.length + ' untagged campaigns, most expensive first:');
  for (var i = 0; i < untagged.length; i++) {
    Logger.log('  ' + untagged[i].cost.toFixed(2) + currency + '  ' + untagged[i].name);
  }

  Logger.log('');
  Logger.log('This is the raw material for T1-7. Do NOT rename anything to fix it -');
  Logger.log('renaming a live campaign breaks its reporting history. Report it instead.');
}
