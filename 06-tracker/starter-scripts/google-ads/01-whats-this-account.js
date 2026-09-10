/**
 * STARTER 1 - What account am I even in?  (READ ONLY)
 *
 * The smallest useful script. It writes nothing anywhere - it just prints facts about the
 * account you ran it in, into the execution log at the bottom of the screen.
 *
 * What you'll learn:
 *   - AdsApp.currentAccount() - a script always runs "inside" one account
 *   - Logger.log()            - your print statement, and where the output appears
 *   - Why timezone is the first thing you check, not the last
 *
 * Run it, then look at the LOGS panel. Nothing else happens.
 */

function main() {
  var account = AdsApp.currentAccount();

  Logger.log('Account name : ' + account.getName());
  Logger.log('Account ID   : ' + account.getCustomerId());
  Logger.log('Currency     : ' + account.getCurrencyCode());
  Logger.log('Timezone     : ' + account.getTimeZone());

  // --- The timezone lesson, made visible -------------------------------------------------
  // A date only means something once you say whose clock it's on. These two lines can print
  // DIFFERENT DAYS, and that difference is a whole day of spend in a report.
  var now = new Date();
  var dayHere = Utilities.formatDate(now, account.getTimeZone(), 'yyyy-MM-dd HH:mm');
  var dayScript = Utilities.formatDate(now, 'America/Chicago', 'yyyy-MM-dd HH:mm');

  Logger.log('');
  Logger.log('Right now, in the ACCOUNT timezone : ' + dayHere);
  Logger.log('Right now, in Chicago              : ' + dayScript);
  Logger.log('If those are different days, that is the trap from T1-8.');

  // --- Yesterday's headline numbers ------------------------------------------------------
  // getStatsFor() is the quickest way to ask an account how it did. No query needed.
  var stats = account.getStatsFor('YESTERDAY');

  Logger.log('');
  Logger.log('--- Yesterday (account timezone) ---');
  Logger.log('Impressions : ' + stats.getImpressions());
  Logger.log('Clicks      : ' + stats.getClicks());
  Logger.log('Cost        : ' + stats.getCost() + ' ' + account.getCurrencyCode());

  // Deliberately NOT printing conversions here. That column is the platform's own model on
  // its own window, and it is not the number the team reports. Starter 4 shows it WITH the
  // caveat attached, which is the only way it should ever appear.
}
