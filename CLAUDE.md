# CLAUDE.md — agent entry point

**This repo belongs to Allaina Struve, the new Paid Search Analyst on Brady's Americas
paid media team.** It holds their learning material, their project work, and their
self-assessments. It is a working space, not a reference archive.

---

## ⚠️ The boundary rule — read this first, every session

There is a **separate, private manager-side knowledge base** for Alex Langton (Paid Media
Manager) that may be attached to the same session as this repo. It contains material that
is **not for the analyst**: manager playbooks, the headcount business case, hiring
machinery, performance-review content, competency gates, and candid assessments of people.

**When both repos are in a session:**

1. **Never surface manager-side content into this repo, into a file here, or into a
   conversation the analyst is part of.** Not by quoting it, not by summarizing it, not by
   answering a question "based on what I know."
2. **Never copy files between the repos.** Material that belongs here gets *rewritten* for
   this audience, not moved.
3. **If asked something that can only be answered from the manager-side base** — about
   ratings, gates, the business case for the role, or anyone's performance — say it's not
   something in this repo and route it to Alex. Don't improvise around it.
4. **Facts flow one way freely:** account facts, process facts, tool documentation and
   paid-search knowledge are fine to bring here. Judgments about people are not.

If you are ever unsure which side a piece of information came from, treat it as
manager-side and leave it out.

---

## Scope — what belongs here, and what doesn't

**In scope:** the analyst's onboarding — their learning material, their project work,
their self-assessments, anything that helps them ramp on Brady's paid-search accounts.

**Out of scope — don't add these, even if a session is asked to:**
- Manager-side content (see the boundary rule above).
- Anything about a different Brady initiative, account, or team that isn't part of their
  ramp — this repo is not a general Brady knowledge dump.
- Session artifacts: scratch notes, "here's what I did this session" summaries, debug
  output, half-finished drafts — unless they're clearly the analyst's own work-in-progress
  and belong in `04-my-work/`.
- A second version of something that already exists. If content is close to an existing
  file, edit that file — don't create `pdc-primer-v2.md` or `pdc-primer-updated.md`.

---

## Keeping this repo clean across many sessions

This repo gets touched by a lot of different Claude sessions over time, plus Allaina
uploading things directly through the GitHub web UI. None of them share context with each
other except what's written down here — so a few habits matter more than usual:

1. **Check before you create.** Search the repo for related content before adding a new
   file. If something adjacent already exists, extend it instead of duplicating it.
2. **Stay inside the five numbered folders** unless there's a genuine new category of
   content — not just convenience. A sixth top-level folder should be rare.
3. **Match the existing voice.** Second person, plain language, ⚠️ callouts for gotchas,
   concise tables over long prose. Skim a neighboring file before writing a new one so it
   doesn't read like it was written by someone else — because it was.
4. **Update the index.** Every folder with multiple files has its own `README.md` acting
   as an index. If you add, rename, or remove a file, update that README in the same
   commit — a stale index is worse than no index.
5. **Run the boundary check before committing anything:**
   ```
   grep -rinE "wrong-hire|fit-with-support|business case|headcount|probation|I-9|background check" . --include=*.md
   ```
   Only the mentions inside this file's boundary-rule section above should match. Anything
   in another file, stop and investigate before pushing. (A GitHub Action also runs this
   check automatically on every push to `main` — but it only reports after the fact; don't
   rely on it instead of checking yourself.)
6. **When in doubt, don't add it.** If you're not sure content belongs in this repo —
   because it's not clearly about their ramp, or you can't tell which side of the boundary
   it came from — say so and leave it out, rather than guessing.
7. **Never `git push --force` or delete `main`.** This repo is private, and GitHub's
   branch-protection enforcement for private repos needs a paid plan this repo doesn't
   have — so nothing technically stops a force-push or branch deletion from landing. Don't
   run either, even to "clean up" history. If you think you need to, stop and ask Alex
   first.

## Known gaps (not bugs)

Some things here are deliberately incomplete. Don't "helpfully" invent content to fill
these — flag them to Alex instead:

- `03-projects/` holds the ladder overview plus the **Tier 1 (T1-1…T1-12)**, **Tier 2
  (T2-1…T2-8)**, **Tier 3 (T3-1…T3-5)** and **Tier M (Mecco, M-1…M-5)** briefs. Each tier
  ships as a block once Alex calls for it. **Everything past Tier 3 gets added a tier at a
  time as they reach it** — not all at once, on purpose. Don't write Tier 4, the tools
  thread or the AI thread ahead of that without checking with Alex.
  - **T3-5 is the first-experiment brief** — it's the ramp project `running-a-real-test.md`
    and `after-the-ramp.md` both point forward to, and it's the only Tier 3 project that
    goes live. Don't duplicate the experiment method into it; it points at that learning file.
  - **T2-7 has no file of its own** — it's the same project as M-1, and `m-01` and the
    `03-projects/README.md` index both say so. Don't create `t2-07-*.md`.
  - **There is no `m-04-*.md`, on purpose.** M-4 (the Clarity trace) was removed by Alex on
    2026-07-31 because it was the only project depending on a tool he'd decided not to train
    them on. Tier M is M-1, M-2, M-3, M-5. **Don't recreate it and don't renumber M-5** to
    close the gap — same convention as the missing `t2-07-*.md`.
  - **`03-projects/after-the-ramp.md` is not a tier.** It's a horizon doc about year one —
    rocks, goals, the four shifts, and directions that are open. Alex asked for it
    explicitly (2026-07-31). It describes directions, deliberately not briefs, so the
    tier-at-a-time rule above is unchanged. Don't turn it into assigned projects.
- A guided Sheets workbook for hands-on practice doesn't exist yet.
- The five `02-learning/` files were adapted from a separate manager-side source in
  2026-07; if that source has moved on since, this repo may lag it slightly. Cross-check
  live numbers against the real systems (Google Ads, dashboards), never against this repo.

---

## What's here

| Folder | What it is |
|--------|-----------|
| `01-start-here/` | Read these first — orientation and how the ramp works |
| `02-learning/` | Reference material: PPC fundamentals, the accounts, the glossary |
| `03-projects/` | The project ladder — the actual work, project by project |
| `04-my-work/` | Their workspace: notes, drafts, deliverables, capture notes |
| `05-self-assessment/` | The Day-1 baseline and the Day-90 re-score |

---

## How to help them well

- **They are new to paid search.** Explain rather than assume; expand acronyms the first
  time; don't skip the "why."
- **Uncertainty goes at the top.** If a number or a claim needs verifying, say so before
  the answer, not in a footnote.
- **Never invent a Brady number.** If a figure isn't in this repo or in a system they can
  open, say you don't have it and name where it lives. Fabricated-but-plausible numbers are
  the single most damaging thing an assistant can produce in this job.
- **Point at the source of truth.** This repo describes systems; it isn't the live system.
  Real numbers come from Google Ads, the MTD Spend dashboard, Power BI, Adobe or BigQuery.
- **No credentials, ever.** If a task needs one, say where it's stored.

## Brady house rules that apply to their work product

- **Gemini is the company's sanctioned AI tool.** Anything pushed into a corporate system
  — Google Ads scripts, GTM, shared docs, BigQuery SQL comments — must not reference other
  AI tooling or this repo.
- **Brand standards are binding** for any Brady-branded output: Brady Blue `#002D72`,
  Montserrat, AP style (no Oxford comma), no emoji or slang, WCAG AA.
- **Keep personnel matters out of this repo.** Performance conversations live with Alex
  and HR, not in version control.
