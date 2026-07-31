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

### 4 · Post it for review, then apply it

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

## ⚠️ Write down what you changed, when

You're about to be the reason a number moves. In two weeks someone will ask why Wristbands
traffic dropped, and "I applied a negatives list on the 14th" needs to be findable — by you,
in your own notes, not reconstructed from change history.

This is also your own protection. A documented change you can explain is a normal part of
the job. An undocumented one that coincides with a drop is a bad afternoon.

---

## What good looks like

- Someone who has never seen your list can tell **where a new negative should go** just by
  reading your structure.
- Every broad-match negative you used, you can justify. If you can't, it should be phrase.
- Your impact estimate is **caveated honestly** — what it measures, what it assumes, and
  what would make it wrong.
- You applied it yourself, and you can say exactly when.
