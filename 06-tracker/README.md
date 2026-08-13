# The ramp workbook

Everything in this repo, as a Google Sheet you can work in.

The Sheet is the database — each document becomes a row, alongside the project ladder, your
questions, your notes, the tools map and your self-assessment. The Apps Script web app on top
of it is how you actually read and update all of that, without ever having to scroll a
spreadsheet cell containing 25,000 words.

**Nothing here replaces the repo.** The Markdown files stay the source; the workbook is a
copy you can annotate. If the source changes, you re-import and your notes survive.

---

## What you end up with

| Sheet | What it holds |
|-------|---------------|
| `Dashboard` | Which day and phase you're on, ladder progress by tier, everything counted. Live formulas |
| `Library` | All 63 documents — orientation, learning material, every project brief. One row each, body included |
| `Ladder` | The 33 projects: your prediction, status, dates, hours, whether the timebox held, where the deliverable went |
| `Questions` | Your running list, with the answer and the date you got it |
| `What I got wrong` | Predicted / actually / why / the habit behind it |
| `Notes` | Meetings, capture sessions, and what you owe someone |
| `Daily lines` | The three lines you post in chat each evening, one row per day |
| `Self-assessment` | The 31 skills at Day 1, Day 30 and Day 90, side by side |
| `Systems` | Which tool owns which number, its one gotcha, and where your access request has got to |
| `Scripts` | The Google Ads scripts, what they feed, and when they last ran |
| `Settings` · `Lists` | Your start date; the dropdown options |

---

## What the app does that the Sheet doesn't

| | |
|---|---|
| **Ctrl/Cmd + K** | Jump to any document, project or page by typing a few letters |
| **Search** | Full text, across all 63 documents *and* everything you have written |
| **Where you are** | A breadcrumb in the top bar - `Library > Learning > PPC fundamentals`, or `The ladder > T1-3` - so a document opened from three clicks away still says where it sits |
| **Where you were** | Your last stops as chips next to it. The orange one is where you just came from, one click back. **History** opens the last eight, newest first |
| **Pick up where you left off** | Leave a document half-read and a banner offers it back, with how far in you were and the heading you had reached. Clicking it returns you to that scroll position |
| **Today** | Which week you're in, what that week expects, the five recurring meetings, and your three lines |
| **The prediction** | Writing one stamps the date. That date is what makes it a prediction rather than a recollection, and it is never overwritten |
| **Readout builder** | The three-part readout, pre-filled with your prediction and anything you logged as wrong |
| **1:1 prep** | Your agenda assembled from what you have already written — finished work, what's in flight, the habits behind your misses, open questions, follow-ups you owe, access still outstanding. Copy it and go |
| **Reading** | Mark a document read and it dates itself. Internal links between documents work |
| **Concept diagrams** | Twelve of them, shown above the document that teaches the concept — one for every learning file, plus the project briefs that lean on the same idea. They load when you open the document rather than on every page |

> The 1:1 is analyst-led — you bring the agenda and Alex doesn't prepare one. That's the one
> this app earns its keep on.

> ⚠️ **The trail is stored in your browser, not in the Sheet.** It's per browser and per
> device, and clearing site data clears it. Nothing you've *recorded* lives there — only where
> you have been — so losing it costs you nothing but the way back.

---

## Setting it up

About ten minutes, and you only do it once.

1. **Make a new Google Sheet.** Any name — "Ramp workbook" is fine.
2. **Extensions → Apps Script.** A script editor opens in a new tab.
3. **Delete the `Code.gs` it starts with** — you're replacing it.
4. **Add each file from [`apps-script/`](./apps-script/).** The **+** next to *Files* adds one.
   - `.gs` files → choose **Script**, name it without the extension (`Code`, `Db`, `Setup`…)
   - `.html` files → choose **HTML**, name it without the extension (`Index`, `Stylesheet`,
     `JavaScript`, `Images`)
   - `DataDiagrams.gs` is the big one — it holds the twelve concept diagrams and it is about
     840 KB. The editor takes a moment to settle after you paste it. That is expected.
5. **Replace the manifest.** Click the gear (*Project Settings*), tick **Show `appsscript.json`**,
   then paste in [`apps-script/appsscript.json`](./apps-script/appsscript.json).
6. **Go back to the Sheet and reload the tab.** A **Ramp workbook** menu appears next to Help.
7. **Ramp workbook → Set up workbook.** Authorise it when Google asks. It takes a minute or
   two; it's writing 350 KB of text.
8. **Put your start date on the `Settings` sheet**, or set it on the Today screen in the app.

> ⚠️ **The "unverified app" screen is expected.** Google shows it for any script that isn't
> published to their marketplace, which includes every script anyone writes for themselves.
> Click **Advanced → Go to (your project)**.

**Step 4 is fifteen files pasted by hand, and it is the dullest part of this.** If you'd
rather not: Google's `clasp` tool pushes the whole folder in one command. It needs Node and a
one-time `clasp login`, then `clasp clone <script id>` in `apps-script/` and `clasp push`.

### Opening the app

**Ramp workbook → Open the app** works straight away, in a window over the Sheet.

For a URL you can bookmark and open on your phone, deploy it: **Deploy → New deployment →
Web app**, execute as **Me**, access **Only myself**.

> ⚠️ **Editing the code doesn't change a deployment.** After a change: **Deploy → Manage
> deployments → the pencil → Version: New version → Deploy.** This catches everyone once.

---

## The Google Ads scripts

[`google-ads-scripts/`](./google-ads-scripts/) holds three scripts that pull numbers out of an
account and into your workbook. **All three are read-only** — they run queries and write to a
Sheet, and none of them changes anything in an account. That's what makes them usable from day
one rather than after day 30.

| Script | What it does | Feeds |
|--------|--------------|-------|
| `search-terms-export.js` | Search terms with impressions, clicks, cost and conversions | The daily Keep/Kill review, T2-1, T2-2, T3-2 |
| `account-structure-snapshot.js` | Every campaign with its type, bidding strategy, budget and 30-day spend | T1-1, T1-2, T1-9 |
| `budget-pacing-check.js` | Month-to-date spend against budget, per business day | T2-4, T3-3 |

Each one stamps the account, its **timezone**, the currency, the date range and the run time
across the top of its tab, and labels the conversions column as the **platform** number. Both
of those are deliberate: they're the two things most likely to turn a correct number into a
wrong statement in a meeting. Setup instructions are in
[`google-ads-scripts/_shared-notes.md`](./google-ads-scripts/_shared-notes.md).

---

## Keeping it current

When the Markdown in this repo changes:

```
node 06-tracker/tools/build-content.mjs
```

That rewrites the `Data*.gs` files. Paste the changed ones back into the script editor, then
**Ramp workbook → Re-import content**.

**Re-import keeps everything you've recorded** — reading status, per-document notes, project
status, predictions, dates, hours, links and notes. Your questions, wrong-log, notes, daily
lines and scores aren't touched at all.

When the graphics change:

```
python3 06-tracker/tools/build-images.py     # needs: pip install pillow
```

That rewrites two files, because the kit has two kinds of image in it. Every image is resized
to the largest size the interface actually renders it at and recompressed — Apps Script has no
way to serve a file, so each one has to travel as text either way.

| Output | What goes in it | Cost |
|--------|-----------------|------|
| `apps-script/Images.html` | The chrome — icons, badges, banners, stamps, empty states | ~540 KB, inlined, on **every** page load |
| `apps-script/DataDiagrams.gs` | The twelve concept diagrams | ~840 KB held on the server; the browser asks for **one**, ~70 KB, when a document needs it |

Twenty megabytes of source PNG becomes about a megabyte of payload across the two.

> The diagrams are held back deliberately. Each one is a full slide and each belongs to one or
> two of the 63 documents, so inlining all twelve would put 840 KB on every screen to show at
> most one of them. They're fetched the way document bodies already are, and kept for the rest
> of the session once fetched. They're WebP, which every browser released since 2020 reads.

> One image in the kit isn't used as supplied: the folder banners are 1386 px wide with type
> set for that size, and the library list column is 336 px. Squeezed in there they scale to a
> quarter and stop being readable, so they run in the reader instead, where there is room.

### Checking it still works

```
node 06-tracker/tools/test.mjs
```

Builds the workbook against a stand-in for Google's runtime, drives every call the browser can
make, checks setup and re-import are idempotent, then renders all 63 documents and verifies the
output is well formed, that every internal link resolves, and that nothing rendered as
`undefined`. It also drives the trail — what gets remembered and what gets offered back — and
checks every graphic is built into the right payload and pinned to a document that exists.
**183 checks.**

### Looking at it

```
node 06-tracker/tools/preview.mjs /tmp/preview.html
```

Writes a single self-contained HTML file with the data mocked out, so you can open the whole
interface in a browser without deploying anything.

---

## What's in `apps-script/`

| File | What it does |
|------|--------------|
| `appsscript.json` | The manifest — time zone, and the web app deployed private to you |
| `Code.gs` | The menu, the web app entry point, and the in-Sheet window |
| `Schema.gs` | **Every table and column is defined here.** Add a column here, run Repair |
| `Db.gs` | Reads and writes sheets as tables, by column name, with a lock on every write |
| `Setup.gs` | Builds the workbook: sheets, formatting, dropdowns, the dashboard, the import |
| `Seed.gs` | The 33 projects, 31 skills, 12 systems and 3 scripts, transcribed from the source |
| `Api.gs` | The only functions the browser is allowed to call |
| `Data01…Data06.gs` | The document text. **Generated — don't edit by hand** |
| `DataDiagrams.gs` | The concept diagrams, handed over one at a time. **Generated — don't edit by hand** |
| `Images.html` | The rest of the graphics, inlined. **Generated — don't edit by hand** |
| `Index.html` · `Stylesheet.html` · `JavaScript.html` | The interface |

Three things in here are deliberate and worth not "fixing":

- **`T2-7` is a pointer, not a project.** It's the same work as `M-1`.
- **There is no `M-4`.** The gap is intentional and `M-5` keeps its number.
- **The `Systems` sheet ships with every `Link` blank.** No URL for any of those tools is
  recorded anywhere in the source material, and a plausible-looking guess would be worse than
  an empty cell. You fill them in the first time you open each one.

---

## Two house rules this has to keep

**Nothing in `apps-script/` or `google-ads-scripts/` references any AI tool, and it shouldn't
start to.** Gemini is Brady's sanctioned tool, and this code goes into a corporate Google
account. The same goes for links back to this repo.

**`CLAUDE.md` is deliberately not imported.** It's the only file the build script excludes by
name. It carries the boundary rule, and the terms quoted in it have no business being copied
into a corporate system. `tools/test.mjs` checks it stayed out.

---

## Known limits

- **The renderer covers what the source uses** — headings, tables, lists, task lists, quotes,
  code, links and emphasis. It isn't a full Markdown implementation and doesn't need to be.
- **Re-import replaces the `Body` column.** If you type into it directly on the `Library`
  sheet, that's the one thing you'll lose. Per-document notes go in `My notes`, which survives.
- **Two colours in the graphics don't match the brand standard exactly.** The kit is built on
  navy `#003087` and uses an orange accent; the binding Brady Blue is `#002D72`. The interface
  chrome uses `#002D72` and the artwork keeps its own. Worth a decision from Alex.
- **The logo is derived from a screenshot, not an official asset.** `graphics/brady-logo.png`
  was cut from a supplied screenshot: the flat background was keyed out to transparency so it
  can sit on the navy bar, where it renders reversed to white. Two caveats — the mark comes in
  at `#004288`, which is neither the binding Brady Blue `#002D72` nor the kit's `#003087`, and
  it is a raster at 1209 px rather than a vector. **Replace it with the official asset when
  you have one**: drop it in at the same path and re-run the image build, nothing else
  changes. It only ever renders reversed today, so the colour makes no visible difference —
  but it would the moment it appeared on a light background.
- **Nobody has run this in a real Sheet yet.** The tests verify the logic against a fake
  spreadsheet; the actual formatting and dropdown calls need one real **Set up workbook** run
  to confirm.
