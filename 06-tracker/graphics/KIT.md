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

## Usage notes

- 2x/3x files are retina exports — render at half/third size in CSS.
- Empty states: center the image ~300px wide, caption text below in `#666`.
- Stat cards: icon left or top-right of the number, number stays live text.
- Keep app text as HTML text — none of these bake in copy except the ramp-strip and phase/tier labels.
