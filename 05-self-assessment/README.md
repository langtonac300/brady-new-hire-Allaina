# Self-assessment

Two things live here: the questions, and somewhere to answer them.

| File | What it is |
|------|-----------|
| [`baseline.md`](./baseline.md) | **The Day-1 baseline.** 31 skills, scored before any training and again at Day 90. The wording lives here — this is the source |
| `first-day-questionnaires.xlsx` | **The same questions, as a spreadsheet you can type into.** Also carries the intake from [`../01-start-here/about-how-you-work.md`](../01-start-here/about-how-you-work.md), so both first-day questionnaires are in one file |

## Which one do I use?

Either. They ask the same things.

- **The spreadsheet** if you'd rather click a dropdown than edit a Markdown table — most
  people would. Download it, fill it in, keep it.
- **The Markdown** if you're comfortable editing files on GitHub, or you want to read the
  questions without opening Excel.

Fill it in during your first few days, **before any training** — that's the whole point of a
baseline. Then again at Day 90, and put them side by side.

**One difference between the two:** the spreadsheet has a **Day 30** column that
`baseline.md` doesn't print. The Markdown only scores Day 1 and Day 90, but it warns you that
some scores go *down* at Day 30, and the Apps Script tracker already carries all three. Use
the column or leave it blank — nothing depends on it.

> ⚠️ **Don't commit your filled-in workbook back over the top of this one.** The `.xlsx` here
> is a blank generated from the Markdown, and
> `python3 06-tracker/tools/build-questionnaires.py` overwrites it — answers and all. Save
> your copy under your own name and put it in [`../04-my-work/`](../04-my-work/README.md) if
> you want it in the repo at all. **You don't have to.** Nobody else needs to see it.

## If a question changes

The Markdown is the source. Change the wording in `baseline.md` or `about-how-you-work.md`,
then regenerate the workbook so the two don't drift:

```
python3 06-tracker/tools/build-questionnaires.py     # needs: pip install openpyxl
```
