/**
 * STARTER 5 - Make it run itself.
 *
 * The last piece. Everything so far ran because you pressed Run. A TRIGGER makes Google run
 * it for you on a schedule - which is the difference between a script you have and a script
 * that does something for you while you're in a meeting.
 *
 * What you'll learn:
 *   - ScriptApp.newTrigger() - creating a schedule from code
 *   - Listing and deleting triggers, so you don't end up with nine copies
 *   - Why a script that runs on a timer must never assume a Sheet is open
 *
 * HOW TO USE: run installDailyLog once. Then check Triggers (the clock icon in the left rail
 * of the editor) and you'll see it listed. Run removeMyTriggers when you're done playing.
 */

var LOG_TAB = 'Daily log';

/** Creates the schedule. Run this ONCE - running it twice gives you two triggers. */
function installDailyLog() {
  // Clear ours out first. This is the habit that stops the classic "why did this fire
  // fourteen times" problem.
  removeMyTriggers();

  ScriptApp.newTrigger('writeDailyLine')
    .timeBased()
    .everyDays(1)
    .atHour(7)              // roughly 7am in the script's timezone - Google picks the minute
    .create();

  Logger.log('Installed. writeDailyLine will run daily at about 07:00.');
  Logger.log('Check the Triggers panel (clock icon) to see it.');
}

/**
 * The job itself. Appends a dated row to a log tab.
 *
 * ⚠️ Note what this does NOT use: getActiveSheet(). When a trigger fires at 7am nobody has
 * the Sheet open, so there is no "active" anything. A scheduled function has to name the
 * tab it wants. This is the single most common reason a script works when you press Run and
 * fails silently overnight.
 */
function writeDailyLine() {
  var book = SpreadsheetApp.getActive();
  var sheet = book.getSheetByName(LOG_TAB);

  if (!sheet) {
    sheet = book.insertSheet(LOG_TAB);
    sheet.appendRow(['Date', 'Ran at', 'Note']);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
  }

  var tz = book.getSpreadsheetTimeZone();
  sheet.appendRow([
    Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd'),
    Utilities.formatDate(new Date(), tz, 'HH:mm'),
    'Ran automatically'
  ]);
}

/** Lists every trigger on this project, so you can see what you've actually got. */
function listMyTriggers() {
  var triggers = ScriptApp.getProjectTriggers();

  if (triggers.length === 0) {
    Logger.log('No triggers installed.');
    return;
  }

  Logger.log(triggers.length + ' trigger(s):');
  for (var i = 0; i < triggers.length; i++) {
    Logger.log('  ' + triggers[i].getHandlerFunction() +
               '  (' + triggers[i].getEventType() + ')');
  }
}

/** Removes the triggers this file installs. Leaves anything else alone. */
function removeMyTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  var removed = 0;

  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'writeDailyLine') {
      ScriptApp.deleteTrigger(triggers[i]);
      removed++;
    }
  }
  Logger.log('Removed ' + removed + ' trigger(s).');
}
