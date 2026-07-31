# T1-7 · Brand vs. non-brand

| | |
|---|---|
| **Time box** | 1 hour |
| **Account** | Seton US |
| **Safety** | Read-only |
| **Paired or solo** | Solo, with a 10-minute readout |
| **Deliverable** | The split, plus what the exclusion lists actually do → `04-my-work/projects/` |
| **Builds toward** | [A · Foundational paid-search skills](../05-self-assessment/baseline.md#a--foundational-paid-search-skills) · [B · How Brady measures things](../05-self-assessment/baseline.md#b--how-brady-measures-things) |

**Read first:** the *Brand / Non-brand* row in
[`cheat-sheet.md`](../02-learning/cheat-sheet.md) and the guardrails section of
[`how-brady-measures.md`](../02-learning/how-brady-measures.md).

---

## The point

Brand and non-brand are the core split in paid search, and they behave so differently that
blending them produces a number that describes neither. Someone searching for you by name
was already coming; someone searching for what you sell might not have been.

Two things come out of this hour: the split itself, and — more interesting — **the
machinery that keeps the two apart**, which is not obvious and is easy to break.

---

## What to do

1. **Split Seton US spend into brand and non-brand** over the last 90 days. This isn't a
   toggle in the interface — you'll build it from the campaign naming convention. Check the
   convention with Alex first rather than guessing at it.
2. **Report both numbers and the ratio.** Note what surprised you about the balance.

   ⚠️ **Some campaigns won't fit the convention.** This is the untidy account — expect
   names that predate the current scheme, or don't follow it at all. **Don't force them into
   a bucket.** Put them in a third pile, report what share of spend sits there, and say so.
   *"I could classify 88% of spend and here's what the other 12% looks like"* is a better
   answer than a clean split you had to fudge — and the size of that third pile is often the
   most interesting number in the exercise.
3. **Now find the mechanism.** Something has to stop the non-brand campaigns from bidding on
   brand searches, and vice versa — otherwise they'd compete with each other for the same
   auctions. Go and find what's doing that job, and describe how it works.
4. **Answer the question:** why does the team treat the two differently at all? Get to a
   reason that would survive someone pushing back on it.

---

## What to look for

| Look for | Why it matters |
|---|---|
| Campaigns that **don't fit the naming convention** | They're the third pile — its share of spend is often the most interesting number, and forcing it into a bucket hides the real answer |
| Shared "negative" lists whose terms are **things Seton actually sells** | That's a **routing** list — pushing traffic between campaigns — not hygiene. Cleaning it up would redirect traffic silently |
| Shared lists full of **things nobody would ever pay for** | That's genuine hygiene |
| Brand and non-brand campaigns that could **bid on the same searches** | If nothing separates them, they compete with each other in the same auction |

---

## ⚠️ Read the list before you decide what it's for

You'll find shared lists labeled as negative keywords. **On this account group, roughly
half of them are not hygiene lists.** A meaningful number exist to *route* traffic between
campaigns — pushing a search away from one campaign so a different one picks it up — rather
than to block bad traffic.

The tell is the contents. **Open the list and read the actual terms.** If it's full of
things Seton sells, it's doing routing, not blocking. If it's full of things nobody would
ever want to pay for, it's hygiene.

This distinction matters far beyond this project: treating a routing list as junk and
"cleaning it up" would redirect traffic across the account in ways nobody intended.

---

## You're done when

- [ ] Both numbers, the ratio, and the window you measured over
- [ ] The **third pile** reported as a share of spend — not forced into brand or non-brand
- [ ] You named **which lists** do the separating, mechanism described in one plain sentence
- [ ] Your step-4 answer is about **incrementality** — what the spend bought — not "brand is cheaper" (cheaper is a symptom)
- [ ] Bonus: you spotted at least one list that's routing, not hygiene
- [ ] Standard wrap — prediction first, written up the same day
