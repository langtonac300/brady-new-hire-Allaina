# T4-3 · The landing page test

| | |
|---|---|
| **Time box** | A day to design, then it runs for weeks — check in, don't camp on it |
| **Account** | Mecco — the transition landing page |
| **Safety** | **Goes live** — a real split on the live page, launched and rolled out only with Alex's approval |
| **Paired or solo** | Design solo, approved with Alex; the roll-out decision is his |
| **Deliverable** | The design and the power math, then the honest readout — **or the blocked-test write-up** → `04-my-work/projects/` |
| **Builds toward** | [E · Judgment](../05-self-assessment/baseline.md#e--judgment) · [D · Operating rhythm](../05-self-assessment/baseline.md#d--operating-rhythm) |

**Do [T4-1](./t4-01-where-the-money-goes.md) and [T4-2](./t4-02-a-second-way-in.md) first.** T4-1
gives you the traffic numbers this stage's arithmetic depends on, and T4-2 is very likely the
thing that makes this test answerable at all.

**Read first:** [`running-a-real-test.md`](../02-learning/running-a-real-test.md) again, and your
own [T3-5](./t3-05-your-first-experiment.md) write-up. This brief is the *project*; that file is
the *method*, and it isn't repeated here.

---

## The point

T3-5 was your first experiment, deliberately run on a campaign big enough to reach a verdict.

**This one is deliberately the opposite.** Mecco is small, and the honest answer to "can we test
this here?" may well be no. Learning to work that out *before* you spend three weeks on it — and
saying it out loud rather than running something weak and reading the tea leaves — is the harder
skill of the two, and it's the one that transfers to every small account you'll ever be handed.

The subject is the page, because T4-1 will very likely have shown you that the page is where the
Quality Score problem lives, and a page problem can only be fixed on the page.

---

## What to do

### 1 · Work out where the split happens — this is not a Google Ads experiment

Two different mechanisms, and picking the wrong one wastes the stage:

| | What gets split | Use it when |
|---|---|---|
| **A Google Ads experiment** | Traffic inside a campaign. The arms differ in **what the account does** — bids, match types, structure | You're testing an account change |
| **A landing page A/B** | Visitors on the page. Same ads, same bids, same keywords — the arms differ in **what the visitor sees** | You're testing a page change |

You're testing a page change, so it's the second one. That's still a genuine concurrent control
and treatment — the thing `running-a-real-test.md` insists on — it just splits one step further
down the funnel.

⚠️ **Confirm the page tooling can actually do this before you design around it,** and confirm
what's already built. Ask Alex. There may be a challenger version of the page ready to go, in
which case your job is to evaluate whether it's the right test rather than to invent one.

### 2 · Do the power math *before* you fall in love with an idea

The guards from `running-a-real-test.md` don't relax because this is a page test: **at least 14
days, and at least 30 conversions in each arm.**

So do the arithmetic, using the real numbers from T4-1:

1. How many sample requests does this account get in a month?
2. Halve it — that's roughly what each arm gets.
3. How many months to 30 in each arm?

⚠️ **If the answer is "more than a couple of months," the test cannot conclude on that metric.
Say so now.** That is a finding, written up as a finding. It is not a failure, and it is not
something to work around by lowering the bar and hoping.

### 3 · This is where T4-2 pays off

If the sample request is too rare to conclude on, you have an alternative you built yourself: the
second action from T4-2 happens more often, and **a more frequent event is a metric a small
account can actually reach a verdict on.**

So the design becomes:

- **Primary metric** — the higher-frequency action from T4-2
- **Guardrail metric** — sample requests must not fall

⚠️ **Be honest in the readout about what that buys you.** If the treatment wins on the
lower-commitment action, you have proven something about the lower-commitment action — not about
the money conversion. Write it that way. A test that quietly upgrades its own conclusion is worse
than no test, because people act on it.

### 4 · Make the five decisions, get it approved, then leave it alone

Mode, primary metric, conversion filter, guardrail metric, size and duration — from
`running-a-real-test.md`, and deciding them properly **is** the design work.

Hypothesis in the house shape: **"Changing X to Y will move [metric] by about Z%, because
[reason]."**

Once it's live: don't change the page mid-test, don't change the metric, don't stop it early
because it's winning.

### 5 · Read it out honestly, whatever it says

A clean loss is a real result and gets written up the same as a win. So does "underpowered, and I
should have seen that at design" — though if you did step 2 properly, you did see it.

---

## ⚠️ This test may not be launchable, and that has its own deliverable

The page has dependencies you don't control. It has to actually deploy, and there is image
hosting that has to move off the old domain before more traffic is pointed at it — driving more
visitors onto a page that's about to break is worse than doing nothing.

**Check that gate with Alex at the start of this stage, not at the end.**

If it's not clear, the stage still has a deliverable and it is not a lesser one:

- the design, complete, with the five decisions made
- the power math, showing what could and couldn't have been concluded
- one page on **what blocked it and what it would take to unblock** — named, costed, routed

**Do not run a weaker version so that you've run something.** A before-and-after on a page change,
on a cold-start account, during a brand transition, is not evidence — every single confounder in
`running-a-real-test.md` applies to it at once. Proposing a test you then correctly decline to run
is a strong outcome for this stage.

## ⚠️ Know whether you're testing one thing or a bundle

If the challenger changes the form position *and* the headline *and* the button copy, that's a
redesign test. It's a legitimate design — you'll learn whether the bundle wins — but you will not
learn which part did the work, and you can't attribute the result to any single change afterwards.

Decide which you're running, on purpose, and say which in the design. The trap is running a bundle
and reporting it as though you'd learned something about one element.

---

## You're done when

- [ ] You named the **split mechanism** and why it's page-level, not campaign-level
- [ ] The **power math was done before the design**, on real numbers from T4-1
- [ ] If the sample request can't conclude, **you said so** — and either picked a metric that can, or called the test unrunnable
- [ ] If you switched the primary metric to the T4-2 action, the readout says **what that does and doesn't prove**
- [ ] The **five decisions made before launch**; hypothesis in the house shape with a *because*
- [ ] Either: **launched with Alex's approval**, page untouched while it ran, readout written whether it won or lost, with which model the numbers are in — **or** the blocked-test write-up: design, power math, what it would take
- [ ] You said whether it was a **single-change test or a bundle**, on purpose
- [ ] Launch date and roll-out date (if any) in the **change log**
- [ ] Standard wrap
