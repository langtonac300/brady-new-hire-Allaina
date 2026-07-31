# T3-2 · Waste at scale

| | |
|---|---|
| **Time box** | One to two days |
| **Account** | One account group — Seton / EMEDCO |
| **Safety** | Read-only — a waste map and a proposal, reviewed before anything changes |
| **Paired or solo** | Solo, with a readout |
| **Deliverable** | A quantified waste map plus one structural recommendation → `04-my-work/projects/` |
| **Builds toward** | [D · Operating rhythm](../05-self-assessment/baseline.md#d--operating-rhythm) · [E · Judgment](../05-self-assessment/baseline.md#e--judgment) |

**Read first:** your own [T2-1](./t2-01-sqr-predict-then-compare.md) /
[T2-2](./t2-02-the-same-drill-at-scale.md) write-ups and
[`who-else-is-searching.md`](../02-learning/who-else-is-searching.md).

---

## The point

The daily search-terms review catches waste **one term at a time.** It's the right tool for
"should this specific term be a negative," and you've done it. This project asks a bigger
question the daily loop can't: **across a whole account group, where does money go on search
terms that never had a chance — and what one structural change would stop it recurring?**

That last clause is the point. Anyone can list bad terms. The skill that's worth a day is
looking at the *pattern* underneath the list — a match type that's too loose in one campaign,
an ad group buying intent it was never built for, a whole theme of traffic with no negative
protecting it — and naming the change that fixes the category instead of the symptom.

This is your first properly **program-level** piece of analysis. It's the manual version of
the first strategic shift in [`after-the-ramp.md`](./after-the-ramp.md) — the machine can
only run a loop you've first understood by hand.

---

## What to do

### 1 · Get the raw material and set the window

Pull the search-terms report for the account group over a sensible window — enough to be more
than noise, not so much it's a different era. Ask Alex what window the team trusts for this.
You want **term, matched keyword, campaign, ad group, cost, and conversions.**

> ⚠️ **Cost is the reliable column; the conversion/value side carries every caveat from
> `how-brady-measures.md`.** This is a spend-waste analysis, so lead with cost — "spent real
> money, returned nothing it was meant to" — and treat the revenue side as directional.

### 2 · Find the waste, then find the *shape* of it

Sort by cost. The expensive-and-converting terms are fine. You're hunting the
**expensive-and-not** — but don't stop at listing them. Group them:

- by **campaign / ad group** — is one place responsible for most of it?
- by **match type** — is broad match doing the damage a phrase would have contained?
- by **theme** — the archetypes from `who-else-is-searching.md`: research intent, a
  name-collision, a wrong-audience bucket, `free`/DIY intent in a B2B account.

The concentration is the finding. "Forty per cent of the wasted spend is one ad group running
broad match against a term theme it was never built for" is worth ten times a flat list.

### 3 · Name the one structural change

For the biggest concentration, write the change that stops it at the source — a match-type
tighten, a negative *theme* (not one term), a re-pointed ad group, a budget the campaign
shouldn't have. **One** recommendation, with the cost it would have saved over your window as
the number behind it.

---

## ⚠️ A structural change is a bigger lever than a keep/kill — and a bigger blast radius

Tightening a match type or adding a theme-level negative redirects traffic *silently*, across
many terms at once — the over-blocking risk from `who-else-is-searching.md`, scaled up. `free`
as a negative theme blocks `free shipping`. A match-type tighten can cut good long-tail
traffic you never saw in the report because it converted quietly.

**So this stays a proposal.** You map the waste and recommend the change; the change goes
through Alex, and if it's real it probably goes through a test
([`running-a-real-test.md`](../02-learning/running-a-real-test.md)) before it goes account-wide.

## ⚠️ Don't confuse "expensive" with "wasteful"

A term that spent a lot and converted a lot is working. A brand-defense or named-competitor
term can look wasteful on direct ROAS and be doing exactly its job — you learned this on
Wristbands. Waste is *spend with no plausible path to value*, not *spend with a low number
next to it.* Say which one each row is.

---

## What good looks like

- The deliverable leads with a **concentration**, not a list — where the waste clusters and
  how much of the total it is.
- Your one recommendation is **structural** — it changes a setting or an architecture, so it
  fixes a category rather than today's forty terms.
- The number behind it is a **cost** figure with its window stated, not a revenue figure
  dressed up as certainty.
- You flagged at least one term that *looks* like waste but isn't, and said why — that's the
  judgment the daily loop doesn't train.
