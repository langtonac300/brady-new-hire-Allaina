# Ramp Graphics Kit — for Claude Code

PNGs for "The ramp" Apps Script workbook (Brady 30/60/90). Brady palette: navy `#003087`, navy-dark `#021e47`, orange `#FF6B00`, green `#16a34a`, red `#d4351c`, light-navy tint `#e8eff8`. Font in graphics: DM Sans.

Apps Script can't serve local files — either base64-inline these (`<img src="data:image/png;base64,...">`), host them (Drive/CDN), or check them into the repo and reference raw GitHub URLs.

## Files

| File | Size (px) | Transparent | Where to use |
|---|---|---|---|
| welcome-hero.png | 1600×420 | no | Day-one landing / top of Today page. "Welcome, Allaina." + role + stats baked in. `background-size: cover` or plain `<img>`. |
| welcome-hero-blank.png | 1600×420 | no | Same hero with no text — render live name/copy on top (white text, left-aligned, ~90px inset). |
| welcome-card.png | 1444×610 (2x) | no | "Nobody expects you to know any of this yet" reassurance card. Render ~720px wide on Today page or library welcome. |
| hero-banner.png | 1600×280 | no | Header/masthead background. Put "The ramp" title text on top (white), don't bake text in. Use `background-size: cover`. |
| ramp-strip.png | 2400×360 (2x) | yes | Today page or "How the ramp works" — the Learn / Assist / Own 90-day arrow. Render at ~1200px wide. |
| phase-learn.png | 462×462 (2x) | yes | Phase medallion, days 1–30. Render ~180–220px. |
| phase-assist.png | 462×462 (2x) | yes | Phase medallion, days 31–60. |
| phase-own.png | 462×462 (2x) | yes | Phase medallion, days 61–90. |
| tier-t1..t4.png | 280×280 (2x) | yes | Tier badges for ladder section headers / project detail pages. Render ~64–100px. |
| tier-m.png | 280×280 (2x) | yes | Milestone (M-##) projects badge. |
| empty-questions.png | 920×480 (2x) | yes | Questions page empty state, above "Nothing yet. Start this on day one." |
| empty-notes.png | 920×480 (2x) | yes | Notes page empty state. |
| empty-wrong.png | 920×480 (2x) | yes | What-I-got-wrong empty state. |
| empty-inflight.png | 920×480 (2x) | yes | Today page "IN FLIGHT — nothing in progress" empty state. |
| stat-projects.png | 288×288 (3x) | yes | Icon for "Projects done" stat card. Render ~48–64px. |
| stat-docs.png | 288×288 (3x) | yes | Icon for "Documents read" stat card. |
| stat-questions.png | 288×288 (3x) | yes | Icon for "Questions open" stat card (orange). |
| stat-wrong.png | 288×288 (3x) | yes | Icon for "Things I got wrong" stat card (red). |
| stat-selfassess.png | 288×288 (3x) | yes | Self-assessment icon (green). |

## Batch 2 — mapped to app surfaces (Index.html / JavaScript.html views)

| File | Size (px) | Transparent | Where to use |
|---|---|---|---|
| nav-today/-library/-ladder/-questions/-wrong/-notes/-skills.png | 264×264 (3x) | yes | Sidebar nav icons, one per view (matches VIEWS array). Render ~28–36px, left of label. |
| stamp-done.png / stamp-read.png | 2x | yes | Green chip states (Done, Read, Answered, Independent). |
| stamp-inprogress.png | 2x | yes | Blue chip states (In progress, Reading). |
| stamp-ready.png | 2x | yes | Amber chip states (Ready for readout, Developing). |
| stamp-blocked.png | 2x | yes | Red chip states (Blocked, Open, Not yet). Render stamps ~110–160px wide. |
| account-pdc.png | 652×310 (2x) | no | PDC Healthcare account badge — project briefs, ladder rows. Render ~280px. |
| account-seton.png | 652×310 (2x) | no | Seton US account badge (red accent). |
| folder-overview/-starthere/-learning/-projects/-mywork/-selfassess.png | 1386×224 (2x) | no | Library folder group headers (Overview, Start here, Learning, Projects, My work, Self-assessment). Render ~640px or full column width. |
| meeting-meta-monday/-l10/-seton-emedco/-deep-dive/-one-on-one.png | 644×424 (2x) | no | "Your week" doc / Today page — the five recurring meetings. Render ~320px, grid of cards. |
| milestone-day30/-day60/-day90.png | 480×600 (2x) | yes | Phase-completion medals. Show on Today when day crosses 30/60/90, or in self-assessment. Render ~180–240px. |
| badge-readonly.png | 3x | yes | Project brief "Safety: Read-only" rows. Render ~115px. |
| badge-paired.png / badge-solo.png | 3x | yes | Project brief "Paired or solo" rows. |
| badge-timebox.png | 3x | yes | Project brief "Time box" rows — pair with live "1 hour" text. |

## Batch 3 — concept diagrams (dark navy, hero style)

| File | Size (px) | Where to use |
|---|---|---|
| diagram-keyword-vs-search-term.png | 2800×1200 (2x) | ppc-fundamentals Part 2, T1-3 brief. The net vs what people typed, incl. Keep/Kill. |
| diagram-attribution.png | 2800×1280 (2x) | how-brady-measures — the one rule. FT 180-day vs platform Conversions, worked journey. |
| diagram-guardrail.png | 2800×1120 (2x) | Guardrail drill T1-6 / pacing note T2-4. Ceiling-not-target gauge + the three caveats. |

## Batch 4 — one diagram per learning file

| File | Size (px) | Where to use |
|---|---|---|
| diagram-l10.png | 2800×1280 (2x) | the-l10-huddle. The seven timed segments, and why the scorecard stays five minutes. |
| diagram-project-loop.png | 2800×1240 (2x) | how-to-run-a-project. Before / during / after, prediction and write-up either side. |
| diagram-deliverable.png | 2800×1280 (2x) | what-a-deliverable-looks-like, T1-1 write-up. The strong and weak versions side by side. |
| diagram-archetypes.png | 2800×1360 (2x) | who-else-is-searching, T2-1. The archetypes, and the Famous Brady Terms list. |
| diagram-preship.png | 2800×1320 (2x) | before-it-ships. The checklist, plus the two changes with the widest blast radius. |
| diagram-test-modes.png | 2800×1360 (2x) | running-a-real-test, T3-5. Control and treatment, and SPLIT / PAIRED / PRE_POST. |
| diagram-pdc.png | 2800×1320 (2x) | pdc-primer, T1-4. The two accounts, and the conversion-action landmine. |
| diagram-seton-emedco.png | 2800×1280 (2x) | seton-emedco-primer. The two accounts, blended ROAS, paused legacy structure. |
| diagram-keep-kill.png | 2800×1320 (2x) | cheat-sheet worked example 2. The daily SQR as an intent test. |

Render diagrams full content width (~800–1100px). They're self-contained slides — no text overlay needed.

⚠️ **Every claim in these is from the learning files, and it has to stay that way.** The numbers
in the PDC and Seton/EMEDCO slides — timezones, the CVR band, which conversion action is
primary — are read out of `02-learning/`, not invented for the picture. If a source file
changes, the slide is wrong until it is redrawn, and a wrong number in a diagram is worse than
no diagram: it looks authoritative and it is not in a system anyone can check it against.

⚠️ **The diagrams are not inlined into the app.** Each is a slide of about 70 KB and belongs to
one or two of the 63 documents, so the build puts them in `apps-script/DataDiagrams.gs` and the
browser fetches one when a document needs it. Everything else in this kit is inlined and lands
on every page load. `tools/build-images.py` decides which pile an image goes in.

## Usage notes

- 2x/3x files are retina exports — render at half/third size in CSS.
- Empty states: center the image ~300px wide, caption text below in `#666`.
- Stat cards: icon left or top-right of the number, number stays live text.
- Keep app text as HTML text — none of these bake in copy except the ramp-strip and phase/tier labels.
