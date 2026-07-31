# The tools thread — where the numbers live

Like [the AI thread](./the-ai-thread.md), this one isn't a tier. It runs alongside the whole
ladder from week one. The ramp trains some of these tools properly — Google Ads most of all —
and only *introduces* others, which is deliberate ([`after-the-ramp.md`](./after-the-ramp.md)
is honest about the ones you'll have touched only once by day 90). This thread is the map: which
tool owns which number, what access each one needs, and why two tools looking at "the same"
thing routinely disagree.

> **The tool is the *source*, not the *truth*.** Before you quote any number, you should be able
> to name the tool it came from, its date range, and its timezone — and you should *expect* a
> second tool to say something different, because they measure differently. That habit —
> *"where's this from, and what's the caveat?"* — is the one this whole thread is here to build.
> It's the same instinct [`how-brady-measures.md`](../02-learning/how-brady-measures.md) trains,
> pointed at the tools instead of the models.

⚠️ **No credentials, ever** — access is requested, never pasted into anything, including an AI
tool. And access isn't instant or uniform: some of it goes through another team and takes real
time, so the asks below are early tasks even for tools you won't touch for weeks.

---

## Getting in — access isn't automatic

| When | What you should have | Note |
|------|----------------------|------|
| **Day 1** | Google Ads, the MTD Spend dashboard, Google Chat, your calendar with the standing meetings on it | If any login doesn't work, **say so that day** — access takes far longer to fix than to request |
| **By end of week 2** | Microsoft/Bing Ads, Power BI, Adobe Analytics, Jira | You won't be deep in these yet — you're getting the doors open before you need them |
| **Ask early, arrives late** | **BigQuery** | It goes through **Tyler Whitten's Marketing Analytics team** (see [`../01-start-here/who-everyone-is.md`](../01-start-here/who-everyone-is.md)), not the paid-media team, so it's the slowest to land. Request it in week one even though you won't use it for a while |

---

## The map — which tool owns which number

| The question | The tool that owns the answer | Watch for |
|--------------|-------------------------------|-----------|
| *What did we spend?* | **Google Ads** (per account, live) and the **MTD Spend dashboard** (blended, for pacing) | Timezone differs by account; a dashboard figure and a platform export can disagree — say which one you mean |
| *How are we pacing vs. budget?* | The **MTD Spend dashboard** | Normalize per business day, and check holidays by hand — see [T2-4](./t2-04-the-pacing-note.md) |
| *What did we actually make — reported revenue?* | **BigQuery / Adobe** (first-touch, 180-day) | **Not** the Google Ads "Conversions" column — different model, different place ([`how-brady-measures.md`](../02-learning/how-brady-measures.md)) |
| *Is a conversion firing correctly?* | **GTM** (the tag layer) + the account's conversion settings | You **diagnose**; a senior executes the live fix — see [T3-1](./t3-01-first-conversion-tracking-pass.md) |
| *What's the trend / the monthly story?* | **Power BI**, with BigQuery underneath it | It's a reporting layer, not the source. Trace a surprising number back to where it's computed before you trust it |
| *The weekly scorecard numbers* | Read in the **L10 huddle**, out of the MTD workbook | Every number carries its caveat, read out with it ([`the-l10-huddle.md`](../02-learning/the-l10-huddle.md)) |

---

## The tools, one at a time

Each one: what it is · your access level during the ramp · the single gotcha.

| Tool | What it is / your ramp access | The gotcha |
|------|-------------------------------|-----------|
| **Google Ads** | The platform. Standard access day one — this is the one you operate | Its **Conversions** column is not reported revenue. Live in-platform metrics only |
| **MTD Spend dashboard** | The team's spend + pacing view; a real internal dashboard (Alex shows you where). The **L10 Huddle app lives in the same workbook** | It's the pacing source — but reconcile a surprising figure against the platform before repeating it |
| **Google Sheets** (beyond basics) | A lot of Brady reporting is Sheets. Beyond-basics = pivot tables, `QUERY`/`FILTER`, and knowing a pasted CSV can be **silently truncated** — it may not be the whole table | This is where the pacing note and the budget math actually get done |
| **Power BI** | The trend / reporting layer, owned by the analytics team; access ~week two | Not the source. Every number in it is computed somewhere upstream — stay able to name where |
| **Adobe Analytics** | On-site behavior, and part of the reported-revenue picture (the "BigQuery / Adobe" path) | On-site sessions ≠ ad-platform clicks. Different questions, different tool |
| **BigQuery / SQL** | Where the reported first-touch numbers actually live — the **biggest single unlock** on the whole list. Access via the analytics team | During the ramp you'll read and request more than you write. ⚠️ **Never trust an invented table or column name**, and reconcile any pull to a number you already believe |
| **GTM** (Google Tag Manager) | The conversion-tracking layer — where the tags live. Introduced, not owned, during the ramp | Widest blast radius of anything you can touch. You learn to *read* it; a senior changes it ([`before-it-ships.md`](../02-learning/before-it-ships.md)) |
| **Microsoft/Bing Ads** | The other search platform. Introduced ~week two; genuinely different from Google in ways that matter | Don't assume a Google habit transfers. `BNG` in naming = Bing |
| **Jira** | The department uses it, but day-to-day work with Alex runs through Chat and 1:1s | It's not the queue your work flows through — don't wait on a ticket to start |

---

## ⚠️ Why two tools disagree — the four you'll actually hit

This is the load-bearing section. When a number in one tool doesn't match the "same" number in
another, it's almost always one of these — and none of them means a tool is broken.

1. **Timezone.** Accounts run on different clocks — PDC on Los Angeles, the core Brady accounts
   on Chicago, Seton on Eastern, EMEDCO on Central. *"Yesterday"* is not one yesterday across
   them, and a day-boundary cutoff is exactly where day-over-day comparisons go wrong. See
   [T1-8](./t1-08-the-timezone-trap.md).
2. **Attribution model.** Google Ads "Conversions" (its own data-driven model, ≤90-day window)
   against the team's reported first-touch, 180-day. Same sale, two valid counts — never quote
   one as the other ([`how-brady-measures.md`](../02-learning/how-brady-measures.md)).
3. **Business-day normalization.** A lot of Brady reporting is *per business day*. A raw
   month-over-month that ignores how many business days each month had will mislead you, and the
   miss is invisible ([`cheat-sheet.md`](../02-learning/cheat-sheet.md)).
4. **Near-duplicate spreadsheets.** *"Final"* in a filename means nothing — copies disagree, and
   two accounts' figures have been accidentally swapped in a shared sheet at least once. If a
   number looks surprising, check it against a second source before you repeat it.

---

## What good looks like

- **For any number in your Deep Dive, you can name the tool, the model, and why another tool
  might say otherwise.** That's the day-90 target, and it's what makes your numbers trustworthy
  in the huddle ([`after-the-ramp.md`](./after-the-ramp.md)).
- **You know your access level for each tool**, and by day 90 you've said out loud to Alex which
  "used it once" tools you want to convert to "can operate unaided." BigQuery is the usual first
  pick, because it changes which questions you can answer without asking anyone.
- **The analytics team is your route for BigQuery, attribution and Power BI questions** — get to
  know Tyler Whitten's team early, since your BigQuery access already runs through them.

---

## Where this connects

- [`how-brady-measures.md`](../02-learning/how-brady-measures.md) — the models behind the tools; read alongside this
- [`the-l10-huddle.md`](../02-learning/the-l10-huddle.md) — where the scorecard numbers get read, and the caveat rule
- [T2-4](./t2-04-the-pacing-note.md) · [T3-3](./t3-03-a-budget-recommendation.md) — the spend dashboard and the pacing/budget math in practice
- [T3-1](./t3-01-first-conversion-tracking-pass.md) · [`before-it-ships.md`](../02-learning/before-it-ships.md) — GTM and the conversion layer
- [the AI thread](./the-ai-thread.md) — the sibling thread; the two run together
