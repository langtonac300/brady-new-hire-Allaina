# T1-12 · Don't clean that up

| | |
|---|---|
| **Time box** | 1 hour |
| **Account** | EMEDCO (with a look at Seton US) |
| **Safety** | Read-only — **strictly** |
| **Paired or solo** | Solo, with a 10-minute readout |
| **Deliverable** | Half a page: what reads these parameters, and what breaks if they go → `04-my-work/projects/` |
| **Builds toward** | [B · How Brady measures things](../05-self-assessment/baseline.md#b--how-brady-measures-things) |

---

## The point

**"Tidy up the confusing old thing" is the single most common way a new analyst causes a
tracking-loss incident.** It comes from a good instinct — you're new, you're paying
attention, you can see something nobody else has looked at in two years, and it looks like
junk.

Sometimes it is junk. Often it's load-bearing, and the thing it bears doesn't fail loudly.
Clicks keep working. Ads keep serving. Something downstream quietly stops matching, and
nobody notices for a month.

Better to meet that instinct in week three on a reading exercise than in month five on a
live account. **That's the entire reason this project exists.**

---

## What to do

1. **Look at EMEDCO's account-level tracking template.** You'll find it routes clicks
   through a third-party search-management platform that isn't part of the team's
   day-to-day workflow. It has the look of something left over from an earlier era, because
   it is.
2. **Then look at URLs across both EMEDCO and Seton US.** You'll find `{_ds...}` parameters
   scattered through them.
3. **Trace what consumes them.** Follow the chain: what is on the other end of that
   redirect, what reads the parameter, what would go looking for it. Ask Alex once you've
   got as far as you can on your own.
4. **Write the half page.** What reads these parameters, and what specifically breaks if
   someone deletes them as legacy junk?

---

## What to look for

| Look for | Why it matters |
|---|---|
| An **account-level tracking template** routing clicks through a third-party platform | Looks like legacy junk; often load-bearing, and it fails silently |
| **`{_ds...}` parameters** scattered across URLs on EMEDCO and Seton US | Trace what reads them before assuming they're safe to remove |
| What sits on the **other end of the redirect** — what actually consumes the parameter | If nobody on the team can tell you, that *is* the finding — not a gap to guess past |
| Anything that just "**looks like leftover junk**" | The urge to tidy it is exactly the failure mode — better to meet it here on a reading exercise |

---

## ⚠️ Read-only, and this one is not a formality

**Do not remove or edit a tracking template on any account, ever, without Alex.** A wrong
tracking template can stop ads serving outright, or — worse, because it's silent — let them
serve while breaking the tracking behind them.

---

## ⚠️ If you can't establish what reads them, that's the finding

Say so plainly, and route it to Alex. **"Nobody currently on the team can tell me what
consumes this, and it's on every URL in two accounts"** is a genuinely valuable thing to
have written down — and it's a much better answer than a plausible guess.

Do not reason your way to an answer that sounds right. That's the exact failure mode this
project is about, one level up.

---

## You're done when

- [ ] You named **what consumes** the parameters, or said clearly you couldn't and where you stopped
- [ ] The failure mode described **specifically**: what keeps working, what breaks, how long anyone would take to notice
- [ ] A **rule for next time** you'd actually apply to leftover-looking junk — that rule is the real deliverable
- [ ] You did **not** edit or remove any tracking template
- [ ] Standard wrap — prediction first, written up the same day
