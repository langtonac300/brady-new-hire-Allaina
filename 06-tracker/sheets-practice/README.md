# Sheets practice

A guided workbook for the spreadsheet skills the ladder assumes you already have — built on a
fake account, so you can be wrong at no cost.

It exists because of a gap. `the-tools-thread.md` sets the bar for Google Sheets at "beyond
basics — pivot tables, `QUERY`/`FILTER`, and knowing a pasted CSV can be silently truncated,"
and `about-how-you-work.md` asks you to rate yourself on it in your first week. But nothing in
the ramp ever *taught* it. The first place you'd have practised a pivot table was
[T2-4](../../03-projects/t2-04-the-pacing-note.md) — a real pacing note, on real budget
numbers, going to people who act on it.

**Learning a formula and getting a live budget number right are not the same task, and doing
them simultaneously is how quiet mistakes happen.** So: practise here first.

> ⚠️ **Nothing here is real.** Northgate Safety Supply is invented. Every search term, dollar
> and conversion was produced by [`generate.mjs`](./generate.mjs) from a fixed seed. The data is
> *shaped* like a Brady safety-and-identification account so the skills transfer — it is not
> Brady data, and **no number from this folder should ever be quoted as one.**

---

## Setting it up

About five minutes.

1. **Make a new Google Sheet.** Any name — "Sheets practice" is fine.
2. **Rename the first tab `Search terms`.** Open
   [`data/search-terms.tsv`](./data/search-terms.tsv), select all, copy, and paste into `A1`.
   It's tab-separated, so it lands in columns on its own.
3. **Add a second tab, `Daily spend`.** Same thing with
   [`data/daily-spend.tsv`](./data/daily-spend.tsv).
4. **Open [`TASKS.md`](./TASKS.md) and start at task 1.**

> **If GitHub's preview is awkward to copy from,** click **Raw** first, then select all. Or
> download the file and use **File → Import → Upload** in Sheets, choosing *Insert new sheet(s)*
> and *Tab* as the separator.

Excel works for everything except tasks 5 and 6 — `FILTER` behaves differently and `QUERY`
doesn't exist. Use Sheets; it's what Brady runs on.

---

## What's here

| File | What it is |
|------|-----------|
| [`TASKS.md`](./TASKS.md) | **Start here** — nine tasks in order, each mapped to the project that consumes it |
| [`ANSWERS.md`](./ANSWERS.md) | The answer key, computed from the shipped data. Don't open it first |
| [`data/search-terms.tsv`](./data/search-terms.tsv) | 940 search terms with impressions, clicks, cost, conversions and value |
| [`data/daily-spend.tsv`](./data/daily-spend.tsv) | Daily spend for November 2026 — the pacing exercise |
| [`generate.mjs`](./generate.mjs) | Rebuilds both, plus the answer key, from one seed |

---

## What it covers, and where each one lands

| Task | Skill | Where you'll need it |
|:---:|---|---|
| 1 | Verifying a paste is complete | Every project. The silent-truncation trap |
| 2 | Sort and filter | T1-3, the daily keep/kill review |
| 3–4 | Pivot tables, and the empty-CPA trap | T2-4, T3-3 |
| 5 | `FILTER` | T2-2 |
| 6 | `QUERY` | T2-2, T3-2, most reporting after the ramp |
| 7 | Per-business-day math + the holiday trap | **T2-4** — this is its arithmetic |
| 8 | Finding a brand-name collision | T2-1, T2-2, `who-else-is-searching.md` |
| 9 | Writing the five-line pacing note | T2-4 directly |

**Good time to do it: weeks 3–5**, alongside Tier 1 — after you've seen a real account, before
T2-4 needs the arithmetic. It isn't scheduled and nobody is checking. Two hours.

---

## Regenerating the data

```
node 06-tracker/sheets-practice/generate.mjs [seed]
```

Writes `data/` and `ANSWERS.md` together. The answer key is **computed from the rows that ship**
rather than written by hand, so it can't drift from the dataset — but that only holds if you
commit both together.

Pass a different seed for a fresh set (`node generate.mjs 12345`) if the answers ever get
memorised or shared.
