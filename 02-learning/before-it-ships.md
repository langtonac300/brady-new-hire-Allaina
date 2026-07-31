# Before it ships

The check you run on your own work before you post it for review — and again before you
apply it.

---

## Why this exists

Not because you'll be careless. Because paid search punishes a very specific kind of
mistake: the one where everything you *thought* about was right, and the thing that broke
was a setting you never looked at.

That kind of error doesn't announce itself. Nothing turns red. Traffic just quietly stops
arriving, or a number quietly stops meaning what everyone assumes it means, and it gets
found weeks later by someone reading a report.

A checklist catches those, and nothing else does. **Experience doesn't replace it** — the
people here who have done this longest are the ones most attached to running it.

> **The rule that matters:** the checklist is what's responsible for catching errors. You
> are responsible for running it honestly, every time. If something gets through that no
> line here would have caught, the checklist gets a new line. That's the repair — not you
> resolving to be more careful.

---

## Every change, no exceptions

| | Check |
|---|---|
| ☐ | **It's the right account.** Mecco is not EMEDCO. PDC Healthcare is not PDC Wristbands. Seton US is not Seton CA. Read the account name off the screen, not off your memory of which tab you opened |
| ☐ | **You can say the undo out loud** — the actual steps, not "it's probably reversible" |
| ☐ | **The before state is saved.** An export, a screenshot, a pasted table. Whatever it is, it exists outside the platform |
| ☐ | **Every number you used has a source and a date range**, and you know which time zone that range is in. See [`how-brady-measures.md`](./how-brady-measures.md) |
| ☐ | **It's posted in the proposed-change thread and someone has replied.** Until you have a track record on this *kind* of change, no reply is not approval |
| ☐ | **You wrote down what you changed, where and when** — the plan before, the timestamp after |

That last one protects you more than anything else on this page. In two weeks someone will
ask why a number moved, and "I applied a negatives list on the 14th" needs to be findable
in your own notes rather than reconstructed from change history.

---

## If it's negative keywords

| | Check |
|---|---|
| ☐ | **Match type chosen deliberately, term by term.** Broad negatives block every search containing those words in any order — reserve them for words that could not appear in a good search |
| ☐ | **You checked what the list is actually attached to**, rather than what its name implies |
| ☐ | **You know whether it's a hygiene list or a sculpting list** — see the warning below |
| ☐ | **You can state the cost of the block, not just the saving** |

### ⚠️ Not every list called "negative" is there to block waste

A large share of Brady's shared negative lists exist to **route traffic between campaigns**
rather than to stop it — keeping brand searches out of non-brand campaigns, or steering
products toward the right Shopping campaign. The terms inside them are often things Brady
very much wants to sell.

So adding a term to one of those doesn't remove waste. It sends traffic somewhere you
didn't intend, and it looks like nothing happened until a different campaign's numbers
move.

**If you can't tell which kind of list you're looking at, ask before you add to it.** The
name won't tell you. Open it and read the terms — if they're things Brady sells, it's
sculpting.

---

## If it's a new campaign or ad group

| | Check |
|---|---|
| ☐ | **Naming matches the campaigns already in that account.** Reporting downstream is built on these names |
| ☐ | **Networks: you chose.** Search Partners and Display expansion are either on for a reason or off for a reason. Inheriting the default without looking is not a choice |
| ☐ | **Location targeting: you know whether it's set to presence or to presence-or-interest**, and why. This is one of the classic quiet leaks |
| ☐ | **Negative lists are attached** — and you confirmed it after saving, not before |
| ☐ | **You can name the conversion actions this campaign optimizes to.** "It exists in the account" is not the same as "it's the one bidding reacts to" |
| ☐ | **Tracking is on it** — the same final URL suffix or tracking template the rest of the account uses. A missing one is how a campaign disappears from reporting while still spending |
| ☐ | **Budget and bid strategy are what you meant, in the units you meant** — daily and monthly are easy to confuse and expensive to confuse |
| ☐ | **At least two ads**, and you chose whether automatically created assets are on |

---

## If it touches conversions or conversion values

Stop and read this one twice.

Conversion settings have the widest blast radius of anything you can edit. Smart bidding
reacts to them, it reacts across the whole account rather than the thing you edited, and
the reaction shows up over days — so by the time it's visible, several other things have
also changed and nobody can separate them.

**These are never a solo change while you're ramping.** Not because you won't understand
them — you will, and one of your Mecco projects is exactly this — but because the review
step is doing real work here, not ceremony.

---

## When something goes wrong anyway

It will, eventually, to you and to everyone else. What matters is the next hour.

- **Say it immediately.** An error you flag in ten minutes is a small operational thing.
  The same error found three weeks later, by someone else, inside a report, is a different
  problem — not because you're in more trouble, but because by then it's tangled up in
  numbers people have already used and decisions they've already made.
- **Don't fix it quietly first.** Say what happened, then fix it. A silent fix removes the
  evidence of what the effect was.
- **Then work out which check would have caught it** and add it here. This file is supposed
  to grow.

Nobody on this team has a clean record on this. The ones who look like they do are the ones
who flagged it early.

---

## How to use it

Copy the relevant sections into your project write-up in `04-my-work/` and tick them there,
so the completed checklist sits next to the change it belongs to. A checklist you ran but
didn't record is, three weeks later, indistinguishable from one you skipped.
