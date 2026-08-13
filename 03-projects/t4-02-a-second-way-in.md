# T4-2 · A second way in

| | |
|---|---|
| **Time box** | Two to three days |
| **Account** | Mecco |
| **Safety** | **Proposal and spec** — you design the conversion action and write the build spec; someone with tag-manager access builds and verifies it |
| **Paired or solo** | Solo design, reviewed with Alex; the build is handed to Tyler |
| **Deliverable** | The conversion architecture: what the new action is, what it's worth, primary or secondary, and the spec to build it → `04-my-work/projects/` |
| **Builds toward** | [B · How Brady measures things](../05-self-assessment/baseline.md#b--how-brady-measures-things) · [E · Judgment](../05-self-assessment/baseline.md#e--judgment) |

**Do [T4-1](./t4-01-where-the-money-goes.md) first** — including the tracking verification. Adding
a second conversion action to an account whose first one might not fire is building on sand.

**Read first:** your [T1-4](./t1-04-conversion-action-inventory.md) inventory and your
[M-2](./m-02-fix-the-conversion-values.md) value model. This project is those two, joined up and
pointed at something that doesn't exist yet.

---

## The point

The landing page asks for exactly one thing, and it's the highest-commitment thing on it: **mail
us a physical part.**

That's an excellent offer for someone who has already decided you're a serious candidate. It's a
terrible offer for someone two weeks earlier in the process, still working out whether it's worth
a conversation at all. Right now that second person has nowhere to go — so they leave, and you
never find out they were there.

You are not designing a form. You're answering three questions in order, and the third is the one
that separates an analyst from someone filling in a platform screen:

1. **What second action is worth counting?**
2. **What is it worth?**
3. **Should it influence bidding?**

---

## What to do

### 1 · Inventory what a visitor can already do

Before proposing something new, find out what's there. Open the page as a visitor and list every
action available — not just the ones with a form attached. Then cross-reference: **which of those
are actually counted as conversions today, and which just happen unobserved?**

You may find there's already a second way in that nobody is measuring. That's a cheaper finding
than building something, and it counts as the answer if it's the right one.

### 2 · Propose the new action

Whatever you propose has to clear four constraints. **Which action it is, is your recommendation
to make** — you know this account and its buyers better than anyone except Alex now, and picking
it is part of the project:

| Constraint | Why |
|---|---|
| **Lower commitment than mailing a part** | That's the gap. If it's just as much work, it's not a second way in |
| **Something a real buyer would actually do** | Ask Alex who these buyers are and what they need before they'll talk. Don't design for a persona you invented |
| **A discrete, countable event** | "Scrolled 60% of the page" is not a lead. Something happened, or it didn't |
| **Distinguishable in reporting** | If you can't separate it from the sample request afterwards, you've made your primary number worse, not better |

Write it as one paragraph a non-marketer could follow: what the visitor does, what they get, and
what happens to them next. **If you can't say what happens next — who picks the lead up and what
they do with it — go and find out before you propose it.** A lead nobody works isn't a lead.

### 3 · Value it, using the house convention

Same discipline as M-2: **don't invent a number.** Go and look at how the estate values its lead
types, and follow the shape of that convention. A lower-commitment action is worth less than the
sample request — the question is how much less, and you should be able to defend the ratio in one
sentence.

⚠️ **Ask what this new lead type is worth to the business, not what it's worth to you.** A lead
that converts to a real opportunity a tenth as often as a sample request is worth roughly a tenth
as much, whatever it does for your conversion count.

### 4 · Decide primary or secondary — and be able to defend it

This is the decision the project is actually about.

| | What it means | What it does |
|---|---|---|
| **Primary** | Bidding optimizes toward it | The account will start chasing this action, because it's cheaper and more frequent than the sample request |
| **Secondary** | Visible in reporting, ignored by bidding | You can see it, count it, and test on it — without it steering anything |

Mecco isn't on smart bidding yet, and won't be until it has the conversion volume to support it.
**That's exactly why this decision matters now rather than later:** what you count today is the
data that trains the bidding strategy the day it turns on. A conversion definition that quietly
counts the easy action teaches the algorithm to buy the easy action — cost per lead looks
excellent and sales gets nothing worth having.

Say which you're recommending and why. Then say what would have to be true for you to change your
mind later.

### 5 · Write the build spec and hand it over

You don't build this. Write it so someone with tag-manager access can:

- **What fires it** — the exact user action, and the state on the page that proves it happened
- **What it's called** — follow the account's existing naming so it can't be confused with the
  shared corporate-level action that several Brady properties share
- **Its value**, and where the number came from
- **Primary or secondary**, and count setting
- **Who builds it, who verifies it, and how they'll verify** — the same way you verified the
  first one in T4-1

---

## ⚠️ A second action changes the Conversions column

The moment this goes live, "Conversions" on this account means something different than it did
the day before. Every trend line that crosses that date is comparing two definitions.

That's not a reason to avoid it. It's a reason to **log the date in your change log** and to say
so on anything you report from this account for the next few months. Exactly the same lesson as
the M-2 value change — this is its second instance, and noticing that it's the same lesson is
the point.

## ⚠️ Don't solve this by loosening the action you already have

The tempting shortcut is to count more of the existing form — a step-2 completion, a form open,
an interaction. Resist it. That doesn't create a second way in for the visitor; it just inflates
the number for the one that already exists, and it makes the primary conversion mean less.

A second action is a second *thing a person did*. Not a lower bar for the same thing.

---

## You're done when

- [ ] An inventory of **what a visitor can do today** and which of those are counted
- [ ] **One proposed action**, meeting all four constraints, described in a paragraph a non-marketer could follow
- [ ] You can say **what happens to the lead** — who picks it up and what they do with it
- [ ] Valued by the **house convention**, not invented, with the ratio to the sample request defensible in one sentence
- [ ] **Primary vs secondary decided and argued**, including what it does to bidding when smart bidding eventually turns on
- [ ] A build spec someone else can execute: trigger, name, value, count setting, owner, **and how it gets verified**
- [ ] The effect on the **Conversions column** named, and the date logged in the change log
- [ ] Standard wrap
