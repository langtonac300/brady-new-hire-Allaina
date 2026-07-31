# M-4 · Diagnose the Clarity gap

| | |
|---|---|
| **Time box** | 1–2 days |
| **Account** | Mecco |
| **Safety** | Read-only — **diagnose and route, do not fix** |
| **Paired or solo** | Solo, routed to Alex |
| **Deliverable** | The diagnosis → `04-my-work/projects/` |
| **Builds toward** | [B · How Brady measures things](../05-self-assessment/baseline.md#b--how-brady-measures-things) |

**Do [M-1](./m-01-the-defect-audit.md) first.**

---

## The point

The marking ad groups' UTM and custom URL parameters **don't pass through to Clarity
properly** — so the behavioral data on those visits can't be tied back to the campaign that
paid for them.

This is your first real trace: following one thing through four systems and finding the step
where it disappears. It's a slower, more patient kind of work than the Tier-1 projects, and
it's the shape of most genuine diagnosis in this job. The answer is almost never visible
from any single screen.

---

## What to do

Follow the parameter through the chain. At **each** step, write down what you actually
observed, not what you expect to be there.

| Step | What to establish |
|------|-------------------|
| 1 · What the ad carries | Parameters set at ad level, ad-group level, campaign level and account level. **Check all four** — templates at different levels combine, and they can overwrite each other |
| 2 · What reaches the landing page | Click an ad (or build the final URL by hand) and look at what's actually in the address bar when you land. The account is mid-rebrand, so check whether there's a **redirect** in the path |
| 3 · What Clarity is set up to read | Which parameters is it configured to capture, and does it capture custom ones at all, or only a fixed set? |
| 4 · Where the chain breaks | The first step where what you expected isn't what you saw |

Then write it up: **which step drops it, what evidence you have, and what the fix would be.**
Route it to Alex.

---

## ⚠️ Check for a redirect before anything more exotic

By far the most common cause of a parameter vanishing between an ad and an analytics tool is
a **redirect that doesn't preserve the query string**. Someone sets up a redirect, everything
looks fine because the page loads, and the parameters are silently dropped on the way
through.

Mecco is mid-rebrand from MECCO to Brady, which means redirects are very likely to be in the
path. **Rule that out first.** It costs ten minutes and it's the answer more often than
everything else combined.

---

## ⚠️ Diagnose, don't fix

This touches URLs and tracking templates. A broken template can stop ads serving, or let
them serve while silently breaking the tracking behind them. **Write the fix down; don't
apply it.**

That's not a comment on your judgement — it's the same rule that applies to everyone on
tracking changes, including the people who've been here years.

---

## ⚠️ "I got to step 3 and couldn't get further" is a complete deliverable

Say where you stopped and what you'd need to go further — an access you don't have, a
question for someone else, a system you can't see into.

A trace that stops honestly at step 3 is genuinely useful. A trace that fills step 4 with a
confident guess is worse than nothing, because someone will act on it.

---

## What good looks like

- An actual trace, with **the parameter values you observed at each step** — not a theory
  about what should happen.
- You name the specific step where it breaks, or say clearly that you couldn't narrow it
  past a certain point.
- Your proposed fix is specific enough that whoever implements it doesn't have to redo your
  work.
- You noted anything else you found on the way. Traces usually turn up a second problem, and
  it's normally the more interesting one.
