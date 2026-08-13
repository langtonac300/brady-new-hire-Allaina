# PPC Fundamentals — crash course for a new paid search analyst

For someone **new to paid search.** This teaches the concepts you need to be useful at
Brady, in the order you'll need them, and — critically — **how Brady's own conventions differ
from generic PPC 101.** Read this before the [PDC primer](./pdc-primer.md).

> This is a *learning* doc, not a source of truth for live numbers. For the real definitions
> and current targets, ask Alex or check the live dashboards — this repo describes systems,
> it isn't the system. Where Brady does something non-standard, it's flagged **⚠️
> Brady-specific.** Where a Google mechanic changes over time, it's flagged **verify** — the
> platform moves, and a fundamentals doc goes stale quietly.

**How to use it:** each part ends with a **Check yourself** and a pointer to the project that
drills it. If you can't answer the check, that part hasn't landed yet — that's useful to know
*before* the project, not during it. Don't try to memorize; read it once now, and come back to
the part that's relevant when a project sends you.

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

Each level exists because a **setting lives there and nowhere else** — that's the whole point
of the hierarchy, and knowing which level owns which lever is half of navigating an account:

| Level | What it owns | Why it's there |
|---|---|---|
| **MCC** ("My Client Center") | Nothing about serving — it's a container that holds many accounts under one login | How an agency or an in-house team manages many accounts at once |
| **Account** | Currency, time zone, conversion actions, billing | The boundary of one business's advertising. ⚠️ **Time zone is set at creation and can never change** — this bites you later (see [T1-8](../03-projects/t1-08-the-timezone-trap.md)) |
| **Campaign** | **Budget, bidding strategy, networks, locations, schedule** | This is where **most decisions that matter** are made |
| **Ad group** | A tight theme — keywords + the ads for them | Tight theme → more relevant ad → better Quality Score → cheaper clicks (Part 5) |
| **Keyword / Ad** | The bid target and the creative | The actual auction entry and what the searcher sees |

**Worked example — where would you change X?** "Give PDC Healthcare's brand campaign more
money" → *campaign* (budget). "Stop showing on 'free' searches" → *negative keyword*, usually a
*shared list* or *campaign* level. "Make the ad copy on-brand" → *ad* level. Getting the level
right is the difference between a change that does what you meant and one that does something
subtly bigger.

**⚠️ Brady-specific — the MCC naming trap.** There are **two MCCs**, and the naming lies:
**"Brady US - MCC (Seton/Emed)" does NOT contain the Brady US account** — it holds Seton US,
EMEDCO, Seton CA. The real Brady US account (and **both PDC accounts**) live in **Brady Global
MCC.** Everyone gets caught by this once; try to be the person who read about it first.

**Check yourself:** name the level where budget lives; the level where a keyword lives; and one
thing about an account you can *never* change after it's created. → drilled in
[T1-1](../03-projects/t1-01-account-tour.md).

---

## Part 2 — Match types (how a keyword catches searches)

**A keyword is a *net*, not a filter.** You bid on a keyword; Google decides which real
searches it's allowed to catch. Match type sets how wide the net is.

Same keyword — `patient wristbands`:

| Match type | Written | Catches | The net |
|---|---|---|---|
| **Broad** | `patient wristbands` | Whatever Google reads as *related* — synonyms, related intents, even signals from the landing page and account history | Widest, least predictable |
| **Phrase** | `"patient wristbands"` | Searches carrying the *meaning* of the phrase, additional words allowed before/after (word order no longer guaranteed) | Middle |
| **Exact** | `[patient wristbands]` | That search **and close variants** — plurals, misspellings, reorderings, same-intent rewordings | Tightest — but see the trap |

**The mechanism (why broad reaches far):** broad match doesn't hunt for your *words*, it hunts
for your *meaning*. `patient wristbands` on broad can serve on "hospital ID bands," "newborn
security tags," even "medical bracelets" — decided at auction from the search, the landing
page, and what Google has learned about the account. That's powerful **with smart bidding**
(the model can bid per-query, so broad often finds demand you'd never have listed) and
dangerous **without tight negatives** (it finds demand that was never yours).

⚠️ **The trap that catches everyone: exact isn't exact.** `[patient wristbands]` also serves on
"patient wrist band," "patient wristband," and same-meaning rewordings. A keyword matching a
search you didn't literally type is **not a bug** — it's close-variant matching, and it's the
classic "wait, why did that show?" moment. You'll go find a real one in
[T1-3](../03-projects/t1-03-keyword-vs-search-term.md).

### Search terms ≠ keywords
Keywords are what you *bid on*; **search terms** are what people *actually typed*. One search
term can match several of your keywords, and one keyword catches many search terms — which is
why the two reports never reconcile line-for-line. The gap between them is where wasted spend
lives, and it's the entire reason the daily Keep/Kill review exists (Part 8).

### Negative keywords — and the gotcha that costs traffic
Negatives stop your ads on searches you don't want. Two things beginners get wrong, and both
cost money:

- **Negatives match *more strictly* than positive keywords — they do NOT use close variants.**
  A negative exact `[wristband]` blocks only the exact query "wristband"; it will **not** block
  "wristbands," "wrist band," or a misspelling. So to block a concept you often need several
  forms. This is the opposite of how positive keywords behave, and it surprises everyone.
- **A broad-ish negative blocks more than you think.** Add `free` as a negative and, depending
  on match type, you can block `free shipping wristbands` — a real buyer. Default to phrase or
  exact for anything ambiguous. This is the single most common way a new analyst quietly kills
  good traffic; you'll feel the stakes in [T2-3](../03-projects/t2-03-negative-keyword-build-v1.md).

⚠️ **Brady-specific:** PDC's negative coverage is *thin* — building it out is a good early win.
And on Seton/EMEDCO, some "negative" lists aren't hygiene at all — they **route** traffic
between campaigns. Read a list's contents before you touch it (Part 3, and
[T1-7](../03-projects/t1-07-brand-vs-nonbrand.md)).

**Check yourself:** explain why an exact-match keyword served on a term you didn't type; say
why one negative might not block a plural you meant to block; and state what makes broad match
powerful *and* dangerous in one sentence. → [T1-3](../03-projects/t1-03-keyword-vs-search-term.md),
[T2-1](../03-projects/t2-01-sqr-predict-then-compare.md).

---

## Part 3 — Campaign types you'll see at Brady

Each type is a different machine with a different failure mode. Learn them by *what they run
on* and *how they break*:

| Type | Runs on | The beginner trap | Where at Brady |
|------|---------|-------------------|----------------|
| **Search** | Keywords → text ads | Assuming the keyword and the search term are the same thing | Everywhere |
| **Shopping / PLA** | A **product feed** (image + price) | "No products showing" is usually a *feed* problem, not a bid problem | Brady, Seton. **PDC's listings serve *inside PMax*, not as standalone Shopping** |
| **Performance Max** | Depends — **two flavours** (below) | Diagnosing every PMax problem as "feed broken" | **Wristbands** = retail PMax; **PDC Healthcare** = lead-gen PMax |
| **DemandGen** | Audiences + visual assets (no keywords) | Judging it on last-click revenue — it's upper-funnel | PDC Healthcare |
| **DSA** (Dynamic Search Ads) | Your **site content** — Google generates the targeting and headlines | Letting it roam the whole site with no page feed to steer it | Seton US (category coverage) |
| **Display / Video** | Placements / audiences | Expecting search-style intent from a banner | Awareness Media, portables |

**Performance Max, the two flavours (this distinction matters more than any other here):**

- **Retail PMax** is fed by a **product feed** and is essentially Shopping plus every other
  Google surface. It has **listing groups** (which products each asset group targets). Wristbands
  is this shape.
- **Lead-gen PMax** has **no feed at all.** It runs on **asset groups** (headlines, images,
  video), **audience signals** (hints to speed up learning — *not* hard targeting), and
  **final-URL expansion** (Google picks landing pages from your site unless you turn it off).
  PDC Healthcare is this shape. There are no products to point at — so when it misbehaves, you
  look at assets, signals and URLs, not a feed. Drilled in
  [T1-9](../03-projects/t1-09-pmax-with-no-feed.md).

⚠️ **PMax cannibalizes brand Search.** Left unchecked, a PMax campaign will happily eat your
own branded queries and take credit for them. Teams fence this off with brand exclusions.
When you see PMax and brand Search "both doing well," ask who's actually earning the branded
clicks.

⚠️ **Brady-specific naming** you'll need to read fluently:
`[B]` / `[NB]` = Brand / Non-brand · `GGL` / `BNG` = Google / Bing · `[PLA]` = Shopping ·
`MINT - PRO/REM` = social prospecting/remarketing · Seton uses `PC-xx` product-category codes.

**Check yourself:** given a PMax campaign, say how you'd tell retail from lead-gen in under a
minute; and name what you'd look at first if a *lead-gen* PMax's volume dropped. →
[T1-1](../03-projects/t1-01-account-tour.md), [T1-9](../03-projects/t1-09-pmax-with-no-feed.md).

---

## Part 4 — Feeds & Shopping (why this matters so much at PDC)

**Shopping — and *retail* PMax — run on a product feed:** a structured file, one row per
product (title, price, image, availability, custom labels), that flows into **Google Merchant
Center**, then into the ads.

```
Your catalog → feed file → Merchant Center (approves/rejects rows) → Shopping / retail PMax ads
```

**No feed, or a broken feed, = no Shopping ads.** That's why "feed issues" are treated as
top-priority emergencies: a feed outage isn't a slow decline, it's an instant zero on a
revenue channel.

⚠️ **Not all PMax needs a feed.** *Lead-gen* PMax (PDC Healthcare) has **no product feed at
all** — see Part 3. So "PMax down = feed broken" is a misdiagnosis waiting to happen. First
establish whether the campaign is retail (feed-driven) or lead-gen (no feed).

**⚠️ Brady runs three different feed worlds — and PDC spans two of them:**

| Feed world | Powers | Notes |
|---|---|---|
| **Google Merchant Center** (managed by the internal dev team) | Brady accounts **+ PDC Healthcare** | The "standard" path |
| **Feedonomics** | Seton US + EMEDCO | A third-party feed platform — not PDC |
| **Shopify + Analyzify** | **Wristbands.com only** | A completely separate feed *and* tracking stack — the steepest part of learning PDC. Don't rathole here |

**A blank or wrong feed value fails silently.** The product doesn't error — it just quietly
doesn't land in the campaign that was supposed to have it, and that campaign quietly
underdelivers. Nothing turns red. This is why feed QA is real work, not housekeeping (see
[T2-5](../03-projects/t2-05-feed-label-qa.md)).

**Custom labels** (Google allows five: `custom_label_0`–`4`) are the lever for segmenting
Shopping/PMax by anything you choose — a margin tier, a season, a performance band (Stars /
Zombies / New Arrivals). They're the handle campaigns grab to target a subset of products.

**Check yourself:** trace a product from catalog to a Shopping ad and name where it can break;
say why an empty feed label produces no error but hurts performance; and name which PDC account
does *not* use a feed. → [T2-5](../03-projects/t2-05-feed-label-qa.md).

---

## Part 5 — Bidding (manual → smart)

**The question every bidding strategy answers:** *how much do I bid in this specific auction?*
You either answer it by hand (manual) or hand it to Google's model (smart).

- **Manual CPC** — you set max bids per keyword. Total control, doesn't scale, can't use
  per-auction signals.
- **Smart bidding** — Google sets a bid **per auction** toward a goal, using signals you
  cannot set by hand: device, location, time, the exact query, browsing context, remarketing
  membership, and more. The main strategies:

  | Strategy | Optimizes for | Rough minimum to work | Best for |
  |---|---|---|---|
  | **tCPA** (Target CPA) | Conversion volume at a target cost | ~30 conversions/mo | Lead gen, equal-value conversions |
  | **tROAS** (Target ROAS) | Conversion *value* at a target return | ~50 conversions/mo | E-commerce, varying order values |
  | **Maximize Conversions / Value** | As many conversions / as much value as the budget buys | — | When you don't yet have a firm target |

**Two mechanics that make smart bidding fragile — know both:**

1. **It optimizes toward whatever conversion actions are marked PRIMARY** (Part 6). Point it
   at the wrong action and it will spend real money chasing the wrong thing, perfectly
   efficiently. **Conversion hygiene is a bidding problem, not just a reporting one** — this is
   the single most important sentence in this doc.
2. **It learns, and learning is disruptable.** After you create or significantly change a
   strategy there's a **1–2 week learning period** where performance wobbles. **Change targets
   gradually (~15–20% at a time)**, not in big jumps, or you reset the learning. During
   learning, watch impression share, not just CPA/ROAS.

⚠️ **Broad match + smart bidding often *beats* exact.** Because the model bids per query, a
broad keyword under tCPA/tROAS can outperform a tight exact one. So "broad = wasteful" is a
half-truth — broad is wasteful *without* smart bidding and tight negatives, and often efficient
*with* them.

⚠️ **Smart bidding ignores your manual bid adjustments.** Device/location/schedule multipliers
mostly stop mattering once a campaign is on smart bidding — the model overrides them. The one
exception that still bites: a **−100% device modifier** (a hard exclusion) still applies.

**⚠️ Brady-specific state (where each account group actually is):**
- **Seton/EMEDCO** — ROAS bidding (short purchase cycle).
- **Brady** — historically manual CPC, **mid-transition to tROAS portfolios with Max-CPC caps.**
- **PDC — already fully on smart bidding**; the migration finished via promoted experiments in
  2025, and PDC is the team's *finished* proof case. So on PDC your lever is the
  **target / cap / budget**, not manual keyword bids.

**A note on Quality Score & Ad Rank (why two advertisers pay different prices):** where you
show, and what you pay, isn't just your bid. `Ad Rank ≈ Bid × Quality Score × expected impact
of assets`. **Quality Score** (1–10) is Google's read of expected click-through, ad relevance,
and landing-page experience. Higher QS → better position for a lower bid. It's **diagnostic,
not a dial you set** — you raise it by making ads and landing pages genuinely more relevant.
Don't chase the number for its own sake; it's a symptom, not a lever.

**Check yourself:** say what smart bidding optimizes toward and why that makes a mis-set
conversion action expensive; give the rough rule for changing a target; and explain in one line
why a competitor with a lower bid can outrank you. → [T1-4](../03-projects/t1-04-conversion-action-inventory.md).

---

## Part 6 — Conversion tracking & attribution (the most important section for Brady)

A **conversion** is a valuable action — a purchase, a form fill, a phone call. Two separate
questions decide what a conversion is *worth to bidding and reporting*, and beginners conflate
them:

**1 · The platform mechanics (inside Google Ads).** Each conversion action carries settings
that quietly steer everything:

| Setting | What it decides | The trap |
|---|---|---|
| **Primary vs Secondary** | Primary actions **feed bidding**; secondary are observation-only | More than one *primary* purchase-style action is a double-count signature |
| **Count: Every vs One** | Whether 3 form fills from one person count as 3 or 1 | "Every" is right for sales, usually wrong for leads |
| **Value** | The number bidding maximizes | A `$1` placeholder makes ROAS meaningless (you'll fix exactly this on Mecco, [M-2](../03-projects/m-02-fix-the-conversion-values.md)) |
| **Attribution model + window** | How credit is split, and how far back | Google's default is **data-driven attribution (DDA)**, over a shorter window than Brady's reporting |

**2 · Brady's reporting model (outside Google Ads) — the part that trips up everyone.** This
gets a full treatment of its own in [`how-brady-measures.md`](./how-brady-measures.md) —
**read that one carefully.** The one-line version:

> **The team's reported numbers are First-Touch, 180-day, computed in BigQuery/Adobe — NOT the
> "Conversions" column in Google Ads.**

So the same order can be "paid revenue" in the team's reporting and "not a conversion" in
Google Ads, and **neither is wrong** — they answer different questions. If you quote the Google
Ads Conversions column as "our revenue," you'll be wrong and it'll show. Always say **which
source and which model** a number came from.

**Check yourself:** name the conversion-action setting that steers smart bidding; explain how
the *same* sale can be a paid conversion in one system and not the other; and say which model
Brady reports on. → [T1-4](../03-projects/t1-04-conversion-action-inventory.md),
[T2-8](../03-projects/t2-08-trace-one-click.md), and `how-brady-measures.md` in full.

---

## Part 7 — The metrics Brady lives by (learn these cold)

| Metric | Means | ⚠️ Brady-specific note |
|--------|-------|------------------------|
| **A/S** | Ad spend ÷ Sales (efficiency ratio; **lower is better**) | The headline efficiency metric; guardrails/targets in [`how-brady-measures.md`](./how-brady-measures.md). Profiles differ hugely by account — **never compare raw A/S across groups** |
| **ROAS** | Revenue ÷ ad spend (**higher is better**) | Primary for Seton/EMEDCO & PDC. First-touch-model ROAS reads lower than platform ROAS — know which you're quoting |
| **CVR** | Conversion rate (conversions ÷ clicks) | PDC Healthcare brand CVR runs high; brand and non-brand CVR are not comparable |
| **CPC** | Cost per click | **Watch the trend, not the level** — CPC inflation is a real driver of year-over-year cost growth, and Stuart wants it called out |
| **AOV** | Average order value | A budget-model lever |
| **CAC / NCA** | Cost of acquisition / New Customer Acquisition | The team tracks *new*-customer growth, not just repeat revenue |
| **per-BD** | Per business day | **Frame numbers this way when reporting up** — it's how the team normalizes month-to-month, and it's the first thing Stuart converts to in his head |
| **IS** (Impression Share) | % of eligible auctions you showed in | **⚠️ Directional only** — don't build KPIs on it. **IS lost (budget)** vs **IS lost (rank)** is the useful split: budget-lost means *give it money*, rank-lost means *fix relevance or bid* |
| **CPL / CPDL** | Cost per lead / per download-install | App / new-channel KPI |

**Worked read:** "A/S is 38% against a 40% ceiling and we're behind pace" is **not** a
cut-signal — it's *room under the ceiling with spend to give*. Reading that as "cut to protect
efficiency" is the exact reflex the team does **not** want (below).

**The mindset Brady rewards:**
- **Revenue first, then leading indicators** — non-brand quality traffic in the analytics
  platform is a favourite leading indicator watched alongside revenue.
- **The "why" is mandatory** — a directional result with no mechanism is just noise. Quant says
  *what*, qual says *why*. This is Stuart's bar, and it's how a finding survives a room.
- **One number, sourced.** Internal files disagree; "Final" in a filename means nothing —
  always say which source and which attribution model.
- **Volume-first — a guardrail is a *ceiling*, not a *target*.** Behind on pacing and still
  inside guardrail → the instinct is to **push spend**, not cut. Don't build a
  cut-to-protect-efficiency reflex; it's the opposite of what the team wants (see
  [T1-6](../03-projects/t1-06-guardrail-drill.md), [T2-4](../03-projects/t2-04-the-pacing-note.md)).

**Check yourself:** convert a monthly spend figure to per-BD in your head; say which "IS lost"
number means *give the campaign budget*; and explain why "efficiency slipped, so I cut" is the
wrong instinct here. → [T1-6](../03-projects/t1-06-guardrail-drill.md).

---

## Part 8 — The daily/weekly habits you'll actually do

Fundamentals become muscle here. Each of these is a real recurring job, not a concept:

- **Daily SQR (Search Query Report) Keep/Kill review** — *the* core daily habit, ~10 minutes.
  Triage yesterday's search terms with one question: **"could a person typing this ever be
  shopping for what we sell?"** Keep or Kill; kills become negatives. It's an **intent filter,
  not a performance review** — you are *not* asking "did it convert." Mixing those two is how
  good terms get killed for having a slow week. → [T2-1](../03-projects/t2-01-sqr-predict-then-compare.md),
  [T2-2](../03-projects/t2-02-the-same-drill-at-scale.md).
- **Weekly account-health check** — pacing vs target (per-BD), impression share (directional),
  conversion volume, and anomalies. The skill is noticing the *odd* thing, not re-reading the
  normal ones.
- **Monthly reporting** — pull your accounts' numbers and explain **what changed and why**, in
  language a non-marketer follows. The "why" is the whole job (Part 7). → [T2-4](../03-projects/t2-04-the-pacing-note.md).
- **A/B experiments** — every test needs a hypothesis, a **fair split** (a real control running
  at the same time — before-and-after is **not** a test), an honest read against pre-set guards,
  and a logged learning whether it won or lost. → [`running-a-real-test.md`](./running-a-real-test.md).

**Check yourself:** state the one question the Keep/Kill review asks — and the question it does
*not*; and say why a before-and-after comparison isn't an experiment. → [T2-1](../03-projects/t2-01-sqr-predict-then-compare.md).

---

## Part 9 — Glossary fast-start (the terms you'll hit first)

The starter set — keep [`cheat-sheet.md`](./cheat-sheet.md) open for the plain-English version
of each:

**Attribution/metrics:** A/S · ROAS · FT (First Touch) · IP (180day OD) · CVR · AOV · CAC ·
NCA · per-BD · IS · CPC · CPL/CPDL · GCLID · DDA (data-driven attribution)
**Structure:** MCC · Brand/Non-brand ([B]/[NB]) · PLA (Shopping) · PMax · DSA · RSA · Budget_Key ·
listing group · custom label
**Bidding:** tROAS · tCPA · Max Conversions/Value · Quality Score · Ad Rank · pLTV
**Process/meetings:** SQR · L10 · IDS · EOS · Rocks · Scorecard · GTM

**Don't-mix-these-up traps:** three **Alexes** (Langton is your manager; two others share the
name) · a few people named **Matt**, **Courtney** and **CJ** across the wider team — ask if a
name feels ambiguous · **MECCO ≠ EMEDCO** (easy to typo, different accounts) · the **"Seton/Emed
MCC" doesn't contain Brady US** · **keyword ≠ search term** · **primary ≠ "included in
Conversions"** (an action can be one without the other).

---

## Part 10 — Culture & tooling rules (don't learn these the hard way)

- **Google-first shop:** Gmail, Google Chat, Meet, Docs, Sheets, Drive. **No Outlook, no
  Slack.** Google Chat is primary comms, and **asking in chat the moment you're stuck is
  expected**, not a sign you're behind.
- **⚠️ Gemini is the sanctioned AI**, not other tools. **Never reference AI tooling, this repo,
  or non-sanctioned tools in corporate systems** — Google Ads scripts, GTM, shared docs,
  BigQuery SQL comments included. Using it *for real workflows* rather than as a question box is
  its own thread — see [the AI thread](../03-projects/the-ai-thread.md).
- **Jira exists** and the department uses it — but day-to-day work with Alex runs through Google
  Chat and 1:1s, not a ticket queue. **1:1s are analyst-led:** you bring the agenda.
- **Brand standards** are binding for anything customer-facing: Brady Blue `#002D72`,
  Montserrat, **AP style (no Oxford comma)**, no emojis/slang, WCAG AA. These are rules, not
  preferences — they matter in [T2-6](../03-projects/t2-06-ad-copy-audit.md).

**Check yourself:** name the sanctioned AI tool; say where a corporate-system comment must
*never* point; and state who sets the agenda for your 1:1.

---

---

## Part 11 — Finding new keywords (how to look, not just what to look at)

The rest of this doc teaches you how keywords work. This part teaches you how to find ones
you don't already have — the difference between maintaining an account and growing it.

### Keyword Planner (your first tool)

Google Ads has a built-in tool called **Keyword Planner** (under Tools & Settings → Planning).
It does two things:

1. **Discover new keywords.** Enter a product, a URL or a seed keyword and it returns
   related terms with monthly search volume, competition level and estimated CPC.
2. **Get forecasts.** Enter a list of keywords and it estimates impressions, clicks, spend
   and conversions at various bid levels.

**What to trust:** the *relative* differences between terms (Term A has 10x the volume of
Term B). **What not to trust:** the *absolute* numbers (monthly volume is a wide range, not
a point estimate, and "competition" is a 0–1 index that mixes many things together).

### Where else to look

| Source | What it gives you | Watch for |
|--------|------------------|-----------|
| **Search terms report** (your own account) | Real queries that matched your existing keywords but that you don't have as keywords yet | The best source for expansion — these are searches that already found you. Look for patterns, not individual terms |
| **Competitor ads** (Auction Insights + ad preview) | What competitors are bidding on and how they position | Don't copy-paste competitor keywords — they have different products and margins. Use it for category ideas |
| **The site itself** | Product categories, spec pages, use cases | Walk the site like a buyer. What would they search for to find each page? |
| **Customer questions** (sales team, chat logs, support tickets) | The language buyers actually use, which is often different from product names | "Cable tags" vs "wire markers" vs "cable identification labels" — the customer's word matters more than the catalog's word |

### How to evaluate a keyword opportunity

Before adding a keyword to an account, ask four things:

1. **Is there real volume?** Keyword Planner gives a range. If it says "10–100 monthly
   searches," that's not zero — but it's not going to move the needle on spend either.
2. **Is the intent B2B?** A term like `labels` has enormous volume and almost no B2B
   concentration. `thermal transfer labels` has less volume and much higher B2B intent. See
   the gray-zone section in [`who-else-is-searching.md`](./who-else-is-searching.md).
3. **Do we sell what they're looking for?** Check the site. If Brady doesn't make it or
   can't ship it, the keyword is a waste regardless of volume.
4. **Is something already catching it?** A broad-match keyword might already be serving on
   this query. Check the search terms report first — if the traffic is already arriving
   through an existing keyword, adding a new one changes routing, not reach.

---

## Part 12 — Match types on low-volume B2B terms

Part 2 taught you the mechanics of broad, phrase and exact. This part teaches the **choice**
— and the choice is different in B2B than in any consumer guide you'll read.

### The low-volume problem

Most PPC advice says "go broad with smart bidding." That advice is written for
e-commerce accounts with thousands of conversions per month. **Brady's non-brand B2B terms
often have tiny volume:**

- A keyword like `pipe marking labels osha` might get 50 searches a month.
- A campaign targeting PDC Healthcare non-brand might get 15–20 conversions a month total.
- Smart bidding needs roughly 30 conversions per month to learn effectively (and ideally
  50+).

When your conversion volume is that thin, smart bidding is flying partly blind. That changes
the match-type calculus:

### The tradeoff on low-volume terms

| Approach | Upside | Downside |
|----------|--------|----------|
| **Broad match** (with smart bidding) | Reaches searches you'd never have listed; gives the algorithm more data to learn from | On low volume, the algorithm has little signal — it may spend on queries that look related but aren't. Waste risk is higher |
| **Phrase match** | Tighter control; the queries it catches are more predictable | Misses legitimate demand you didn't think of. Smaller pool makes conversion data even thinner |
| **Exact match** | Most predictable; every query was essentially handpicked | Tiny reach. And "exact" isn't exact — close variants still fire, so you're not as precise as you think |

### What this means in practice

There is no universal right answer. But there are patterns that work at Brady:

- **Brand campaigns: exact or phrase.** Brand queries are high-intent and well-defined. You
  don't need broad to find them.
- **Non-brand, high-volume categories (signs, labels, wristbands): broad + smart bidding +
  tight negatives.** There's enough volume for the model to learn, and broad finds the
  long-tail queries you'd never list.
- **Non-brand, low-volume niche terms: phrase is often the right default.** It captures
  meaning-based variants without the wild swings that broad match produces when the model
  has thin data. Supplement with exact match on the highest-value, most-specific terms.
- **When in doubt, start tighter and open up.** You can always widen a phrase keyword to
  broad later. Going the other direction — after broad has been spending for weeks —
  requires resetting the algorithm's learning.

⚠️ **Don't change match types on a whim.** A match-type change is a bidding change — the
algorithm restarts learning. Batch them, and keep the search terms report tight for the
first two weeks after any change.

---

## Part 13 — Audiences on Search campaigns

Most people associate audiences with Display or YouTube. But **audiences work on Search
campaigns too**, and on B2B non-brand, they're an underused lever.

### Two modes: observation vs. targeting

| Mode | What it does | When to use |
|------|-------------|-------------|
| **Observation** (the default — start here) | Google collects data on how an audience performs, but ads still show to everyone. You can layer bid adjustments on top | When you want to *learn* which audiences convert before changing anything |
| **Targeting** | Ads *only* show to people in the audience | Rarely on Search. You'd use this if you only wanted to show to, say, past site visitors — but on Search, restricting reach is usually a bad trade |

**Start with observation, always.** Add audiences, let them run, look at the data after 30
days. *Then* decide if a bid adjustment is worth it.

### The audiences that matter for B2B Search

| Audience type | What it is | B2B use case |
|---------------|-----------|--------------|
| **Remarketing lists (RLSA)** | People who've visited your site before | The strongest B2B Search audience. Someone who visited Brady's pipe markers page last week and is now searching "pipe markers" is far more likely to convert than a cold searcher. Bid up on them |
| **Customer match** | Upload a list of customer emails; Google matches them | Re-engage existing customers searching for products they've bought before. Also useful as an *exclusion* — stop paying for clicks from people who are already customers if the goal is new acquisition |
| **In-market audiences** | Google's signals that someone is actively researching a product category | Google has B2B-relevant segments like "Business & Industrial" and sub-segments for specific categories. Hit rate is lower than remarketing, but reach is much wider |
| **Similar audiences** | People who behave like your existing converters | ⚠️ Google has been sunsetting these in favor of AI-driven targeting. Check current availability before building around them |

### The practical play for Brady non-brand

The highest-value move is usually:

1. Add a **remarketing audience** (all site visitors, 30-day window) to your non-brand
   Search campaigns in **observation mode**.
2. After 30 days, look at the data. Compare conversion rate and ROAS for "in audience" vs.
   "not in audience."
3. If remarketing visitors convert at 2x+ the rate of cold traffic (which is typical for
   B2B), apply a positive bid adjustment (start at +20–30% and let smart bidding incorporate
   it — though remember from Part 5 that smart bidding on tCPA/tROAS largely overrides
   manual bid adjustments, so the real value is in the *data* more than the modifier).

⚠️ **Smart bidding already factors in some of this.** If you're on tCPA or tROAS, Google's
model is already considering remarketing signals per auction. Adding an observation audience
doesn't change the bidding — it gives *you* visibility into what the model is doing. That
visibility is still valuable, because it tells you where to focus your landing page and copy
work.

---

## Part 14 — The competitive landscape (ongoing, not one-time)

[T1-10](../03-projects/t1-10-competitor-outrank-teardown.md) teaches you to do a competitor
teardown. This part teaches the **ongoing discipline** — how to read competition as a
background signal rather than a one-off exercise.

### Auction Insights (the tool)

Google Ads provides an **Auction Insights** report for Search and Shopping campaigns. It
shows you, for a given date range:

| Metric | What it tells you |
|--------|-------------------|
| **Impression share** | What % of eligible auctions you showed in |
| **Overlap rate** | How often a competitor appeared in the same auctions |
| **Outranking share** | How often your ad ranked above theirs (or showed when theirs didn't) |
| **Position above rate** | How often their ad was directly above yours |
| **Top-of-page rate** | How often each of you appeared above organic results |

### What to watch (and how often)

**Monthly, during your account review:** pull Auction Insights at the campaign level for
your largest non-brand campaigns and look for:

- **A new competitor entering.** A domain that wasn't in the report last month and is now
  showing 30%+ overlap rate is worth noting — it means someone new is bidding on your terms
  and your auction economics just changed.
- **A competitor's impression share climbing steadily.** This can signal a budget increase
  on their side, which will push up your CPCs even if you change nothing.
- **Your own impression share declining.** If your budget is flat but IS is dropping, either
  competition increased or your Ad Rank slipped (Quality Score, bid levels, or ad relevance).

### Impression share: the budget vs. rank split

When you lose impression share, Google tells you *why*. This distinction matters:

| Lost to | What it means | What to do |
|---------|---------------|-----------|
| **Budget** | You ran out of daily budget before the day ended. Eligible auctions happened; you weren't in them because the money was gone | If efficiency is inside guardrails and pacing is behind → give it more budget. This is the "push spend" instinct from Part 7 |
| **Rank** | You were eligible but your Ad Rank wasn't high enough to show. Budget was available; the competitor outbid you or had better Quality Score | Fix the Quality Score components (ad relevance, landing page, expected CTR) or raise bids — but raising bids on a rank problem without fixing quality is just paying more for the same slot |

### What *not* to do with competitive data

- **Don't react to every move.** A competitor showing up for one month and disappearing is
  noise. A competitor steadily gaining share over three months is a signal.
- **Don't match competitor bids reflexively.** If their CPA math works at a higher bid, it
  doesn't mean yours does. Different margins, different conversion rates, different
  attribution.
- **Don't bid on competitor brand names without asking Alex.** Some teams do this
  strategically; it's also expensive, often retaliatory, and sometimes a trademark issue.
  It's a team decision, not a solo one.
- **Don't ignore it either.** Competition is the main external driver of CPC inflation,
  and CPC inflation is one of the biggest drivers of year-over-year cost growth. If CPCs
  are rising and nobody can say why, Auction Insights is the first place to look.

**Check yourself:** name the two causes of lost impression share and say which one means
"give it money" vs. "fix quality"; and explain why a new competitor in Auction Insights
should change how you read CPC trends. →
[T1-10](../03-projects/t1-10-competitor-outrank-teardown.md).

---

> **Next:** the [PDC primer](./pdc-primer.md) for the accounts you'll own, and
> [`how-brady-measures.md`](./how-brady-measures.md) for the attribution model in full — the two
> files this crash course most points back to.
