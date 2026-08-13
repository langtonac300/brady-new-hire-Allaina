# Google Ads scripts

Three scripts that pull numbers out of an account and write them into your workbook. **All
three are read-only.** They run queries and write to a Sheet; none of them changes anything
in an account. That is deliberate — it means you can use them from day one rather than after
day 30.

| Script | What it does | Feeds |
|--------|--------------|-------|
| `search-terms-export.js` | Search terms with impressions, clicks, cost and conversions | The daily Keep/Kill review, T2-1, T2-2, T3-2 |
| `account-structure-snapshot.js` | Every campaign with its type, bidding strategy, budget and 30-day spend | T1-1, T1-2, T1-9 |
| `budget-pacing-check.js` | Month-to-date spend against budget, per business day | T2-4, T3-3 |

---

## Running one

1. In Google Ads: **Tools → Bulk actions → Scripts → +**.
2. Paste the file in, and name it the same as the file.
3. At the top of the file, set `SPREADSHEET_URL` to your workbook's URL.
4. **Preview** first. Preview runs the script and shows you what it would do without
   writing — and since these only read and write a Sheet, preview is genuinely safe.
5. **Authorize** when asked, then **Run**.
6. Once you trust it, schedule it: **Daily** for the search terms and pacing, **Weekly** for
   the structure snapshot.

⚠️ **Run it on one account first.** Every one of these is scoped to whichever account you run
it from. There is no loop across accounts, on purpose.

---

## Three things every one of them does deliberately

**1. It stamps where the numbers came from.** Every export writes the account name, its
timezone, the currency, the date range and the time it ran across the top. That is not
decoration — "where is this from and what's the caveat?" is the habit these are here to
build, and a number in a tab with no provenance is exactly the kind of thing that gets
quoted in a meeting and turns out to mean something else.

**2. It labels the conversions column honestly.** The header says
*"Conversions (platform)"* and there is a caveat line under it. Google Ads' Conversions
column is its own model on its own window — it is **not** reported revenue, which is
first-touch and 180-day and lives somewhere else entirely. Quoting one as the other is the
most common beginner mistake there is, and these scripts are built so you cannot make it by
accident.

**3. It writes the account timezone next to the dates.** Your accounts run on different
clocks, so "yesterday" is not one yesterday across them. The stamp is there so that when two
exports disagree you check the clock before you check anything else.

---

## What they will not do

- **They do not change anything.** No bids, no budgets, no pausing, no negatives. If you
  want a script that does, that is a conversation with Alex first, and it belongs in a much
  later phase than this.
- **They do not know your budgets or targets.** The pacing script reads the daily budgets
  set on the campaigns themselves. Anything else — a monthly target, a plan number — is not
  in the account and the script will not invent one.
- **They do not handle holidays.** The pacing script counts Monday to Friday as business
  days. Holidays have to be checked by hand, which is called out in its own output.
