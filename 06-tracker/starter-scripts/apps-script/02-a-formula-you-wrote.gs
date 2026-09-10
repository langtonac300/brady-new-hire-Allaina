/**
 * STARTER 2 - Formulas you wrote yourself.
 *
 * A custom function is a function you can type into a CELL, like =SUM. This is the fastest
 * "oh, that's what this is for" moment in Apps Script.
 *
 * What you'll learn:
 *   - Custom functions - any function that returns a value can be called from a cell
 *   - Guarding against divide-by-zero, which is most of what breaks real spreadsheets
 *   - @customfunction, which makes autocomplete offer your function as you type
 *
 * AFTER YOU PASTE THIS: save, go back to the Sheet, and type =CPA(100, 4) into a cell.
 * You do not need to press Run. Custom functions just become available.
 */

/**
 * Cost per acquisition: what one conversion cost.
 *
 * @param {number} cost Total spend.
 * @param {number} conversions Number of conversions.
 * @return {number} Cost per conversion, or blank if there were none.
 * @customfunction
 */
function CPA(cost, conversions) {
  if (!conversions) return '';        // no conversions - blank beats #DIV/0! and beats zero
  return cost / conversions;
}

/**
 * Return on ad spend: revenue back per unit spent.
 *
 * @param {number} revenue Revenue attributed to the ads.
 * @param {number} cost Total spend.
 * @return {number} Revenue divided by cost.
 * @customfunction
 */
function ROAS(revenue, cost) {
  if (!cost) return '';
  return revenue / cost;
}

/**
 * Conversion rate as a decimal. Format the cell as a percentage to read it.
 *
 * @param {number} conversions Number of conversions.
 * @param {number} clicks Number of clicks.
 * @return {number} Conversions divided by clicks.
 * @customfunction
 */
function CVR(conversions, clicks) {
  if (!clicks) return '';
  return conversions / clicks;
}

/**
 * How many business days (Mon-Fri) have passed this month, up to and including today.
 *
 * This is the one that actually saves you time. Brady normalizes a lot of reporting per
 * business day, and doing it by hand every morning is how arithmetic slips in.
 *
 * ⚠️ It counts Monday to Friday and knows nothing about holidays. A month with a holiday in
 * it has fewer real business days than this returns - check by hand before you quote it.
 *
 * @return {number} Business days elapsed this month.
 * @customfunction
 */
function BIZDAYS_SO_FAR() {
  var today = new Date();
  var count = 0;

  for (var day = 1; day <= today.getDate(); day++) {
    var d = new Date(today.getFullYear(), today.getMonth(), day);
    var weekday = d.getDay();                  // 0 = Sunday, 6 = Saturday
    if (weekday !== 0 && weekday !== 6) count++;
  }
  return count;
}
