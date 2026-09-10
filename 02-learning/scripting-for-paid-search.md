# Scripting for paid search — what it's for, and when to reach for it

You don't need to be a developer to do this job. You do need to stop doing the same
forty-minute export by hand every Monday, and scripting is how that stops.

This file is the *why and when*. The hands-on part is
[`06-tracker/starter-scripts/`](../06-tracker/starter-scripts/README.md) — ten short scripts
you paste in and run. Read this first, then go and break those.

> **You are not learning to program.** You are learning to read a script well enough to know
> what it touches, and to change a date or a threshold without fear. That is a genuinely
> different and much smaller skill.

---

## ⚠️ The one rule that matters

**Everything you write reads. Nothing you write changes anything** — not a bid, not a budget,
not a status, not a keyword — until Alex has looked at it and said yes.

This isn't about trust. A read-only script that's wrong wastes your afternoon. A writing
script that's wrong changes a live account that spends real money, at 3am, while nobody is
watching, and keeps doing it until somebody notices. The blast radius is completely
different, so the two get completely different rules.

Every script in this repo is read-only, and that's why they're safe to run from day one.

---

## The two kinds, and how to tell them apart

They're both JavaScript. They run in different places and can reach different things, and
picking the wrong one is the most common way to waste an hour.

| | **Google Ads scripts** | **Apps Script** |
|---|---|---|
| **Lives in** | Google Ads → Tools → Bulk actions → Scripts | A Google Sheet → Extensions → Apps Script |
| **Can see** | One ad account's data | Sheets, Docs, Gmail, Drive, Calendar |
| **Can't see** | Anything outside that account | Google Ads data (without extra setup) |
| **Runs when** | You press Run, or on a schedule you set | You press Run, a menu click, or a trigger |
| **Reach for it when** | The data lives *in the account* | The work happens *in a spreadsheet* |

**The rule of thumb:** if the sentence starts "go into Google Ads and pull…", it's a Google
Ads script. If it starts "open the sheet and…", it's Apps Script.

**And they meet in the middle.** A Google Ads script can write into a Sheet, which an Apps
Script can then tidy, calculate on and chart. That handoff is most of what the team's
existing tooling actually is.

---

## What's worth scripting (and what isn't)

Scripts are for work that is **repetitive, rule-based, and boring**. They are bad at anything
needing judgment.

| Worth scripting | Not worth scripting |
|---|---|
| The same export, every week, same columns | A one-off pull you'll never repeat |
| Checking 400 campaigns for one condition | Deciding whether a search term is waste |
| Reformatting an export into a usable table | Writing the recommendation on top of it |
| Watching for a thing that shouldn't happen, on a schedule | Anything where you'd want to see the context first |

> **Keep/Kill is the clean example.** *Pulling* yesterday's search terms sorted by cost is
> script work — same query, every day, no judgment. *Deciding* which ones to kill is your
> job, and no script should try it. The script hands you a better starting list; the
> intent call stays yours. See [`who-else-is-searching.md`](./who-else-is-searching.md).

⚠️ **The trap: scripting something you don't yet understand.** Automating a report before you
can produce it by hand means you can't tell when it goes wrong — and it will, quietly, the
first time a column moves. Do it manually until it's boring. *Then* script it.

---

## The five ideas that unlock the rest

Everything in the starter folder is one of these. If you've got these five, you can read
almost any script the team has.

**1 · A script runs *somewhere*.** It always has a context — one ad account, one spreadsheet.
`AdsApp.currentAccount()` and `SpreadsheetApp.getActive()` are how a script asks "where am
I?" Most confusing failures are a script pointed at something you didn't mean.

**2 · You ask a question, then walk the answer.** `AdsApp.campaigns().withCondition(...)`
doesn't fetch anything — it *builds a question*. `.get()` asks it. Then you loop through the
result one row at a time. Building the question and asking it being separate steps is what
lets you narrow it first.

**3 · Do it in bulk, not one at a time.** Reading and writing a whole block in one call is
enormously faster than a loop of single-cell calls, because every call is a round trip over
the network. This is the difference between a script that finishes instantly and one that
times out, and it's the most common thing wrong with a beginner's first real script.

**4 · Log everything while you're learning.** `Logger.log()` is your print statement. A
script you can't see inside is a script you can't debug. Log more than feels necessary.

**5 · Triggers are the actual point.** A trigger runs your script on a schedule without you.
Everything before this is a convenience; this is the part that gives you back a morning.
⚠️ And it's where the discipline matters most, because from here on it runs when you're not
looking.

---

## Two gotchas you'll hit in the first hour

**Cost comes back in micros.** Google Ads returns cost multiplied by a million —
`12,000,000` means twelve dollars. Divide by 1,000,000 or you'll report a number a million
times too big. Only cost fields do this; clicks and conversions are plain numbers.

**"Yesterday" depends on whose clock.** PDC runs on Los Angeles time and the rest of Brady
doesn't. A script that asks *its own* clock what day it is will be a full day out on some
accounts. Always take the date from the account's timezone —
[T1-8](../03-projects/t1-08-the-timezone-trap.md) is this exact problem.

---

## Before anything you write runs on a schedule

| | Check |
|---|---|
| **It only reads** | No bid, budget, status or keyword changes anywhere in it |
| **You ran it manually first** | At least twice, and you know what normal output looks like |
| **It names its sheet** | A scheduled script has no "active" sheet — nobody has it open at 7am |
| **It stamps its output** | Account, timezone, date range, when it ran. Every time |
| **It labels platform conversions** | The Google Ads Conversions column is not reported revenue. Say so in the output, not just in your head — see [`how-brady-measures.md`](./how-brady-measures.md) |
| **Alex has seen it** | Before it goes on a schedule, not after |

Then run [`before-it-ships.md`](./before-it-ships.md) over it like any other change.

⚠️ **Nothing you paste into a corporate Google account may reference this repo or any AI
tool** — Google Ads scripts, Apps Script, shared docs and query comments included. Gemini is
Brady's sanctioned tool if you need one.

---

## Where to go now

1. **[`06-tracker/starter-scripts/`](../06-tracker/starter-scripts/README.md)** — the ten
   scripts. An hour, maybe two. Start with Google Ads starter 1, or Apps Script starter 2 if
   you want the fastest payoff.
2. **[`06-tracker/google-ads-scripts/`](../06-tracker/google-ads-scripts/_shared-notes.md)** —
   the three real read-only exports that feed actual projects. After the starters these read
   like ordinary code.
3. **[`the-tools-thread.md`](../03-projects/the-tools-thread.md)** — where the numbers live,
   and which tool owns which one.

---

## Check yourself — you're ready to write one when you can

- Say which of the two kinds you'd reach for, given a task, and why.
- Explain why a script that *reads* and a script that *writes* get different rules.
- Say what micros are and what forgetting them does to a number.
- Explain why a scheduled script can't use "the active sheet".
- Name one thing on your week that's worth scripting — and one that looks like it is but isn't.

If any of those is fuzzy, that's the section to re-read — and a good thing to bring to a 1:1.
