# T3-5 · Your first experiment

| | |
|---|---|
| **Time box** | A day to design and launch, then it runs for weeks — check in, don't camp on it |
| **Account** | A campaign with enough traffic to conclude — agree the target with Alex |
| **Safety** | **Goes live** — a real Google Ads experiment, launched and rolled out only with Alex's approval, run inside the Experiment Hub's guards |
| **Paired or solo** | Design solo, approved with Alex; the roll-out decision is his |
| **Deliverable** | The design (hypothesis, mode, metrics), then the honest readout when it finishes → `04-my-work/projects/` |
| **Builds toward** | [E · Judgment](../05-self-assessment/baseline.md#e--judgment) · [D · Operating rhythm](../05-self-assessment/baseline.md#d--operating-rhythm) |

**Read first:** [`running-a-real-test.md`](../02-learning/running-a-real-test.md), start to
finish. This brief is the *project*; that file is the *method*, and it isn't repeated here.

---

## The point

Everything on the ladder so far has been analysis, recommendation, or a reversible change.
This is the first time you propose a change and let the accounts tell you whether you were
right — the difference between *"I think this will work"* and *"here's what happened when we
tried it, against a control."*

It's also the ramp version of the second strategic shift in
[`after-the-ramp.md`](./after-the-ramp.md): measuring what actually happened because of us,
not what a before-and-after story lets us believe. Owning a whole testing roadmap is a
year-one thing. **Running one clean test, correctly, is this project** — and one clean test
teaches more than ten sloppy ones.

---

## What to do

### 1 · Check the Learnings archive *before* you fall in love with an idea

The single most avoidable waste here is re-running a test the team already paid for. Read the
archive first. It also shows you the house shape for a hypothesis and a readout.

### 2 · Pick a question that can actually be answered

Two constraints decide this, and both bite before launch:

- **It has to be splittable.** Default to a SPLIT experiment — a true control and treatment,
  same campaign, same time. If your idea only fits PRE_POST, ask whether it can be reframed
  into something splittable before you settle for weak evidence.
- **The campaign has to have the traffic.** The power calculator tells you how long you'd
  need. ⚠️ **If it says 180 days, the test is underpowered — don't run it.** This is why the
  target isn't automatically your smallest account: Mecco is a good place to *learn* that some
  questions can never be answered there, but a first *real* test wants enough traffic to reach
  a verdict inside a few weeks.

### 3 · Make the five decisions — that's the design work

Mode, primary metric, conversion filter, guardrail metric, size/duration. They're in
`running-a-real-test.md` and deciding them properly **is** the project. Two that catch
beginners:

- **The conversion filter.** On the accounts where the default Conversions column overcounts,
  a test judged on revenue or ROAS has to filter to the specific action — or both arms measure
  the wrong thing.
- **The guardrail metric.** Name the number that must *not* get worse while your primary
  improves, before you launch. A winner that wrecked something else isn't a winner.

Write the hypothesis in the house shape: **"Changing X to Y will move [metric] by about Z%,
because [reason]."** The *because* is the part that makes a win mean something.

### 4 · Get it approved, launch it, then leave it alone

Alex approves the launch. Once it's live, the rules that void a test apply — **don't edit the
base campaign, don't change the metric, don't stop it early because it's winning.** Note it in
your week so you check in without hovering; verdicts land at the Thursday Deep Dive.

### 5 · Read it out honestly — whatever it says

When the guards clear (14 days, 30 conversions per arm, fairness green), write the learning.
**A clean loss is a real result and gets written up the same as a win.** "Underpowered, and I
should have seen that at design" is a result too — a more valuable one than pretending the
tea leaves said something. The roll-out, if there is one, is Alex's call.

---

## ⚠️ "Looks like it's winning" is not a verdict

Neither is "looking good but not fully proven" — that phrase means *keep running and do not
ship*, and it's the one people argue with. Early leads are mostly noise; the guards exist
precisely because a promising first week so often reverses. Let the hub hold the line so you
don't have to.

## ⚠️ Remember which model the readout is in

A test readout uses **platform** conversions. The team reports first-touch over a much longer
window. A genuinely important result deserves the long-window read too — ask Alex; the tooling
generates it. Don't present a platform-conversion test win as a first-touch revenue number.

---

## What good looks like

- You can say **which arm is the control and why it's genuinely comparable** — same time, same
  everything except your one change.
- You chose the primary metric and the guardrail **before** launch and didn't move them after
  you peeked.
- You can name what would make the result **invalid**, and you checked those things.
- When it finished you wrote the learning **whether it won or lost**, with the numbers and the
  model they're in.
- If it turned out underpowered, you said so early — not after three weeks of watching a number
  that could never reach significance.
