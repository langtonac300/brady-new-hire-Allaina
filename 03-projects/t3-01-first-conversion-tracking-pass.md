# T3-1 · The first conversion-tracking pass

| | |
|---|---|
| **Time box** | One to two days |
| **Account** | PDC Healthcare |
| **Safety** | Read-only — you're diagnosing, not fixing |
| **Paired or solo** | Solo, with a readout — the fix itself goes to Alex |
| **Deliverable** | A documented diagnosis: what looks wrong, the evidence, and the exact checks someone with container access should run → `04-my-work/projects/` |
| **Builds toward** | [B · How Brady measures things](../05-self-assessment/baseline.md#b--how-brady-measures-things) · [C · The accounts](../05-self-assessment/baseline.md#c--the-accounts) |

**Read first:** your own [T2-8](./t2-08-trace-one-click.md) trace and
[T1-4](./t1-04-conversion-action-inventory.md) inventory write-ups, and the *Which numbers
can't be trusted* section of [`how-brady-measures.md`](../02-learning/how-brady-measures.md).

---

## The point

`how-brady-measures.md` told you two things that meet in this project. An audit found real,
confirmed defects on Brady's core accounts — and **PDC and the Wristbands container hadn't
been through that same audit yet.** This is you doing the first pass on one that hasn't.

You will **not** have access to the tag-management container itself, and you're not expected
to. That's the senior half of this work — the same split `after-the-ramp.md` describes: *you
diagnose and document, someone with the access executes the fix.* The skill being trained is
producing a diagnosis good enough that the person who does have that access knows exactly
where to look and doesn't have to start cold.

Everything you need is visible from **inside the Google Ads account** and from the trace you
already walked in T2-8.

---

## What to do

### 1 · Inventory the conversion actions, properly this time

You did the account-level version in T1-4. Now go deeper on each action that's counting:

| For each action, capture | Why it matters |
|---|---|
| **Primary or secondary** | A secondary action shouldn't be steering bidding. More than one *primary* purchase-style action is a double-count signature |
| **Count: every / one** | "Every" on a lead form counts three enquiries from one person as three. Right for sales, usually wrong for leads |
| **Value: real, estimated, or a placeholder** | You met the $1-placeholder problem on Mecco. Look for its cousins here — round numbers, identical values across different actions |
| **Attribution model + window** | Platform actions use a different model from the team's reported number. That's expected — note it so you don't flag it as a defect |
| **Where it fires** | Tie each action back to the trace: which step in the T2-8 chain triggers it |

### 2 · Look for the specific shapes a defect makes

You know the failure modes now — T2-8's break-point table is the checklist. Translate each
into "what would I see in the numbers here?":

- A count that **moves with something it shouldn't** — did conversions step-change on a date
  with no campaign change behind it?
- The **same conversion arriving twice** — two actions that always move together, or a total
  that's suspiciously close to double a source number.
- **Internal or non-customer traffic** counting as conversions — the defect that was live on
  the core accounts is exactly this shape.
- A **primary action that shouldn't be primary**, quietly steering smart bidding.

### 3 · Separate "looks wrong" from "is by design"

This is the judgment step, and it's the whole difference between a useful diagnosis and a
noisy one. Platform Conversions not matching the reported number is **not** a defect — it's
the first-touch-vs-platform gap you already understand. A phone-call value being an estimate
is **not** a defect. Put those in a "checked, working as intended" list so nobody re-chases
them.

### 4 · Write the diagnosis as a hand-off

For each thing that looks wrong: **the symptom, the evidence you can see, your best guess at
the cause, and the exact check** someone with container access should run to confirm or kill
it. Rank by cost — a mis-set primary action steering spend outranks a cosmetic double-count
on a secondary.

---

## ⚠️ You can't see the tags — so don't write as if you can

The honest form of every finding is *"conversions for X look inflated by roughly this much on
these dates; I'd have someone check whether tag Y is firing twice."* The dishonest form is
*"tag Y is firing twice."* You don't know that — you inferred a cause from a symptom, which is
exactly the right thing to do, as long as you say that's what you did.

An unconfirmed diagnosis, clearly labelled, is worth a lot. A confident wrong cause sends the
person with access hunting in the wrong place and costs more than saying nothing.

## ⚠️ Read-only means read-only on conversion actions too

Do not change an action's primary/secondary flag, its count setting, or its value to "test a
theory." Those steer live bidding the moment you touch them. If you want to see what a change
would do, that's a sentence in your write-up for Alex, not a click.

---

## You're done when

- [ ] Every counting conversion action inventoried with all five columns (primary/secondary, count, value, model+window, where it fires)
- [ ] Each finding names **symptom → evidence → suspected cause → the exact check** — cause/check kept separate from symptom/evidence
- [ ] A **"working as intended" list** as well as a defect list (FT-vs-platform gap, call-value estimates ruled out)
- [ ] Findings **ranked by cost** — money or trust in a number — not by how obvious they were to spot
- [ ] Everything phrased as an **unconfirmed diagnosis** (you can't see the tags) — no "tag Y is firing twice" stated as fact
- [ ] Nothing changed on any conversion action; the fix is written up for Alex
- [ ] Standard wrap — prediction first, written up the same day
