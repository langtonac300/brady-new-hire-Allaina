# Google Sheets for paid search

Most of the analysis in this job happens in a spreadsheet. Not because Sheets is the best tool
for it, but because it's where the data lands, where the team already works, and where a
number can be checked by someone who doesn't write SQL (structured query language).

You do not need to be a spreadsheet expert. You need **five specific things**, and you need to
know **four ways they lie to you.**

> **Want to practise rather than read?** There's a guided workbook with a fake account and nine
> tasks in [`06-tracker/sheets-practice/`](../06-tracker/sheets-practice/README.md). Two hours,
> nothing real, and it covers everything on this page. Good in weeks 3–5, before
> [T2-4](../03-projects/t2-04-the-pacing-note.md) needs the arithmetic for real.

---

## The five things

### 1 · Sort and filter

The unglamorous one, and the one you'll use most. Nearly every project starts with *"pull this
report and sort it."*

Worth knowing beyond the basics: **filter views** let you slice a shared sheet without changing
what anyone else sees. On a sheet the team is looking at, use a filter view rather than a
filter — otherwise you're rearranging someone else's screen while they're reading it.

### 2 · Pivot tables

A pivot answers *"what's the total, broken down by category?"* — cost by campaign, conversions
by ad group, spend by month.

If you can build a pivot and add a calculated field, you can answer most of the questions
you'll be asked in your first three months. **CPA** — cost per acquisition (cost ÷ conversions) — and **ROAS** (return on ad spend)
(conv. value ÷ cost) as calculated fields are the two that come up constantly.

### 3 · `FILTER`

```
=FILTER(A2:I940, H2:H940=0, G2:G940>50)
```

Returns the rows matching your conditions, **live**. When the source data changes, the answer
changes. A sorted-and-copied list is a photograph; `FILTER` is a window.

### 4 · `QUERY`

```
=QUERY(A1:I940, "select C, sum(G) where H = 0 group by C order by sum(G) desc", 1)
```

Filter, group, aggregate and sort in one formula. It's SQL-shaped, which means it's also the
gentlest on-ramp you'll get to actual SQL — and BigQuery is
[described in this repo](../03-projects/the-tools-thread.md) as the biggest single unlock on
the tools list.

> ⚠️ **`QUERY` is awkward for the first hour and then it isn't.** It uses column *letters*
> rather than headers, so inserting a column silently breaks it, and its error messages are
> close to useless. Everyone finds it fiddly at the start. It's still worth the afternoon.

### 5 · Per-business-day math

Spend doesn't arrive evenly across a month — it arrives on **business days**. A month with 21
business days and one with 19 are different months, and comparing raw month-to-date totals
across them tells you nothing.

So the unit is almost always **per business day**: target per business day, actual per business
day, and the gap. See [T2-4](../03-projects/t2-04-the-pacing-note.md).

---

## The four ways a spreadsheet lies to you

These are not beginner mistakes. Experienced people ship all four.

### ⚠️ 1 · A pasted CSV (comma-separated values file) can be silently truncated

It doesn't error. It just stops. The sheet looks completely normal, your pivot builds fine, and
the number is wrong.

**The habit: reconcile a total before you trust a paste.** Row count and total cost against
what the source said. Fifteen seconds, every export, forever.

The same applies to a BigQuery console CSV export — those truncate silently too, which is why
you never infer how something is distributed from one.

### ⚠️ 2 · A blank CPA is not a good CPA

An ad group with zero conversions has no CPA — you can't divide by zero. The pivot shows a
blank or an error, and sorting by CPA puts it wherever it feels like.

**A blank in that column is the worst possible result, displayed as nothing at all.** Always
sort by cost as well as by CPA, or the biggest waste in the account hides in an empty cell.

### ⚠️ 3 · Business-day math that ignores holidays

Some tooling counts weekdays and calls them business days. A week containing a company holiday
gets counted as a full five days, so the per-day figures are quietly wrong.

This is not hypothetical — it has happened in Brady tooling, and the numbers looked completely
reasonable. **On a month like November it can flip the conclusion**, turning "behind pace" into
"ahead of pace" with no visible error anywhere.

**Check the business-day count against an actual calendar** any month containing a holiday. The
spend was real; the divisor wasn't.

### ⚠️ 4 · A number with no source

The most dangerous cell in any spreadsheet is one that was pasted in from somewhere nobody
remembers. It survives, gets copied into a deck, and becomes true by repetition.

**Whatever you build, be able to answer "where did that number come from?" in one sentence.**
If you can't, it isn't finished. That question is most of the job.

---

## Where this shows up

| You'll need | In |
|---|---|
| Sort and filter | [T1-3](../03-projects/t1-03-keyword-vs-search-term.md), the daily keep/kill review |
| Pivot tables | [T2-4](../03-projects/t2-04-the-pacing-note.md), [T3-3](../03-projects/t3-03-a-budget-recommendation.md) |
| `FILTER` / `QUERY` | [T2-2](../03-projects/t2-02-the-same-drill-at-scale.md), [T3-2](../03-projects/t3-02-waste-at-scale.md) |
| Per-business-day math | [T2-4](../03-projects/t2-04-the-pacing-note.md) — it *is* the project |
| Truncation checking | All of them |

---

## One more thing

**If any of this is genuinely new, say so early.** `about-how-you-work.md` asks about
spreadsheets for exactly this reason, and the honest answer buys you the practice workbook and
half a day — where the same gap discovered at T2-4 costs a wrong number in front of people who
act on it.

Nobody minds a "never" in week one. It's the hidden ones that get expensive.
