# The ramp workbook

Everything in this repo, as a Google Sheet you can work in.

The Sheet is the database — each document becomes a row, alongside the project ladder, your
questions, your notes and your self-assessment. The Apps Script web app on top of it is how
you actually read and update all of that, without ever having to scroll a spreadsheet cell
containing 25,000 words.

**Nothing here replaces the repo.** The Markdown files stay the source; the workbook is a
copy you can annotate. If the source changes, you re-import and your notes survive.

---

## What you end up with

| Sheet | What it holds |
|-------|---------------|
| `Dashboard` | Which day and phase you're on, ladder progress by tier, and everything counted in one place. All live formulas |
| `Library` | All 63 documents — the orientation material, the learning files, every project brief. One row each, body included |
| `Ladder` | The 33 projects, with status, dates, hours, where the deliverable went, and notes |
| `Questions` | Your running list, with the answer and the date you got it |
| `What I got wrong` | Predicted / actually / why / the habit behind it — the four boxes, one row per surprise |
| `Notes` | Meetings, capture sessions, things people told you, and what you owe someone |
| `Self-assessment` | The 31 skills, scored at Day 1, Day 30 and Day 90 side by side |
| `Settings` | Your start date and display name |
| `Lists` | The dropdown options, hidden. Edit an option here and every dropdown follows |

---

## Setting it up

About ten minutes, and you only do it once.

1. **Make a new Google Sheet.** Any name — "Ramp workbook" is fine.
2. **Extensions → Apps Script.** A script editor opens in a new tab.
3. **Delete the `Code.gs` it starts with** — you're replacing it.
4. **Add each file from [`apps-script/`](./apps-script/).** The **+** next to *Files* adds one.
   - `.gs` files → choose **Script**, name it without the extension (`Code`, `Db`, `Setup`…)
   - `.html` files → choose **HTML**, name it without the extension (`Index`, `Stylesheet`,
     `JavaScript`)
   - Paste the contents in, and save.
5. **Replace the manifest.** Click the gear (*Project Settings*), tick **Show `appsscript.json`**,
   then paste in [`apps-script/appsscript.json`](./apps-script/appsscript.json).
6. **Go back to the Sheet and reload the tab.** A **Ramp workbook** menu appears next to Help.
7. **Ramp workbook → Set up workbook.** Authorise it when Google asks — it's your own script
   asking for your own spreadsheet. It takes a minute or two; it's writing 350 KB of text.
8. **Put your start date on the `Settings` sheet**, or set it on the Today screen in the app.

> ⚠️ **The "unverified app" screen is expected.** Google shows it for any script that isn't
> published to their marketplace, which includes every script anyone writes for themselves.
> Click **Advanced → Go to (your project)**. You're granting your own script access to your
> own Sheet.

**Step 4 is thirteen files pasted by hand, and it is the dullest part of this.** If you'd
rather not: Google's `clasp` tool pushes the whole folder in one command. It needs Node and a
one-time `clasp login`, then `clasp clone <script id>` in `apps-script/` and `clasp push`.
Worth it if you expect to change the code more than once; not worth it for a single setup.

### Opening the app

**Ramp workbook → Open the app** works straight away, in a window over the Sheet.

For a real URL you can bookmark and open on your phone, deploy it:

1. In the script editor: **Deploy → New deployment**.
2. Type: **Web app**. Execute as **Me**. Who has access: **Only myself**.
3. **Deploy**, then copy the URL. **Ramp workbook → Show the web app link** gets it back later.

> ⚠️ **Editing the code doesn't change a deployment.** Apps Script serves the version you
> deployed, not the one in the editor. After a change: **Deploy → Manage deployments → the
> pencil → Version: New version → Deploy.** Same URL, new code. This catches everyone once.

---

## Using it

| Screen | What it's for |
|--------|---------------|
| **Today** | Where you are, what's in flight, what's next, and your open questions |
| **Library** | Read anything in the repo. Mark it Read, and keep notes per document |
| **The ladder** | Open a project, set its status, log hours, record where the deliverable went. Statuses fill in the dates for you |
| **Questions** | Add one in two seconds. Writing an answer marks it answered and dates it |
| **What I got wrong** | The four boxes. The last one — the habit — is the one that earns its place |
| **Notes** | Meetings and capture sessions, with a follow-up flag |
| **Self-assessment** | Score all 31, three columns, side by side |

Links between documents work — clicking one in a brief opens that document.

**You can also just edit the Sheet.** The app and the spreadsheet are the same data; a
dropdown changed on the `Ladder` sheet shows up in the app next time it loads. Use whichever
you feel like.

---

## Keeping it current

When the Markdown in this repo changes:

```
node 06-tracker/tools/build-content.mjs
```

That rewrites the `Data*.gs` files. Paste the changed ones back into the script editor, then
**Ramp workbook → Re-import content**.

**Re-import keeps everything you've recorded** — reading status, per-document notes, project
status, dates, hours, links and project notes. It replaces the document text and rebuilds the
ladder. Your questions, wrong-log, notes and scores aren't touched at all.

Two other menu items:

- **Repair workbook** — rebuilds headers, widths, dropdowns and the dashboard from the schema.
  Data is untouched. Use it after changing `Schema.gs`, or if a sheet gets mangled.
- **Set up workbook** — safe to run again. It only seeds tables that are still empty.

### Checking it still works

```
node 06-tracker/tools/test.mjs
```

Runs the whole thing against a stand-in for Google's runtime: builds the workbook, drives
every call the browser can make, then renders all 63 documents and checks the output is well
formed and that every internal link resolves. It's how the renderer gets verified against the
real material rather than by eye.

---

## What's in `apps-script/`

| File | What it does |
|------|--------------|
| `appsscript.json` | The manifest — time zone, and the web app deployed private to you |
| `Code.gs` | The menu, the web app entry point, and the in-Sheet window |
| `Schema.gs` | **Every table and column is defined here.** Add a column here, run Repair |
| `Db.gs` | Reads and writes sheets as tables, by column name, with a lock on every write |
| `Setup.gs` | Builds the workbook: sheets, formatting, dropdowns, the dashboard, the import |
| `Seed.gs` | The 33 projects and 31 skills, transcribed from the source |
| `Api.gs` | The only functions the browser is allowed to call |
| `Data01…Data06.gs` | The document text. **Generated — don't edit these by hand** |
| `Index.html` · `Stylesheet.html` · `JavaScript.html` | The interface |

Two things in the code are deliberate and worth not "fixing":

- **`T2-7` is a pointer, not a project.** It's the same work as `M-1`, and the ladder carries
  it as a pointer so the numbering reads correctly.
- **There is no `M-4`.** The gap is intentional, and `M-5` keeps its number.

---

## Two house rules this has to keep

**Nothing in `apps-script/` references any AI tool, and it shouldn't start to.** Gemini is
Brady's sanctioned tool, and this code goes into a corporate Google account. The same goes
for links back to this repo — the document rows carry a relative source path and nothing more.

**`CLAUDE.md` is deliberately not imported.** It's the only file the build script excludes by
name. It carries the boundary rule, and the terms quoted in it have no business being copied
into a corporate system. `tools/test.mjs` checks it stayed out.

---

## Known limits

- **The renderer covers what the source uses** — headings, tables, lists, task lists, quotes,
  code, links and emphasis. It isn't a full Markdown implementation, and it doesn't need to be.
- **Re-import replaces the `Body` column.** If you type into it directly on the `Library`
  sheet, that's the one thing you'll lose. Per-document notes go in `My notes`, which survives.
- **Setup takes a minute or two.** It's applying formatting column by column across nine
  sheets. It only happens once.
