# CLAUDE.md — agent entry point

**This repo belongs to the new Paid Search Analyst on Brady's Americas paid media team.**
It holds her learning material, her project work, and her self-assessments. It is a
working space, not a reference archive.

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

**In scope:** the analyst's onboarding — her learning material, her project work, her
self-assessments, anything that helps her ramp on Brady's paid-search accounts.

**Out of scope — don't add these, even if a session is asked to:**
- Manager-side content (see the boundary rule above).
- Anything about a different Brady initiative, account, or team that isn't part of her
  ramp — this repo is not a general Brady knowledge dump.
- Session artifacts: scratch notes, "here's what I did this session" summaries, debug
  output, half-finished drafts — unless they're clearly her own work-in-progress and belong
  in `04-my-work/`.
- A second version of something that already exists. If content is close to an existing
  file, edit that file — don't create `pdc-primer-v2.md` or `pdc-primer-updated.md`.

---

## Keeping this repo clean across many sessions

This repo gets touched by a lot of different Claude sessions over time, plus Kelsey
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
   because it's not clearly about her ramp, or you can't tell which side of the boundary
   it came from — say so and leave it out, rather than guessing.

## Known gaps (not bugs)

Some things here are deliberately incomplete. Don't "helpfully" invent content to fill
these — flag them to Alex instead:

- `03-projects/` only has the ladder overview, not individual project briefs. Alex adds
  those one at a time as she reaches them — not all at once, on purpose.
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
| `04-my-work/` | Her workspace: notes, drafts, deliverables, capture notes |
| `05-self-assessment/` | The Day-1 baseline and the Day-90 re-score |

---

## How to help her well

- **She is new to paid search.** Explain rather than assume; expand acronyms the first
  time; don't skip the "why."
- **Uncertainty goes at the top.** If a number or a claim needs verifying, say so before
  the answer, not in a footnote.
- **Never invent a Brady number.** If a figure isn't in this repo or in a system she can
  open, say you don't have it and name where it lives. Fabricated-but-plausible numbers are
  the single most damaging thing an assistant can produce in this job.
- **Point at the source of truth.** This repo describes systems; it isn't the live system.
  Real numbers come from Google Ads, the MTD Spend dashboard, Power BI, Adobe or BigQuery.
- **No credentials, ever.** If a task needs one, say where it's stored.

## Brady house rules that apply to her work product

- **Gemini is the company's sanctioned AI tool.** Anything pushed into a corporate system
  — Google Ads scripts, GTM, shared docs, BigQuery SQL comments — must not reference other
  AI tooling or this repo.
- **Brand standards are binding** for any Brady-branded output: Brady Blue `#002D72`,
  Montserrat, AP style (no Oxford comma), no emoji or slang, WCAG AA.
- **Keep personnel matters out of this repo.** Performance conversations live with Alex
  and HR, not in version control.
