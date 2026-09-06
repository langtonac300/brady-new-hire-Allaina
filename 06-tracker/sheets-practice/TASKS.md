# The tasks

Nine of them, in order. They build on each other — task 7 needs what task 1 taught you.

**Budget about two hours.** If a task takes twenty minutes, that's the task working, not you
being slow. Nobody gets `QUERY` right first try.

> Answers are in [`ANSWERS.md`](./ANSWERS.md). **Don't open it until you've had a real go at a
> task.** The gap between your answer and the right one is the part that sticks; reading the
> answer first throws that away and feels like learning.

---

## 1 · Get the data in — and prove you got all of it

Paste `data/search-terms.tsv` into a new sheet called `Search terms`, and `data/daily-spend.tsv`
into a second sheet called `Daily spend`.

Then, before you do anything else, **check you got the whole thing.** Work out:

- the row count, not counting the header
- total impressions, clicks, cost, conversions

Compare all four against the control totals in `ANSWERS.md` §1. *(This is the one time you
open the answers first — they're the control, not the answer.)*

> ### ⚠️ Why this is task 1 and not an afterthought
>
> **A pasted CSV can be silently truncated.** Not with an error — it just stops, and the sheet
> looks completely normal. You'll build a pivot on 600 of 940 rows, get a clean-looking number,
> and take it into a meeting.
>
> This has cost people real credibility at Brady. **Reconciling a total before you trust a
> paste is a habit, not a task** — do it every time, on every export, for the rest of your
> career. It takes fifteen seconds.

**Builds toward:** every project on the ladder. `the-tools-thread.md` names this as the Google
Sheets gotcha.

---

## 2 · Sort and filter

Two lists:

1. The **ten highest-cost search terms.**
2. The **ten highest-cost terms that got zero conversions.**

Use whatever you like — sort, filter views, or just eyeball it. Getting the answer is the
point; the elegant way comes later.

> Notice how different the two lists are. That difference is most of what a search-terms
> review is: the expensive terms and the wasteful terms are not the same terms.

**Builds toward:** T1-3, and the daily keep/kill habit. *"Pull this report and sort it"* starts
nearly every project you'll be given.

---

## 3 · Your first pivot — by campaign

Build a pivot table: **cost, conversions, and conversion value by campaign.**

Then add a calculated column for **CPA** (cost ÷ conversions) and one for **ROAS**
(conv. value ÷ cost).

Which campaign has the worst CPA? Is it the one you'd have guessed from task 2?

**Builds toward:** T2-4, T3-3.

---

## 4 · Pivot deeper — ad group inside campaign

Same pivot, but nest **ad group** under **campaign**.

Find the **worst ad group by CPA** and the **best**.

> ### ⚠️ The empty cell is the trap
>
> An ad group with **zero conversions has no CPA** — you can't divide by zero, so the pivot
> shows a blank or an error.
>
> **A blank CPA is not a good CPA.** It's the worst possible CPA, and sorting by the CPA column
> puts it wherever your spreadsheet feels like putting it. Sort by **cost** as well, every
> time, or the biggest waste in the account hides in an empty cell.

**Builds toward:** T3-3 — a budget recommendation is mostly this pivot plus a reason.

---

## 5 · `FILTER` — make it live

Everything so far breaks the moment the data changes. Now write something that doesn't.

In a fresh sheet, use **`FILTER`** to return every search term with **zero conversions and
more than $50 of cost.**

Then answer: how many are there, what do they cost in total, and what share of account spend
is that?

```
=FILTER(range, condition1, condition2)
```

> Change one cost value in the source data and watch your answer update. That's the difference
> between a number you calculated and a number you can maintain. Change it back.

**Builds toward:** T2-2 — running keep/kill at scale, where the list is too long to eyeball.

---

## 6 · `QUERY` — the one worth the afternoon

Same question as task 5, using **`QUERY`** instead — and this time group the results by
campaign and sort by cost, descending.

```
=QUERY(range, "select A, sum(G) where H = 0 and G > 50 group by A order by sum(G) desc", 1)
```

That's the shape, not the answer — the column letters depend on where you pasted.

**Your task-5 and task-6 totals must match.** If they don't, one is wrong — it's almost always
a `>` that should be `>=`, or a column letter off by one.

> ### Why bother, when `FILTER` worked?
>
> `QUERY` filters, groups, aggregates and sorts in one formula. Once it clicks, a question that
> was a twenty-minute pivot-and-copy becomes one line you can edit.
>
> **It is genuinely awkward for the first hour.** It uses column *letters*, not headers, and its
> error messages are unhelpful. Everyone finds it fiddly at first. Push through this one — it
> pays for itself within a month.

**Builds toward:** T2-2, T3-2, and most of the reporting you'll do after the ramp.

---

## 7 · Per-business-day math — the one that matters

Switch to the `Daily spend` sheet. November 2026. **Monthly target: $48,000.** Today is
**Friday 20 November.**

Work out:

1. **Month-to-date spend** through 20 November.
2. **How many business days November has**, and **how many have elapsed.**
3. **Target per business day**, and **actual per business day.**
4. Are you **ahead of or behind pace?**
5. **Project the full month** at the current rate.

> ### ⚠️ Do step 2 twice
>
> Once counting **weekdays only**. Then again with **company holidays removed** — Thanksgiving
> is Thursday 26 November, and the Friday after is a holiday too.
>
> Compare your answers to step 4 under both. **They do not agree, and they don't merely differ
> by a rounding error — they give opposite answers.** One says you're ahead of pace. The other
> says you're behind. Same spend, same month.
>
> This is not a made-up exercise. Brady tooling has calculated business days without
> subtracting holidays, and the resulting per-day figures were quietly wrong for anyone who
> didn't check. **The spend was real. The divisor wasn't.**

**Builds toward:** **T2-4, the pacing note** — this *is* T2-4's arithmetic, on safe data.

---

## 8 · Find the name collision

Go back to the search terms and look hard at the **brand campaign**.

Some of those terms are not people looking for a safety supplier at all. Find them. Then work
out what they cost, how many impressions they took, and what share of the account that is.

> ### ⚠️ Why this hides
>
> Brand campaigns are *supposed* to look efficient, so nobody audits them. And these terms are
> **cheap** — individually too small to notice. What they do is soak up impressions and drag
> the campaign's CTR down, which looks like a performance problem rather than a targeting one.
>
> **This is not hypothetical for you.** "Brady" is a company, a brand, *and* a retired NFL
> quarterback. You will meet the real version of this in your first month.

**Builds toward:** T2-1, T2-2, and the name-collisions section of `who-else-is-searching.md`.

---

## 9 · Write the five-line pacing note

Put it together. Using your task-7 numbers, write the **five-line pacing note** from
[`t2-04-the-pacing-note.md`](../../03-projects/t2-04-the-pacing-note.md):

| Line | Carries |
|---|---|
| 1 | Where we are — MTD spend vs. target, per business day |
| 2 | Ahead or behind, and by how much |
| 3 | The main driver, named specifically |
| 4 | What it means for the rest of the month |
| 5 | What you're doing about it, or what you need decided |

Tasks 5 and 8 gave you two defensible drivers for line 3. Pick one and name it with a number.

> **Then check it the way Alex will:** point at any number in your note and ask *"where did that
> come from?"* If you can't answer in one sentence, the note isn't finished. That question is
> the whole job.

**Builds toward:** T2-4 directly. When you write the real one, you'll have written it once.

---

## When you're done

You don't need to show this to anyone — it's practice, and nothing here is real.

**But bring one thing to your 1:1: whichever task took longest.** That's the genuine gap, and
it's much cheaper to close now than on a live account with a real budget behind it.
