# T1-4 · Conversion-action inventory

| | |
|---|---|
| **Time box** | 1 hour |
| **Account** | PDC Healthcare |
| **Safety** | Read-only — **you diagnose, you do not fix** |
| **Paired or solo** | **Paired with Alex** |
| **Deliverable** | The inventory + a one-sentence conclusion → `04-my-work/projects/` |
| **Builds toward** | [B · How Brady measures things](../05-self-assessment/baseline.md#b--how-brady-measures-things) · [C · The accounts](../05-self-assessment/baseline.md#c--the-accounts) |

**Read first:** the tracking-landmines section of
[`pdc-primer.md`](../02-learning/pdc-primer.md) — but see the warning below about *when* to
read it.

---

## The point

Smart bidding optimizes toward whatever conversion action is marked **primary**. PDC is
already fully on smart bidding. So this list — which actions exist and which are flagged
primary — is the account's steering wheel, and it's a steering wheel almost nobody checks.

Get comfortable reading this screen now. It comes back at least twice more on your ramp, on
two other accounts, and it's the single highest-value thing you'll learn to check.

---

## What to do

1. **Tools → Conversions** on PDC Healthcare.
2. **List every conversion action.** For each one:

   | Column | Why it matters |
   |--------|----------------|
   | Name | — |
   | Category | Purchase, lead, page view, etc. |
   | **Primary or secondary** | Primary actions are what bidding chases. Secondary ones are reporting-only |
   | Count and value | A high-count, low-value action can dominate bidding |
   | Attribution window | Different actions can be on different windows |
   | "Include in Conversions" | The switch that decides whether it feeds bidding at all |

3. **Then write one sentence:** given which actions are primary, what is smart bidding on
   this account actually optimizing toward?

---

## ⚠️ Do step 3 before you re-read the primer

[`pdc-primer.md`](../02-learning/pdc-primer.md) already tells you what you're going to find
here. **Write your own read of the inventory first, then go back and compare.** That order
is the whole method — reading the answer and then agreeing with it teaches almost nothing.

If your read matches, good. If it doesn't, the gap between the two is the most useful thing
you'll produce this week.

---

## ⚠️ You diagnose. Someone else flips the switch.

If you find something mis-set here, **do not change it.** Re-pointing a live smart-bidding
account at a different conversion action changes what the algorithm chases across the whole
account, and it's gated behind a proper tracking audit that hasn't happened on PDC yet.

Alex or a senior executes any live change here. Your job is the diagnosis and the write-up —
which is genuinely the harder half.

---

## What good looks like

- Your one-sentence conclusion names **the specific action or actions** being optimized to.
  "It's optimizing to the wrong thing" is not a finding; naming which one is.
- You can explain the difference between an action being *secondary* and an action being
  excluded from Conversions entirely — they are not the same, and one of them still feeds
  bidding.
- You asked what happens to bidding in the days after a primary action changes. (The answer
  is worth knowing before you're ever the one proposing it.)
