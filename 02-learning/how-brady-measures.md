# How Brady Measures Things

**Read this one carefully — twice if you need to.** It's the file the rest of this repo
points back to, because it's the thing most likely to make you confidently wrong for weeks
if you skip it. It's also normal for it to feel unclear the first couple of reads — that's
not a reflection on you.

> **Coming from finance, accounting, audit, or an analyst role? Read this page as
> reconciliation — because that's what it is.** The vocabulary is new (first-touch,
> attribution windows, guardrails), but the discipline underneath isn't: every number has a
> source, two sources will disagree, and you don't trust a figure until you know which one it
> came from and what's wrong with it. *Tie it out before you quote it* is the exact instinct
> this whole page is trying to build — so if you already have it, this is your home turf, not
> the thing to be nervous about.

---

## The one rule everything else follows

**The team's reported numbers are First-Touch, 180-day, computed outside Google Ads —
NOT the "Conversions" column inside Google Ads.**

- The **reporting model** is First-Touch (FT): credit goes to the *first* paid click a
  customer made, as long as the sale happens within 180 days of it.
- That model lives in the team's own data systems (BigQuery / Adobe / upload feeds), not
  inside any single ad platform.
- **In-platform conversion actions inside Google Ads use a completely different method** —
  data-driven attribution with a much shorter lookback window (90 days or less).

**Therefore: platform "Conversions" ≠ reported revenue, by design — not by mistake.** Two
different, valid ways of counting the same reality, built for different purposes. If you
quote the Google Ads Conversions column as "our revenue" in a meeting, it will be wrong,
and it will show. Always say **which source and which model** a number came from.

This applies across the whole team's accounts — Brady US, Brady Canada, Seton US, Seton
Canada, EMEDCO, PDC Healthcare, and Wristbands.com all report on the same first-touch
model, even though each account's Google Ads setup looks different underneath.

---

## Why this trips people up (worked example)

A hospital buyer's real journey to an order:

```
Day 1   Clicks a Google paid ad  ← FIRST TOUCH (paid)
Day 8   Comes back via an email link
Day 20  Comes back via organic search
Day 41  Places the order
```

- **Our reported model (First-Touch, 180-day):** the sale is credited to the **Day-1 paid
  click** — paid gets full credit, because the order fell within 180 days of that first
  touch.
- **Google Ads platform "Conversions":** may credit the sale differently (its own
  data-driven model, ≤90-day window) — or, if the *last* click before purchase wasn't
  paid, **may not record this sale as a paid conversion at all.**

The same order can be "paid revenue" in the team's reporting and "not a conversion" in
Google Ads. Neither number is wrong — they're answering different questions. Your job is
never to pick a side; it's to always label which one you're quoting.

---

## The two attribution views you'll actually see

| View | What it is | Where it applies |
|------|-----------|-------------------|
| **FT (First Touch)** | The primary model — first-touch, 180-day window | All accounts |
| **IP ("180day OD")** | A secondary, multi-touch view — 180-day order-date window, gives partial credit across multiple touchpoints instead of all-or-nothing | **Brady US Non-brand only** — this is the view that non-brand's efficiency target is measured against, so if you're looking at Brady US non-brand, make sure you know which view a number is using |

---

## Guardrails — what they are and how to read them

A **guardrail** is a ceiling on an efficiency metric (usually A/S — ad spend ÷ sales;
lower is better) that the team watches per account group. The exact numbers move over time
as plans get finalized, so **always confirm the current target with Alex** rather than
treating any number here as permanent — but the shape is stable and worth knowing:

- **Brady paid search** runs to a tight efficiency target — it's the team's most efficient
  major account group.
- **Seton/EMEDCO** runs to a much looser target — this account group is structurally far
  less efficient than Brady, by design (see
  [`seton-emedco-primer.md`](./seton-emedco-primer.md)). **Never compare Seton/EMEDCO's
  raw efficiency number to Brady's** — they're not playing the same game.
- **Non-brand** (Brady US) has its own, even looser ceiling, and — importantly — it's only
  meaningful when measured against the **IP-attributed** view above, not the standard
  first-touch view. A non-brand number that looks alarming under first-touch alone can be
  perfectly fine once IP attribution is added.
- **Amazon** has its own guardrail, measured on ACOS (a similar concept, Amazon's own
  efficiency metric).

**The single most important habit:** a guardrail is a *ceiling*, not a *target*. The
instinct at Brady, when pacing is behind and efficiency is still inside the guardrail, is
usually to **push spend**, not cut it. Don't develop a reflexive "cut to protect
efficiency" habit — it runs against how the team actually wants accounts managed.

---

## Which numbers can't be trusted (know these before you quote anything)

### The online-to-offline attribution gap
GCLID (the tag that ties a click to downstream data) tracks fine through the team's
analytics systems — the digital side of attribution is solid. The gap is specifically at
the **online lead → offline sale** handoff: when a lead generated by paid media converts
to a sale *offline* (through a salesperson or distributor, for example), that offline
revenue doesn't tie back to the original click. Online/direct revenue reporting is
reliable; offline revenue attribution to paid media is not.

### Phone-call values are estimates, not measured revenue
Call tracking uses dynamic number swap only — there's no system confirming what actually
happened on the call or what it was worth. The dollar value assigned to a phone call
conversion is a planning estimate, not a measured number. Treat it with more skepticism
than a form-fill or a purchase.

### Known tag-management defects (as of mid-2026 — verify current status with Alex)
An audit of Brady's tag-management setup found several confirmed issues that were, as of
that audit, still skewing numbers:
- A chunk of internal company traffic was still registering as real conversions due to a
  configuration bug.
- Some Canadian form conversions were being mis-attributed to the US, and a related bug
  was zeroing out a Canadian tracking action entirely.
- Certain form submissions were firing multiple times across regions instead of once.

**Treat year-over-year comparisons on affected metrics with caution** if you don't know
whether — and when — these were fixed. Ask before repeating a surprising YoY number.

### PDC and Wristbands specifically
The tag-management audit above covered Brady's core accounts first — **PDC and the
Wristbands/Shopify container hadn't been through the same audit yet** as of mid-2026. See
[`pdc-primer.md`](./pdc-primer.md) for the account-specific tracking landmines there.

### Sanity-check surprising numbers against a second source
Brady's budget and spend source sheets have, at least once, had two accounts' figures
accidentally swapped in a shared file. It happens. If a number looks surprising — much
higher or lower than you'd expect — check it against a second source (a dashboard, a
platform export, a colleague) before repeating it in a meeting or a report. "Where is this
from, and what's the caveat?" is the single most useful habit you can build in your first
month here.

### First-touch has its own blind spot
First-touch, 180-day attribution credits the *first* paid touch in a customer's journey.
That can overstate paid media's role in a long, multi-touch buying process, and it doesn't
capture the assist value of mid-funnel campaigns that show up later in the journey but
never get first-touch credit. It's the team's chosen model, not a perfect one — worth
keeping in mind when a first-touch number seems to tell a very clean story.

---

## The takeaway

Every number you'll see at Brady has three questions attached to it, whether or not
someone asks them out loud: **which source is this from, which attribution model is it
using, and is there a known issue with it?** Get in the habit of answering all three before
you repeat a number — in a report, in a meeting, or in a Chat message. It's the fastest way
to build trust here, and the mistake that's easiest to make without noticing.
