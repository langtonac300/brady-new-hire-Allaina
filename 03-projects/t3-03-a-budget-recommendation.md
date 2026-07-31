# T3-3 · A budget recommendation

| | |
|---|---|
| **Time box** | One to two days |
| **Account** | PDC (across its campaigns) |
| **Safety** | Read-only — a recommendation with a number; Alex approves any actual move |
| **Paired or solo** | Solo, with a readout |
| **Deliverable** | A one-page recommendation: where the next increment of budget should go, and the guardrail math behind it → `04-my-work/projects/` |
| **Builds toward** | [B · How Brady measures things](../05-self-assessment/baseline.md#b--how-brady-measures-things) · [E · Judgment](../05-self-assessment/baseline.md#e--judgment) |

**Read first:** [`how-brady-measures.md`](../02-learning/how-brady-measures.md) — the
guardrails section — and your own [T1-6](./t1-06-guardrail-drill.md) and
[T2-4](./t2-04-the-pacing-note.md) write-ups.

---

## The point

You've read a guardrail (T1-6) and written a pacing note (T2-4). This puts them together into
the recommendation those two skills exist to produce: **given where spend and efficiency
actually are, where should the next chunk of budget go — or come out of?**

The instinct this trains is the one `how-brady-measures.md` says is the single most important
one to build, and the one beginners get backwards:

> A guardrail is a **ceiling, not a target.** When pacing is behind and efficiency is still
> inside the guardrail, the move is usually to **push spend, not cut it.**

Most new analysts reach for "cut to protect efficiency." That reflex is wrong here, and the
whole value of this project is catching yourself doing it. **Arguing for *more* spend, with
the numbers to back it, is on your Day-90 self-assessment for a reason** — it's the recommendation
managers most wish analysts would bring and most rarely do.

---

## What to do

### 1 · Get the real numbers — none of them come from this repo

You need, per campaign or campaign group: **month-to-date spend, the target, and the
efficiency number against its guardrail.** Every one of these is live:

- Spend and pacing from the MTD dashboard.
- The **current** target and guardrail from Alex or the plan — not any figure in this repo,
  including the examples in the files above. Targets move; a stale one makes the whole
  recommendation wrong. You learned this in T2-4.
- The efficiency number in the **right view** — remember Brady US non-brand is read against
  the IP-attributed view, not plain first-touch. The wrong view makes a fine number look
  alarming.

### 2 · Find the headroom and the pressure

Two questions, per campaign:

| Question | What a "yes" means |
|---|---|
| Is it **inside its guardrail with room to spare**, and **capped or pacing behind**? | Candidate to give money *to* — demand it can't currently serve |
| Is it **over its guardrail**, or spending into terms T3-2 would call waste? | Candidate to take money *from* |

The recommendation lives in the gap between those two lists.

### 3 · Write the recommendation, with the number

One page. Where the increment goes, how much, and the guardrail math that says it's safe —
"this campaign is at X against a ceiling of Y and lost impression share to budget Z% of the
time, so it can absorb the spend without breaching." If you're recommending a cut, the same
in reverse. **One clear move**, defensible to someone who'll push back.

---

## ⚠️ Impression share to budget is the number that makes "push spend" real

"Push spend" only helps if there's demand going unserved. The signal for that is **lost
impression share (budget)** — the share of auctions a campaign missed purely because it ran
out of money. A campaign inside its guardrail *and* losing impression share to budget is the
cleanest "give it more" case there is. A campaign inside its guardrail but already winning
every auction it wants has nowhere to put the money — more budget just sits there.

## ⚠️ Don't recommend a move a test should decide

"Shift $X from campaign A to B" is a recommendation. "This will lift group revenue by Y%" is a
**prediction that a test should settle**, not a promise you can make from a spreadsheet. Where
the money is efficiency-obvious (unserved demand inside guardrail), recommend the move. Where
it depends on how a campaign *responds*, say it should be tested — and you've got the tool for
that in [`running-a-real-test.md`](../02-learning/running-a-real-test.md).

---

## You're done when

- [ ] Per campaign: MTD spend, the **current** target (from Alex/the plan, not this repo), and efficiency in the **right view** (non-brand on IP)
- [ ] A **give-to** list (inside guardrail + capped or losing impression share to budget) and a **take-from** list (over guardrail, or funding waste)
- [ ] **One specific move with a dollar figure** and the guardrail math behind it — not a menu of options
- [ ] If the honest answer is "push spend," you said so and didn't hedge back to cutting
- [ ] Anything that depends on how a campaign *responds* is flagged **to be tested**, not promised
- [ ] You can answer *"what if efficiency slips?"* with the **guardrail room**, not a hope
- [ ] Standard wrap
