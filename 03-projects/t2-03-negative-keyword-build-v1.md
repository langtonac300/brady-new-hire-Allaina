# T2-3 · Negative-keyword build v1

| | |
|---|---|
| **Time box** | Half a day |
| **Account** | PDC Wristbands |
| **Safety** | **Reversible, and reviewed before it ships** — this is your first live change on a PDC account |
| **Paired or solo** | Solo build, reviewed by Alex, then applied by you |
| **Deliverable** | The list, the list architecture, and a before/after wasted-spend estimate → `04-my-work/projects/` |
| **Builds toward** | [D · Operating rhythm](../05-self-assessment/baseline.md#d--operating-rhythm) · [E · Judgment](../05-self-assessment/baseline.md#e--judgment) |

**Read first:** your T2-1 and T2-2 write-ups, and
[M-3](./m-03-attach-and-build-the-negatives.md) if you've already done it on Mecco — the
mechanics are the same, the stakes here are higher. Also
[T1-7](./t1-07-brand-vs-nonbrand.md) on how brand exclusions work.

**Run [`before-it-ships.md`](../02-learning/before-it-ships.md) before you post this for
review** — the negatives section, and the warning about sculpting lists in particular.

---

## The point

T2-1 and T2-2 were calls on paper. This one ships.

PDC's negative-keyword coverage is thin. You're going to propose how it *should* be
organized, build a first list, have it reviewed, and then apply it yourself.

**The architecture matters more than the list.** Anyone can collect fifty bad search terms.
The thing that's actually hard — and the thing that will still be paying off in two years —
is deciding what lives where, so the next person can add to it without guessing.

---

## What to do

### 1 · Design the structure first, on paper

Before you add a single term, answer: **what lists should exist, and what belongs in each?**

A negative keyword can live in three places, and the choice is the design:

| Where | Scope | Good for |
|---|---|---|
| **Shared list** | Attached to many campaigns at once | Things that are *never* right anywhere in the account |
| **Campaign level** | One campaign | Things wrong for this campaign but fine elsewhere |
| **Ad group level** | One ad group | Steering traffic between ad groups, not blocking it |

Sketch the shared lists you think should exist and name them. A structure someone else can
read at a glance beats a clever one.

### 2 · Build list v1

Populate your structure from what T2-1, T2-2 and the search terms report give you. Choose
match types deliberately — a broad negative blocks far more than people expect, and that's
how legitimate traffic quietly disappears.

### 3 · Estimate the impact

For the terms you're blocking, total what they cost over a recent window. That's your
**before** figure and your rough estimate of recoverable spend.

Say plainly what it does and doesn't mean: it's what those terms *did* cost, not what you'll
save. Budget doesn't vanish when a term is blocked — it moves, and whether it moves somewhere
better is the open question.

### 4 · Check your negatives against the account's own keywords

**Before you post anything.** Take your proposed negative list and check it against the
keywords the account is actively bidding on. **If one of your negatives would block one of
your own keywords, you'll see it here** — and that's the single most common way a new
analyst quietly kills traffic they wanted.

It takes a few minutes and it catches the mistake that is otherwise invisible until someone
asks why a product line stopped selling.

### 5 · Post it for review, then apply it

Post the structure, the list and the estimate to the proposed-change thread. Once Alex has
reviewed it, **you make the change** — and you write down the date and time you made it.

---

## ⚠️ The one that will bite you: over-broad negatives

A negative added as broad match blocks every search containing those words in any order.
Adding `free` as a broad negative blocks `free shipping wristbands` too.

This is the most common way a new analyst causes real damage with negatives, and it is
close to invisible afterward — traffic simply stops arriving, and nothing in the interface
announces why. **Default to phrase or exact for anything ambiguous.** Reserve broad
negatives for words that could not possibly appear in a good search.

## ⚠️ Go back and look at it the next day

This brief warns you that over-blocking is close to invisible — traffic stops arriving and
nothing announces why. **So don't rely on noticing. Go and check.**

The day after you apply it:

| Check | What you're looking for |
|---|---|
| The list is attached to what you think it is | Open the campaigns, not the list. Attachment is the step that silently doesn't happen |
| Impressions and clicks on the affected campaigns | A dip roughly the size you predicted is the change working. A dip much bigger than you predicted is a broad negative catching more than you meant |
| The search terms report | Are the terms you blocked actually gone — and is anything *good* gone with them? |

If something looks wrong, **say so before you investigate.** Flagging early costs nothing;
a week of quietly missing traffic costs real money and is much harder to explain.

## ⚠️ If you've never built a shared list before, ask first

This brief is about the judgment — what belongs where, and which match type. It deliberately
doesn't cover the clicks: creating a shared list, attaching it to the right campaigns, and
choosing the level.

**Those mechanics are where first-time accidents actually happen**, so have Alex walk you
through them once before you apply anything. Five minutes, and it isn't a gap in your
knowledge — it's the part nobody can learn from a document.

## ⚠️ Write down what you changed, when

You're about to be the reason a number moves. In two weeks someone will ask why Wristbands
traffic dropped, and "I applied a negatives list on the 14th" needs to be findable — by you,
in your own notes, not reconstructed from change history.

This is also your own protection. A documented change you can explain is a normal part of
the job. An undocumented one that coincides with a drop is a bad afternoon.

---

## You're done when

- [ ] A **named list structure** on paper — someone else can tell where a new negative goes just by reading it
- [ ] List v1 built, **match types chosen deliberately** (phrase/exact for anything ambiguous)
- [ ] Every **broad** negative justified — if you can't, it's phrase
- [ ] Checked against the account's **own keywords** — no negative blocks a keyword you bid on
- [ ] Impact estimate **caveated honestly**: what it measures (cost of blocked terms), what it assumes, what would make it wrong
- [ ] Reviewed by Alex, applied by you, with the **date and time written down**
- [ ] **Next-day check** done: attachment verified on the campaigns, impressions vs your prediction, nothing good vanished
- [ ] Standard wrap

> **Good vs over-broad, one example:** blocking `free template` (phrase) kills DIY-download
> searches. Blocking `free` (broad) *also* kills `free shipping wristbands` — a buyer. When in
> doubt, narrower.
