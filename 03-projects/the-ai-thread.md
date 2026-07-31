# The AI thread — using AI as a tool, not a question box

This one isn't a tier. It runs quietly alongside everything else on the ladder, from your
first week to your last — a habit you're building, not a sequence you finish. It's also the
one line on your [Day-1 baseline](../05-self-assessment/baseline.md) that no project on its
own will tick for you: *"using AI tools for real work, not just questions."* This is how you
get there.

> **The rule comes before the technique, because getting it wrong is expensive.** AI can get
> you to a draft in minutes — but it cannot know a single Brady number, and it will invent one
> that looks right without ever telling you it guessed. So the skill this thread trains isn't
> *prompting*. It's **verifying**. Everything below assumes you check what comes back before it
> reaches a report, a live account, or a person's inbox. The verify step isn't the tax on using
> AI. It's the job.

---

## The rule that isn't yours to bend

Brady is a Google-first shop and **Gemini is the sanctioned AI tool** — that's already covered
in [`ppc-fundamentals.md`](../02-learning/ppc-fundamentals.md) (Part 10), so this doesn't
re-argue it. What matters for the thread are the three hard lines underneath it:

| | The line | Why |
|---|---|---|
| **Tool** | Use **Gemini** for Brady work, not other tools | It's the sanctioned one — the rest isn't a preference, it's policy |
| **Footprint** | **Never** let AI tooling, or this repo, show up in a corporate system | Google Ads scripts, GTM, shared docs, **BigQuery SQL comments** — the *output* is fine to use, a "made-with-X" fingerprint is not |
| **Data** | Nothing sensitive goes *in* | No credentials, no customer PII, no unreleased numbers you wouldn't drop in a shared doc. **No credentials, ever** — if a task seems to need one, it doesn't |

---

## The shift this thread is about

The whole point is the move from **question box** to **workflow tool**.

- **Question box:** *"What's a good tROAS target?"* — generic, you could have searched it, and
  the answer doesn't know a thing about your account.
- **Workflow tool:** *"Here are 200 search terms from yesterday. Group them by buyer intent so I
  can judge the groups instead of reading 200 rows."* — that's actual work, on actual Brady data,
  and it saves you the part that was never the skill anyway.

The mechanic is the **same predict-then-compare** you use on every project (see
[`README.md`](./README.md)): *you still make the call.* AI just gets you to the point of judging
faster. It drafts, you decide — never the other way round.

---

## Why "verify" is the entire game — the four ways it will burn you

⚠️ Read this section as the load-bearing one. Each of these is a real failure, and each maps to a
landmine already documented elsewhere in the repo.

1. **It invents Brady numbers.** This is the single most damaging thing an assistant — human or
   AI — can do in this job. Ask it for a ROAS, a spend figure, a lead count, and it will hand you
   a confident, plausible, completely fictional number, because it has no access to your data. **An
   AI-generated number never reaches a report.** Real ones live in Google Ads, the MTD Spend
   dashboard, Power BI, Adobe, or BigQuery — name the source, every time.
2. **It's confidently wrong about how Brady measures.** Ask it about attribution and it will treat
   the Google Ads "Conversions" column as revenue, because that's the internet's default answer. It
   does **not** know Brady reports First-Touch, 180-day, outside the platform. If you take its word
   here you'll be the person quoting the wrong number in a meeting — see
   [`how-brady-measures.md`](../02-learning/how-brady-measures.md).
3. **It drifts off brand.** Anything customer-facing has binding standards — **AP style (no Oxford
   comma)**, no emoji, no slang, Brady Blue `#002D72`, Montserrat. AI's house style breaks all of
   these by default: it loves an Oxford comma, an exclamation mark, and a "supercharge your
   safety." Every line it drafts for an ad or a page gets checked against
   [T2-6](./t2-06-ad-copy-audit.md) and the brand rules before it ships.
4. **It's stale and generic.** It has a training cutoff and zero knowledge of *your* accounts —
   this year's guardrails, how Seton is structured, the fact that the "Seton/Emed MCC" doesn't
   contain Brady US. It's genuinely good at *"what is a DSA."* It is useless at *"how is our DSA
   coverage set up,"* and it won't warn you which question you asked.

---

## The moves — what "workflow tool" actually looks like here

Five recurring uses, each tied to work that's already on your ladder. The **verify** column is
the part that makes it safe.

| Move | When it goes live | The verify step |
|------|-------------------|-----------------|
| **Bucket a search-terms report.** Paste the terms, ask it to group by intent archetype so you judge groups, not rows | Every SQR round from [T2-1](./t2-01-sqr-predict-then-compare.md) on | It mislabels **routing lists as blocking lists**, and calls consumer-sounding terms "waste" without knowing the account. Re-check every group against [`who-else-is-searching.md`](../02-learning/who-else-is-searching.md) |
| **Draft RSA assets.** Give it the product and the brand rules, get 15 headlines and 4 descriptions to react to | [T2-6](./t2-06-ad-copy-audit.md), and any ad work after | Count characters (30 / 90), strip the Oxford commas and hype words, kill any claim it can't back, and decide pinning yourself. Run it through [`before-it-ships.md`](../02-learning/before-it-ships.md) |
| **Un-stick a formula or a query.** Have it explain or draft a Sheets formula, a GAQL pull, or SQL you're staring at | Budget and pacing math; the tools work, as it ramps | **Never accept an invented table or column name.** Run it on a small date range first, and reconcile the output to a number you already trust before you believe it |
| **Structure messy notes.** Turn a capture-session transcript or a page of scribbles into an organized doc | The **PDC handover** — the window is short (see [`pdc-primer.md`](../02-learning/pdc-primer.md)) | It fills gaps with plausible filler. Mark what was actually *said* versus what it *inferred* — the inferred parts are exactly what you go back and confirm |
| **Pressure-test your own write-up.** Ask it to argue the opposite, find your weakest number, or guess what Alex will ask | Before any readout | It's a sparring partner, not a grader. It'll invent objections that don't apply and miss the real one. You still own the call — see [`what-a-deliverable-looks-like.md`](../02-learning/what-a-deliverable-looks-like.md) |

---

## Two exercises to actually do

Both are **predict-then-compare** — write your own answer *before* you look at the AI's, same as
every brief. Put the write-ups in [`04-my-work/projects/`](../04-my-work/projects/).

**Exercise A — the bucketing race.** Take a real slice of a search-terms report. First, group the
junk into intent buckets yourself, on paper. *Then* ask Gemini to do the same slice. The
deliverable isn't the buckets — it's the list of **where the AI was wrong, and why**: the routing
term it flagged as waste, the "student" search that was really a facility manager scoping a job.
That list is the whole point, and it's the muscle you're building.

**Exercise B — the headline audit.** Have it draft 15 RSA headlines for one PDC product. Then run
every single one through [`before-it-ships.md`](../02-learning/before-it-ships.md) and the brand
rules, and count how many you'd actually ship. It's usually far fewer than it looks at first — and
noticing *why* each reject fails is the skill T2-6 is really testing.

---

## What good looks like

- **The ratio is a tell, not a problem.** "AI got me a draft in five minutes, then I spent twenty
  checking it" is using it *well*, not badly. The twenty minutes is where the value and the
  judgment are.
- **The one reliable sign someone uses AI well: they can always tell you what it got wrong.** If
  you can't name the thing you corrected, you didn't verify — you just relabeled its guess as your
  answer.
- **Talk to Scott.** Scott Palmersheim has built his own automation on Google's AI stack and is the
  person on the team furthest down this road (see
  [`../01-start-here/who-everyone-is.md`](../01-start-here/who-everyone-is.md)). Ask him what he
  actually uses it for day to day — it'll be more specific and more useful than anything generic.
- **This is Shift 1 in miniature.** Where paid media is going is loops — search terms, negatives,
  hygiene — run by automation with a person *auditing* rather than clicking
  ([`after-the-ramp.md`](./after-the-ramp.md)). Your daily keep/kill review is the manual version
  of that. This thread is how you start being the person who audits the machine instead of racing
  it.

---

## Where this connects

- [`README.md`](./README.md) — the predict-then-compare mechanic this thread rides on
- [`who-else-is-searching.md`](../02-learning/who-else-is-searching.md) · [T2-1](./t2-01-sqr-predict-then-compare.md) — the bucketing move
- [T2-6](./t2-06-ad-copy-audit.md) · [`before-it-ships.md`](../02-learning/before-it-ships.md) — the ad-copy move and the checks it must pass
- [`how-brady-measures.md`](../02-learning/how-brady-measures.md) — why an AI attribution answer is not to be trusted
- [`after-the-ramp.md`](./after-the-ramp.md) — Shift 1 (agentic PPC) and Shift 3 (AI-search visibility), where this habit leads
