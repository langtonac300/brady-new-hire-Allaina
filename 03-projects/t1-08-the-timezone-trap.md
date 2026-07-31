# T1-8 · The timezone trap

| | |
|---|---|
| **Time box** | 1 hour |
| **Account** | PDC + Seton US + EMEDCO |
| **Safety** | Read-only |
| **Paired or solo** | Solo, with a 10-minute readout |
| **Deliverable** | Three numbers and the explanation → `04-my-work/projects/` |
| **Builds toward** | [B · How Brady measures things](../05-self-assessment/baseline.md#b--how-brady-measures-things) |

---

## The point

Your accounts sit in **three different timezones**:

| Account | Timezone |
|---------|----------|
| PDC Healthcare + PDC Wristbands | Los Angeles |
| Seton US | Eastern |
| EMEDCO | Central |

Which means **"yesterday" means three different things**, and a day-over-day comparison
across them is comparing three windows that start and end at different moments. An account's
timezone is set when it's created and can't be changed afterwards, so this isn't a
misconfiguration anyone is going to fix — it's a permanent property of your job.

Nobody ever gets caught by this on purpose. They get caught by it in a meeting.

---

## What to do

1. **Pick one calendar day.** Any recent, unremarkable weekday.
2. **Pull that day's spend from all three accounts.**
3. **Write the three numbers down.**
4. **Before you look anything up:** explain why these three "days" aren't the same window,
   and what that does to a comparison between them.
5. **Then write your rule** — what you will actually do about this when you're reporting
   across accounts. A rule you'd follow, not a rule that sounds good.

---

## ⚠️ Where this actually bites

Not usually in a monthly number — over a month the edges wash out. It bites on:

- **Anything "yesterday" or "today so far."** The daily spend check, the morning look for
  anything odd.
- **The last day of a month**, where one account has closed its books and another hasn't.
- **Anything where you're explaining a spike.** A spike that appears on a Tuesday in one
  account and a Monday in another is often the same spike.
- **Scheduling.** A change scheduled for "midnight" happens at three different moments.

---

## What good looks like

- You can say, without checking, which of your three accounts rolls over first and which
  last.
- Your explanation in step 4 was written **before** you looked it up, and you noted where it
  was wrong.
- Your rule in step 5 is concrete. "Be careful about timezones" isn't a rule. "When I
  compare across accounts I use whole weeks, or I state the timezone next to the number" is.
