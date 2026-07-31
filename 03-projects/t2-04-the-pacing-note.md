# T2-4 · The pacing note

| | |
|---|---|
| **Time box** | Half a day |
| **Account** | PDC |
| **Safety** | Read-only |
| **Paired or solo** | Solo, reviewed by Alex before it goes anywhere |
| **Deliverable** | A five-line pacing note → `04-my-work/projects/` |
| **Builds toward** | [B · How Brady measures things](../05-self-assessment/baseline.md#b--how-brady-measures-things) · [D · Operating rhythm](../05-self-assessment/baseline.md#d--operating-rhythm) |

**Read first:** [`how-brady-measures.md`](../02-learning/how-brady-measures.md) — the
guardrails section especially — and *Worked Example 3 — a good "why" vs. a bad one* in
[`cheat-sheet.md`](../02-learning/cheat-sheet.md).

---

## The point

**Pacing** means: at this point in the month, are we on track to spend what we planned to
spend? Behind pace means budget will go unused. Ahead of pace means running out early.

Writing this up is a weekly job, and it is deceptively hard, because the audience isn't
another paid-search person. It goes to people who care about the number and the reason, and
have no interest in the mechanics.

**Five lines. That's the whole brief.** Cutting a month of account activity down to five
useful lines is the skill.

---

## What to do

1. Get the **month-to-date spend** for PDC from the MTD spend dashboard. Ask Alex where it
   lives and how to read it — this is a real internal dashboard, not something in this repo.
2. Get the **monthly target**. Don't take a target figure from any document in this repo,
   including this one — get the current number from Alex or from the plan itself. Targets
   change and a stale target makes the whole note wrong.
3. Convert both to a **per-business-day** figure. This is the part that matters:

   > Spend doesn't arrive evenly across a month. It arrives on business days. A month with
   > 21 business days and a month with 23 are different months, and comparing raw
   > month-to-date totals across them tells you nothing.

   So: target per business day, actual per business day, and the gap between them.
4. Work out **what changed and why.** Not just the direction — the mechanism. A number
   without a cause is noise, and the "why" is the only part of the note anyone will act on.
5. Write the five lines. Suggested shape, though don't follow it slavishly:

   | Line | Carries |
   |---|---|
   | 1 | Where we are — MTD spend vs. target, per business day |
   | 2 | Ahead or behind, and by how much |
   | 3 | The main driver, named specifically |
   | 4 | What it means for the rest of the month |
   | 5 | What you're doing about it, or what you need decided |

6. Show it to Alex before it goes anywhere else.

---

## ⚠️ Business-day math is not always automatic

Some tooling calculates business days without accounting for company holidays. A week
containing a holiday gets counted as a full five-day week, so the per-day figures for that
week are quietly wrong — the spend was real, the divisor wasn't.

**Check the business-day count yourself against the actual calendar** any month containing a
holiday. This is exactly the class of error that survives for months because everyone
assumes the dashboard handled it.

## ⚠️ Say which source, always

Every number in the note carries its source and model. You did this in
[T1-5](./t1-05-source-and-caveat-the-slide.md) and it applies permanently: a spend figure
from the dashboard and a spend figure from the platform can disagree, and if you don't say
which one you used, the first question you get will be "where's that from?"

---

## You're done when

- [ ] MTD spend and the **current** target, both converted to **per business day** (holidays checked by hand)
- [ ] Every number carries **its source and model**
- [ ] Line 3 names a **mechanism, not a mood** (see the example below)
- [ ] Five lines, and **no jargon survives** — not *tROAS*, not *IS*, not *NB*
- [ ] Honest about what you don't know ("can't yet explain the drop on the 9th — looking into it" is a fine line 5)
- [ ] Shown to Alex before it goes anywhere else
- [ ] Standard wrap

> **Driver line, good vs weak:** 🟢 *"Shopping spend is up because a competitor stopped bidding
> and our impression share rose."* 🔴 *"Performance improved."* The first names the mechanism;
> the second is a mood.
