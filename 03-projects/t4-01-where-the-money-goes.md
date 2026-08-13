# T4-1 · Where the money goes

| | |
|---|---|
| **Time box** | Two to three days |
| **Account** | Mecco |
| **Safety** | Read-only — you're establishing the baseline, not moving anything. The tracking check is a check, not a change |
| **Paired or solo** | Solo, except the tracking verification — that one needs someone with tag-manager access, so book Alex or Tyler |
| **Deliverable** | A spend-and-quality diagnosis, **and the change log the rest of the capstone runs on** → `04-my-work/projects/` |
| **Builds toward** | [A · Foundational paid-search skills](../05-self-assessment/baseline.md#a--foundational-paid-search-skills) · [B · How Brady measures things](../05-self-assessment/baseline.md#b--how-brady-measures-things) |

**This is stage 1 of 4.** [T4-2](./t4-02-a-second-way-in.md), [T4-3](./t4-03-the-landing-page-test.md)
and [T4-4](./t4-04-what-it-should-spend.md) all measure against what you establish here.

**Read first:** your own [M-1](./m-01-the-defect-audit.md) write-up, and the search-terms drill
from [T2-1](./t2-01-sqr-predict-then-compare.md).

---

## The point

You've owned this account since about day 45 ([M-5](./m-05-own-it.md)). You found the defects
(M-1), fixed the values (M-2) and built the negatives (M-3). The capstone is the next thing an
owner does: **change what the account earns, and be able to prove it was you.**

That second half is why this stage exists. From here on you become the largest single source of
change on this account. If you don't write down the starting position first, every number you
report in three weeks is a story rather than a result.

**Nothing in this stage is a change.** It's the measurement you'll be judged against.

---

## What to do

### 1 · Verify the conversion actually fires — before anything else

Mecco's primary conversion is the free-sample request form on the transition landing page. Go
and confirm, with your own eyes, that completing that form records a conversion.

Do not assume it does. **This form is the exact shape that breaks silently:**

| What's unusual about it | Why that breaks tracking |
|---|---|
| It's a multi-step wizard, submitted by JavaScript | There's no page load to hang a tag on |
| The URL never changes — no thank-you page | Most conversion setups key off a URL change. There isn't one here |
| Success is a hidden panel becoming visible | The "conversion happened" signal is a visual state, not an event anything listens for by default |

Book time with Alex or Tyler and watch it happen in tag-manager preview mode: submit the form
on the live page, and confirm the conversion tag fires right after. Write down the date you
verified it and how.

> ⚠️ **This is a gate, not a task.** If the conversion doesn't fire, stop and escalate to Alex
> the same day. Every number in T4-2, T4-3 and T4-4 is measured against this one, and a
> capstone built on a conversion that records zero is three weeks of measuring nothing. Finding
> that out on day one is a good outcome — finding it out at the readout is not.

### 2 · Find out where the money actually went

Per campaign: spend, clicks, conversions, cost per conversion, over the account's life.

**Two things to notice while you're in there,** because they shape T4-4:

- **Not every campaign in this account is running.** Find out how many exist, how many are
  enabled, and what each one's daily budget is set to. Don't take the count on faith — count them.
- **The number in Google Ads and the number on the MTD dashboard may not match.** If they
  disagree, that's the [tools thread](./the-tools-thread.md) question, and you should be able to
  say which one you'd quote and why.

### 3 · Run the search-terms review

Same drill as T2-1, on your own account this time. Every term: keep, promote, negate, monitor.

This is also **the first read on whether M-3 worked.** You attached a list and built a first set
of negatives. Go and see what they caught. You should be able to say roughly what they blocked
and what leaked through — a static list never catches every close variant, and the leaks are
this week's negatives.

### 4 · Pull Quality Score properly — all three parts of it

Quality Score is Google's 1–10 estimate of how relevant your keyword is to the people searching
it. **The number itself is nearly useless. The three components underneath it are the whole
point,** and each is reported as Below Average / Average / Above Average:

| Component | What it's actually telling you | Where the fix lives |
|---|---|---|
| **Expected click-through rate** | Does this ad look like the answer to this search? | Ad copy, or the keyword doesn't belong here |
| **Ad relevance** | Does the ad's text match the search's intent? | Ad copy, or ad-group structure that's too loose |
| **Landing page experience** | Does the page deliver what the ad promised? | **The page** — not the keyword, not the bid |

Add all four columns — Quality Score plus the three components — to your keyword view and read
across them. Then say, in one sentence per problem cluster, **which component is the problem.**

⚠️ **Quality Score is only reported once a keyword has enough impressions.** On an account this
small you should expect a lot of blanks, and a dash is not a zero. Don't build an argument on
the keywords that have no data yet.

### 5 · Start the change log — this is the spine of the whole capstone

One file, in `04-my-work/projects/`, that you keep adding to through all four stages:

| Date | What changed | Approved by | What it should move | What it makes un-comparable |
|---|---|---|---|---|

It exists because of the lesson you already learned the hard way in
[M-2](./m-02-fix-the-conversion-values.md): **conversion values aren't retroactive.** That's
one instance of a general rule — almost every change you make moves a measuring stick, and
anything spanning the date it landed is comparing two different rulers.

Backfill the entries you already know: the date you applied the M-2 values, the date the M-3
negatives went on. Then keep it current as you go.

---

## ⚠️ There is no benchmark here, and you must not borrow one

This is a cold-start program. It has no Brady-side history — no prior year, no established cost
per lead, no efficiency target with a track record behind it.

So **don't compare Mecco's cost per lead to PDC's or Seton's.** Different business, different
buyer, different deal size, different sales motion. A number that looks alarming next to PDC may
be perfectly healthy here, and nobody yet knows which. Saying *"we don't have a defensible
benchmark for this account yet"* is the accurate statement, and it's more useful than a
comparison that quietly misleads whoever reads it.

## ⚠️ Quality Score is a diagnosis, not a score to raise

New analysts treat it as a number to improve. It isn't — it's a readout on three other things.
You don't fix Quality Score; you fix whichever of the three it's complaining about.

The distinction has teeth: **a Below Average landing-page-experience rating across a whole
cluster of keywords is a page problem, not a keyword problem.** No bid change, no ad rewrite and
no amount of pausing keywords will touch it. That fix is [T4-3](./t4-03-the-landing-page-test.md),
which is exactly why this stage comes first.

---

## You're done when

- [ ] The conversion is **verified firing** — you watched it, with the date and method written down — or it isn't, and you escalated to Alex the same day
- [ ] Per campaign: spend, what it bought, cost per conversion — **plus how many campaigns exist and how many are actually enabled**
- [ ] You said which source you'd quote for spend when two disagree, and why
- [ ] Search-terms review done, and you can say **what M-3's negatives blocked and what leaked**
- [ ] Quality Score pulled **with all three components**, and you named the failing component per cluster — not just the score
- [ ] You did **not** compare Mecco's efficiency to a bigger account's
- [ ] The **change log exists** in `04-my-work/projects/`, backfilled with the M-2 and M-3 dates
- [ ] Anything you suspected but couldn't confirm is marked **unconfirmed**
- [ ] Standard wrap
