# Starter scripts

Ten short scripts to paste in, run, and watch do something. Five for **Google Ads scripts**,
five for **Apps Script** (the one attached to a Google Sheet).

They are not tools. They are the smallest thing that demonstrates one feature, so that when
you later read a 200-line script you recognize the parts. Each one is heavily commented and
does exactly one new thing more than the one before it.

> **The real tools live next door** in [`../google-ads-scripts/`](../google-ads-scripts/_shared-notes.md)
> — three read-only exports that feed actual projects. Do these first, then those will read
> like ordinary code instead of magic.

⚠️ **Every Google Ads starter is read-only.** None of them changes a bid, a budget, a status
or a keyword. That is what makes them safe to run on a live account from day one — and it is
the rule for anything you write yourself until Alex says otherwise.

---

## Google Ads scripts

**Where they run:** Google Ads → **Tools → Bulk actions → Scripts → +**. Paste, name it,
**Preview**, then **Run**. Output appears in the log panel underneath the editor.

**Which account?** Whichever one you're in when you run it. There is no account loop in any
of these on purpose — you always know exactly what you're pointed at.

| # | File | The one new thing | Output |
|---|------|-------------------|--------|
| 1 | `01-whats-this-account.js` | `AdsApp.currentAccount()`, `Logger.log`, and the timezone trap made visible | Log |
| 2 | `02-list-your-campaigns.js` | Selectors and iterators — asking a question, then walking the answer | Log |
| 3 | `03-write-it-to-a-sheet.js` | Writing to a Sheet, in one call instead of many | A Sheet tab |
| 4 | `04-yesterdays-search-terms.js` | GAQL queries, date ranges, and **micros** | Log |
| 5 | `05-whos-missing-a-tag.js` | Turning a list into a number somebody cares about | Log |

**Do them in order.** Each assumes the one before it.

> ⚠️ **Starter 3 needs one edit before it runs:** paste your spreadsheet URL into
> `SPREADSHEET_URL` at the top. It stops with a clear message if you forget.

### The two things these will teach you the hard way

**Micros.** Cost comes back multiplied by a million. `1,000,000` micros is one dollar. Forget
the division and a $12 search term reports as $12,000,000 — which sounds obvious until it's
buried in a column of forty numbers. Only *cost* fields are in micros; clicks and conversions
are plain.

**Whose clock.** "Yesterday" is not one yesterday. PDC runs on Los Angeles time and the rest
of Brady doesn't, so a script that asks its own clock what day it is will be a full day out
on some accounts. Starter 1 prints both so you can see it happen.

---

## Apps Script

**Where they run:** open a Google Sheet → **Extensions → Apps Script**. Paste each one into
its own file, save, then pick the function from the dropdown and press **Run**. The first run
asks you to authorize; the "unverified app" screen is expected — **Advanced → Go to (project)**.

| # | File | The one new thing | How you see it work |
|---|------|-------------------|---------------------|
| 1 | `01-read-and-write.gs` | Reading and writing cells; the execution log | Run `sayHello` |
| 2 | `02-a-formula-you-wrote.gs` | **Custom functions** — `=CPA(100, 4)` typed into a cell | Type it in a cell |
| 3 | `03-your-own-menu.gs` | `onOpen()` and a real menu in the Sheet | Reload the Sheet |
| 4 | `04-tidy-an-export.gs` | Whole-block reads/writes; cleaning `"$1,234.56"` into a number | Run it on an export |
| 5 | `05-make-it-run-itself.gs` | **Triggers** — Google runs it on a schedule | Run `installDailyLog` |

> **Start with 2 if you want the fastest payoff.** A working `=CPA()` in a cell you typed
> yourself is the moment this stops feeling abstract. Nothing to Run — save, and it's there.

### Three gotchas built into these on purpose

**Cell-by-cell is slow.** Starter 1 has a `theSlowWay()` function that writes 200 cells one
at a time so you can time it. Starter 4 does the same size job in one call. Run both. Every
`setValue()` is a separate trip to Google's servers, and this is the single biggest
difference between a script that feels instant and one that times out.

**A scheduled script has no "active" sheet.** Starter 5 names its tab instead of calling
`getActiveSheet()`, because at 7am nobody has the Sheet open. This is the most common reason
a script works when you press Run and then fails silently every night.

**Triggers stack up.** Run an install function twice and you get two triggers, firing twice.
Starter 5 clears its own before adding one, and has a `listMyTriggers()` so you can see what
you've actually got.

---

## What to do with them afterwards

Break them. Change a date range, a condition, a threshold, and see what happens — that's what
they're for, and none of them can damage anything.

When one of them turns into something you'd actually use, that's worth a conversation with
Alex before it goes anywhere near a schedule on a live account.

⚠️ **Nothing you paste into Google Ads or Apps Script should reference this repo or any AI
tool.** These files carry no such references and they shouldn't start to — that's a Brady
house rule about anything living in a corporate Google account, and Gemini is the sanctioned
tool if you need one.
