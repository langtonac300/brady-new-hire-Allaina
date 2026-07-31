# Running a real test

Control, treatment, and the difference between a test and a story you told yourself.

> **Read this before you propose your first experiment** — that's a Phase-2 expectation,
> around days 31–60. It's also worth reading earlier, because it changes how you read
> *anyone's* claim that something worked.

---

## The idea, in one line

**A test needs two groups that are the same in every way except the one thing you changed,
running at the same time.**

That's it. Everything below is either a way of achieving that, or a way it quietly fails.

- **Control** — the version that already exists. It keeps running, untouched.
- **Treatment** — the version with your change in it.

If the two aren't running at the same time, or aren't comparable, or you changed two things,
you don't have a test. You have a before-and-after and a hope.

---

## Why before-and-after is not a test

This is the mistake, and it's the mistake because it *feels* like evidence. You change
something, the number goes up, you conclude the change worked.

Everything below also moves that number, and all of it happens while your change is live:

| Also changing | Why it lands on your test |
|---|---|
| **Seasonality** | Demand isn't flat. Neither are competitors' budgets |
| **A promotion** | Ours or a competitor's. The estate runs promos on real calendars |
| **A site release** | Somebody shipped something to the landing page |
| **A tracking fix** | The numbers change without the reality changing — you've seen this in `how-brady-measures.md` |
| **Smart bidding reacting** | ⚠️ **The big one here.** Change something on a smart-bidding account and the algorithm starts adapting to it. Some of what you measure afterwards is the algorithm re-learning, not your change working |

Before-and-after can't separate any of that from your change. A **control running at the same
time** can, because every one of those things hits both arms equally.

> **The clearest possible illustration, and it's real here:** Brady US and Canada carry a
> known data-quality problem — a tracking defect that skews the absolute numbers. **Both
> arms of a test share that defect equally.** So the comparison between them still works,
> even though neither arm's raw number can be trusted on its own.
>
> That is the entire argument for control-and-treatment in one example. A control doesn't
> make your data clean. It makes your data *cancel*.

---

## The three modes the team uses

Tests are run through the team's **Experiment Hub** — ask Alex for the link and a walkthrough.
It offers three modes, and they are **not** equally trustworthy:

| Mode | What it actually is | Evidence strength |
|---|---|---|
| **SPLIT** *(the default — use it)* | A native Google Ads experiment. Traffic to the same campaign is genuinely split, roughly 50/50, and the two arms run simultaneously | **Strong.** This is a true control and treatment |
| **PAIRED** | Two matched sets of campaigns, one changed and one not | **Medium.** Nothing randomizes the split — **the quality of your pairing is the quality of your evidence.** Alex approves these |
| **PRE_POST** | Before-and-after on the same campaigns | **Weak.** Everything in the table above lands inside your result. Used when a split is impossible — budget changes, mainly. Alex approves these |

**Default to SPLIT.** If you're reaching for PRE_POST, first ask whether the thing you want
to test could be reframed as something splittable.

⚠️ **Two of Google's rules constrain you:** one experiment per campaign at a time, and a
campaign in a test can't be on a shared budget. Both are validation errors before launch, not
surprises afterwards.

---

## Five decisions before you launch

The wizard asks for these. Deciding them properly *is* the design work.

**1 · The mode.** Above.

**2 · The primary metric.** The one number the test is judged on — CVR, CPA, ROAS, CTR.
**Pick it before launch.** Changing the metric after you've looked at results is how people
fool themselves without ever intending to.

**3 · The conversion filter.** ⚠️ On Brady US the default "Conversions" column overcounts —
it triple-counts purchases and folds in things that aren't purchases at all. **Any test judged
on revenue or ROAS has to filter to the specific conversion action**, or the readout is
measuring the wrong thing in both arms.

**4 · A guardrail metric.** The number that must *not* get worse while your primary number
improves. Testing for conversion rate? Guard cost per click. Testing a bidding change? Guard
conversion volume. **A "winner" that wrecked something else isn't a winner.**

**5 · Size and duration.** Enter how big a change you expect and the power calculator tells
you how long you'd need, from the campaign's real traffic.

> ⚠️ **If it says 180 days, the test is underpowered — don't run it.** Pick a bigger change,
> more campaigns, or a higher-traffic target. **On a small account, some tests can never
> reach a conclusion at all**, and saying that out loud is a real finding rather than a
> failure. Mecco is a good place to learn this: it teaches you to check whether a question is
> answerable *before* you spend three weeks on it.

---

## The rules that void a test

| Rule | What happens if you break it |
|---|---|
| **Never edit the base campaign mid-test** — not bids, budgets, targeting, ads or negatives | The split breaks, the fairness check fails, and the result is void. Need to touch it? **Stop the test first, deliberately** |
| **Don't change the primary metric after peeking** | You'll find something that looks significant. It won't be |
| **Don't stop early because it's winning** | Early leads are mostly noise. The guards exist because of this |
| **Log anything that moves performance account-wide** | Promos, price moves, site releases, tracking fixes. They get flagged on overlapping tests so nobody reads a promo spike as a test win |

---

## When you're allowed to call it

Three guards, and the hub enforces them so you don't have to hold the line yourself:

1. **At least 14 days running**
2. **At least 30 conversions in each arm**
3. **The fairness check green** — the 50/50 split really is 50/50

**"It looks like it's winning" is not a verdict.** Neither is *"looking good but not fully
proven"* — that phrase means keep running and **do not ship**, and it's the one people try to
argue with.

| The readout says | You may |
|---|---|
| Too early | Wait. That's all |
| Looking good, not proven | Keep running. **Don't ship** |
| Clear winner | Propose the roll-out. Alex approves all roll-outs |
| Clear loser | Stop it, and **log the learning — a clean "no" is a real result** |
| Fairness failed | The readout is void. Investigate, usually rerun |

⚠️ **Results run a day behind on purpose**, and conversions get restated for days afterwards,
so the freshest day or two is never final.

⚠️ **And remember which model you're reading.** A test readout uses platform conversions. The
team reports first-touch over a much longer window, so **a genuinely important result deserves
the long-window revenue read too** — ask Alex, the tooling generates what's needed for it.

---

## Before you propose anything

**Check the Learnings archive first.** Every decided test is logged there with what happened
and why. Re-running a test the team already paid for is the most avoidable waste available to
you, and it's an easy mistake in your first months because you weren't here for the first one.

Then add your idea to the **Ideas** backlog — a title, the hypothesis, which campaigns, and
your scores for impact, confidence and ease. The hypothesis has a shape worth copying:

> **"Changing X to Y will move [metric] by about Z%, because [reason]."**

The *because* is doing real work. A hypothesis without a mechanism is a guess, and when it
wins you won't know what you learned.

---

## What good looks like, for your first one

- You can say which arm is the control and why it's genuinely comparable.
- You chose the primary metric and the guardrail **before** launch, and you didn't change them.
- You can explain what would make the result invalid — and you checked those things.
- When it finishes you write the learning **whether it won or lost**, with the numbers.
- If it turned out to be underpowered, you said so early rather than running it anyway and
  reading the tea leaves at the end.

---

## Related

- [`how-brady-measures.md`](./how-brady-measures.md) — which numbers can and can't be trusted,
  and why the relative-vs-absolute distinction above matters so much here
- [`the-l10-huddle.md`](./the-l10-huddle.md) — test-shaped issues get routed to the Ideas
  backlog from the huddle, and the running-test count is a scorecard line
- [`../01-start-here/your-week.md`](../01-start-here/your-week.md) — live tests get swept and
  verdicts get decided at the Thursday Search Deep Dive
