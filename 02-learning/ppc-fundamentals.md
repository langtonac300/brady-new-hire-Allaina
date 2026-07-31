# PPC Fundamentals — crash course for a new paid search analyst

For someone with **limited paid-search experience.** This teaches the concepts you need to
be useful at Brady, in the order you'll need them, and — critically — **how Brady's own
conventions differ from generic PPC 101.** Read this before the [PDC primer](./pdc-primer.md).

> This is a *learning* doc, not a source of truth for live numbers. For the real
> definitions and current targets, ask Alex or check the live dashboards — this repo
> describes systems, it isn't the system. Where Brady does something non-standard, it's
> flagged **⚠️ Brady-specific.**

---

## Part 1 — How Google Ads is built (the account skeleton)

```
MCC (manager account)
 └ Account (e.g. PDC: Healthcare)
    └ Campaign        ← budget + bidding strategy + settings live here
       └ Ad group     ← a tight theme; holds keywords + ads together
          ├ Keywords  ← the searches you bid on (search campaigns)
          └ Ads        ← what the searcher sees
```

- **MCC = "My Client Center"** — a manager account holding many child accounts.
  **⚠️ Brady-specific:** there are **two MCCs**, and the naming is a trap. **"Brady US -
  MCC (Seton/Emed)" does NOT contain the Brady US account** — it holds Seton US, EMEDCO,
  Seton CA. The real Brady US account (and both PDC accounts) live in **Brady Global MCC.**
- **Campaign** — where the **budget** and **bidding strategy** are set. Most decisions that
  matter happen at the campaign level.
- **Ad group** — a tight cluster of closely-related keywords + the ads for them. Tight ad
  groups = more relevant ads = better performance.
- **Keyword** — a term you bid on **to match** searches (search campaigns) — not the search
  itself (see Part 2). Not all campaign types use keywords (see Part 3).

---

## Part 2 — Match types (how a keyword catches searches)

Same keyword — `patient wristbands` — behaves differently by match type:

| Match type | Written as | Catches | Use when |
|-----------|-----------|---------|----------|
| **Broad** | `patient wristbands` | Loosely related searches, Google's discretion (could catch "hospital id bands," "medical bracelets") | Paired with smart bidding to find new demand; needs tight negatives |
| **Phrase** | `"patient wristbands"` | Searches that include the *meaning* of your keyword (word order no longer guaranteed) | Balanced control |
| **Exact** | `[patient wristbands]` | That search and close variants (plurals, misspellings, same intent) | Tightest control, proven terms |

- **Search terms ≠ keywords.** Keywords are what you *bid on*; **search terms** are what
  people *actually typed*. The gap between them is where wasted spend hides — which is why
  the daily negative-keyword review exists (Part 8).
- **Negative keywords** stop your ads showing on searches you don't want. **⚠️
  Brady-specific:** PDC's negative coverage is *thin* — building it out is a good early win.

---

## Part 3 — Campaign types you'll see at Brady

| Type | What it is | Where you'll see it |
|------|-----------|---------------------|
| **Search** | Text ads on the results page, triggered by keywords | Everywhere |
| **Shopping / PLA** | Product listings (image + price) fed by a product feed. Standalone Shopping campaigns run at Brady/Seton; **PDC's product listings serve *inside PMax*, not as separate Shopping campaigns** | Brady, Seton |
| **Performance Max (PMax)** | Goal-based, Google-automated across all Google surfaces. **Two flavors: retail PMax** (uses a product feed — e.g. Wristbands' Shopify inventory) and **lead-gen PMax** (assets + audience signals, **no feed** — e.g. PDC Healthcare) | **Wristbands** = retail PMax; **PDC Healthcare** = lead-gen PMax |
| **DemandGen** | Visual/awareness across YouTube/Discover/Gmail | PDC Healthcare |
| **DSA** (Dynamic Search Ads) | Google generates ads/targets from your site content | Seton US (category coverage) |
| **Display / Video (YouTube)** | Banner / video awareness | Awareness Media, portables |

**⚠️ Brady-specific naming** you'll need to read fluently:
`[B]` / `[NB]` = Brand / Non-brand · `GGL` / `BNG` = Google / Bing · `[PLA]` = Shopping ·
`MINT - PRO/REM` = social prospecting/remarketing · Seton uses `PC-xx` product-category codes.

---

## Part 4 — Feeds & Shopping (why this matters so much at PDC)

**Shopping — and *retail* PMax — run on a product feed** — a structured file of your
products (title, price, image, availability, custom labels) that flows into **Google
Merchant Center**, then into the ads. **No feed / broken feed = no Shopping ads.** That's
why "feed issues" are top-priority emergencies.

⚠️ **But not all PMax needs a feed.** *Lead-gen* PMax (like PDC Healthcare) runs on assets
+ audience signals with **no product feed at all**. So don't reflexively diagnose "PMax
down = feed broken" — first check whether that PMax campaign is retail (feed-driven, e.g.
Wristbands) or lead-gen (no feed, e.g. PDC Healthcare). Getting this wrong is a classic
beginner misdiagnosis.

**⚠️ Brady runs three different feed worlds — and PDC spans two of them:**
- **Google Merchant Center**, fed via a system the internal dev team manages — Brady
  accounts + **PDC Healthcare**.
- **Feedonomics** — Seton US + EMEDCO (not PDC).
- **Shopify + Analyzify** — **Wristbands.com only.** A completely separate feed + tracking
  stack. This is the steepest part of learning PDC.

**Custom labels** are the lever for segmenting Shopping/PMax by product performance (e.g.
Stars / Zombies / New Arrivals / Growth tiers) — a technique used elsewhere on the team and
a plausible future PDC project.

---

## Part 5 — Bidding (manual → smart)

- **Manual CPC** — you set max bids. Full control, doesn't scale.
- **Smart bidding** — Google sets bids per auction toward a goal, using signals you can't
  set by hand:
  - **tROAS** (Target ROAS) — bid to hit a return-on-ad-spend target.
  - **tCPA** (Target CPA) — bid to hit a cost-per-acquisition target.
  - **Maximize Conversions / Value** — with optional targets/caps.
- **⚠️ Brady-specific state:**
  - **Seton/EMEDCO** — ROAS bidding (short purchase cycle).
  - **Brady** — historically manual CPC, **mid-transition to tROAS portfolios with Max
    CPC caps.**
  - **PDC — already fully on smart bidding.** The migration completed via promoted
    experiments in 2025; PDC is the team's *finished* proof case. So on PDC your bidding
    lever is the **target/cap/budget**, not manual keyword bids.
- **The catch that makes smart bidding fragile:** it optimizes toward whatever conversion
  actions are set **PRIMARY**. If the wrong action is primary, the algorithm optimizes to
  the wrong thing. **Conversion hygiene is a bidding issue, not just a reporting issue.**

---

## Part 6 — Conversion tracking & attribution (the most important section for Brady)

**A "conversion" is a valuable action** (purchase, form fill, phone call). How you *count*
and *credit* them is where most beginner mistakes happen. This gets a full treatment of its
own in [`how-brady-measures.md`](./how-brady-measures.md) — **read that one carefully.**
The one-line version: **the team's reported numbers are First-Touch, 180-day, computed in
BigQuery/Adobe — NOT the "Conversions" column in Google Ads.** If you quote the Google Ads
Conversions column as "our revenue," you'll be wrong and it'll show.

---

## Part 7 — The metrics Brady lives by (learn these cold)

| Metric | Means | ⚠️ Brady-specific note |
|--------|-------|------------------------|
| **A/S** | Ad spend ÷ Sales (efficiency ratio; **lower is better**) | The headline efficiency metric. Guardrails and current targets are covered in [`how-brady-measures.md`](./how-brady-measures.md). Profiles differ hugely by account — never compare raw across groups |
| **ROAS** | Revenue ÷ ad spend (**higher is better**) | Primary for Seton/EMEDCO & PDC. First-touch-model ROAS reads lower than platform ROAS — know which one you're quoting |
| **CVR** | Conversion rate | PDC Healthcare brand CVR is high (10–12%) |
| **CPC** | Cost per click | Watch trend, not just level — CPC inflation is a real driver of year-over-year cost growth |
| **AOV** | Average order value | A budget-model lever |
| **CAC / NCA** | Cost of acquisition / New Customer Acquisition | The team tracks new-customer growth, not just repeat revenue |
| **per-BD** | Per business day | Frame numbers this way when reporting up — it's how the team normalizes month-to-month comparisons |
| **IS** (Impression Share) | % of available impressions you got | **⚠️ Directional only** — don't build KPIs on it |
| **CPL / CPDL** | Cost per lead / per download-install | App/new-channel KPI |

**The mindset Brady rewards:**
- **Revenue first, then leading indicators** — non-brand quality traffic in the analytics
  platform is a favorite leading indicator to watch alongside revenue.
- **The "why" is mandatory** — a directional result without a mechanism is just noise.
  Quant says *what*, qual says *why*.
- **One number, sourced.** Multiple internal files can disagree; a filename that says
  "Final" means nothing on its own — always say which source and which attribution model a
  number came from.
- **Volume-first — a guardrail is a *ceiling*, not a *target*.** When pacing is behind and
  efficiency is still *within* guardrail, the instinct at Brady is usually to **push
  spend**, not cut. Don't learn a reflexive cut-to-protect-efficiency reflex; it's the
  opposite of what the team wants.

---

## Part 8 — The daily/weekly habits you'll actually do

- **Daily SQR (Search Query Report) Keep/Kill review** — the core daily habit. Triage
  yesterday's search terms: *"could a person typing this ever be shopping for what we
  sell?"* Keep or Kill; kills feed the negative-keyword list. It's an **intent filter, not
  a performance review.**
- **Weekly account-health check** — pacing vs target, impression share (directional),
  conversion volume, anomalies.
- **Monthly reporting** — pull your accounts' numbers and explain what changed and *why*.
- **A/B experiments** — every test gets a hypothesis, a fair split, an honest statistical
  read, and a logged learning. ⚠️ A *fair split* means a real control running at the same
  time — before-and-after is not a test. See
  [`running-a-real-test.md`](./running-a-real-test.md).

---

## Part 9 — Glossary fast-start (the terms you'll hit first)

The starter set — keep [`cheat-sheet.md`](./cheat-sheet.md) open for the plain-English
version of each:

**Attribution/metrics:** A/S · ROAS · FT (First Touch) · IP (180day OD) · CVR · AOV · CAC ·
NCA · per-BD · IS · CPC · CPL/CPDL · GCLID
**Structure:** MCC · Brand/Non-brand ([B]/[NB]) · PLA (Shopping) · PMax · DSA · Budget_Key
**Bidding:** tROAS · tCPA · pLTV
**Process/meetings:** SQR · L10 · IDS · EOS · Rocks · Scorecard · GTM

**Don't-mix-these-up traps:** three **Alexes** (Langton is your manager; two others share
the name) · a few people named **Matt** and **Courtney** and **CJ** across the wider team
— ask if a name feels ambiguous · **MECCO ≠ EMEDCO** (easy to typo) · the **"Seton/Emed
MCC" doesn't contain Brady US.**

---

## Part 10 — Culture & tooling rules (don't learn these the hard way)

- **Google-first shop:** Gmail, Google Chat, Meet, Docs, Sheets, Drive. **No Outlook, no
  Slack.** Google Chat is primary comms.
- **⚠️ Gemini is the sanctioned AI**, not other tools. **Never reference AI tooling, this
  repo, or non-sanctioned tools in corporate systems** (Google Ads scripts, GTM, shared
  docs, BigQuery SQL comments).
- **Jira exists** and the department uses it — but day-to-day work with Alex runs through
  Google Chat and 1:1s, not a ticket queue. **1:1s are analyst-led:** you bring the agenda.
- **Brand standards** apply to anything customer-facing (Brady Blue `#002D72`, Montserrat,
  AP style, no emojis/slang, WCAG AA).
