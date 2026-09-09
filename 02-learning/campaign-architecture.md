# Campaign architecture — how we split campaign, ad group and keyword

This is the file to open when you're **building** rather than auditing. It covers the rules
we use to decide what becomes a campaign, what becomes an ad group, and which keywords sit
together — then walks a full worked build for **PDC Healthcare** (pdchealthcare.com) so you
can see the rules applied end to end.

> **Read [`ppc-fundamentals.md`](./ppc-fundamentals.md) Parts 1–3 first.** That file teaches
> the *skeleton* (which level owns which setting) and the naming tokens. This file teaches
> the *judgment* — where to put the cuts, and why.

---

## ⚠️ Read these three before you use anything below

1. **The worked build is a structural illustration, not a researched keyword list.** Every
   keyword below was written to demonstrate grouping. **None of it has been checked against
   search volume, and none of it has been checked against what's already live in the
   account.** Treat it as a shape to fill, not a list to paste.
2. **There is no enforced naming convention across Brady's accounts.** The convention below
   is the *Brady US* pattern, adapted. Much of the wider estate is free-form or legacy-named,
   and the EU accounts don't carry the `[B]`/`[NB]` tags at all. So this is **a standard to
   build to**, not a description of what you'll find when you open PDC. Expect the account to
   disagree with it.
3. **Confirm the product themes against the live site and the live account before you build.**
   The six themes below are drawn from what PDC Healthcare sells as described in
   [`pdc-primer.md`](./pdc-primer.md) — clinical ID and safety products, including an RFID
   line. **Open pdchealthcare.com and read the actual category navigation**, then open the
   account and list what already exists. Building a structure that duplicates live campaigns
   is worse than building nothing.

---

## Part 1 — The split rule

Almost every structure question comes down to one test: **is the thing that differs owned at
campaign level or ad group level?** Part 1 of [`ppc-fundamentals.md`](./ppc-fundamentals.md)
lists what each level owns. This is that table turned into a decision.

### Split into a new **campaign** when one of these differs

| If this differs… | …you need a campaign, because | Example on PDC |
|---|---|---|
| **Budget you need to protect** | Budget is a campaign setting. Two themes in one campaign compete for the same pot, and the higher-volume one wins by default | RFID is a slow burn; put it with wristbands and wristbands eats it |
| **Bidding target** | The strategy and its tCPA/tROAS are campaign settings | A box of wristbands and an RFID system are orders of magnitude apart in value — they can't share a target CPA |
| **The conversion that counts** | Which conversions a campaign optimizes to is set at campaign level | Wristbands = a purchase; RFID = a lead form |
| **Geo, schedule, network, language** | All campaign settings | — |
| **You need it as its own reporting line** | Anything you'll be asked "how did X do?" about should be a campaign, or you'll be rebuilding it in a pivot every month | — |
| **Match-type strategy** | Only if you're separating to stop broad eating exact's budget — see Part 3 | — |

### Split into a new **ad group** when — and only when — one of these differs

| If this differs… | …you need an ad group |
|---|---|
| **The ad copy would have to change** to answer the query honestly | Yes |
| **The landing page would have to change** | Yes |

**That's the whole list.** Everything else — a slightly different word, a different
manufacturer, a plural — is the *same* ad group.

> **The one-line version: one ad group = one promise = one page.** If two keywords can be
> answered by the same headline pointing at the same page, they belong together. If they
> can't, split them.

⚠️ **The most common new-analyst error is splitting too much, not too little.** A 40-ad-group
campaign where 30 ad groups get two clicks a week is worse than a 6-ad-group campaign — see
Part 2.

---

## Part 2 — "Tight ad groups" doesn't mean one keyword per ad group

You'll read advice online about **SKAGs** — Single Keyword Ad Groups, one keyword per ad
group. It was good advice around 2015. **It is the wrong shape now**, for three reasons that
all matter at Brady:

| Why SKAGs stopped working | What it means for you |
|---|---|
| **Close variants broke the premise.** Since exact match started catching same-meaning rewordings ([`ppc-fundamentals.md`](./ppc-fundamentals.md) Part 2), two SKAGs routinely become eligible for the *same* query. Google then picks between them on Ad Rank — so you didn't actually control which ad served, you just thought you did | The isolation SKAGs promised isn't real any more |
| **Smart bidding needs pooled data.** Part 12 of `ppc-fundamentals.md` uses **15–20 conversions a month** as the illustrative scale for PDC Healthcare non-brand — ⚠️ **check the real figure in the account before you lean on it.** At anything like that order, slice it across 40 ad groups and every one is statistically empty | Fragmenting a thin account starves the thing that's supposed to be optimizing it |
| **Maintenance cost is real** | 40 ad groups is 40 sets of RSAs to keep current, and you are one person |

**What we do instead: single-*theme* ad groups.** Five to fifteen keywords that share one
intent, one promise and one page.

| | SKAG | Single-theme ad group |
|---|---|---|
| Keywords | 1 (+ its match-type twins) | 5–15, one intent |
| Ads | Hyper-specific, brittle | Specific enough to be honest, broad enough to be true for every keyword in the group |
| Data | Fragmented | Pooled enough to read |
| Verdict | ❌ Don't build these | ✅ This is the target |

**The test for whether a group is tight enough:** write one RSA headline. If it would be a
*lie* — or just clearly irrelevant — for any keyword in the group, the group is too loose.
Split it. If it's true for all of them, you're done. (Headline mechanics live in
[`ad-copy-and-assets.md`](./ad-copy-and-assets.md).)

---

## Part 3 — The naming convention

Brady US names Search campaigns like this:

```
[B]/[NB]  -  GGL/BNG  -  US  -  <Theme>  -  <Match type>
```

Five tokens, ` - ` between them. `[B]`/`[NB]` = brand / non-brand · `GGL`/`BNG` = Google /
Microsoft. Shopping carries a `[PLA]` token instead. Applied to PDC Healthcare:

```
[NB] - GGL - US - Patient ID & Safety Bands - Phrase
```

**Why the convention earns its keep:** the tags are how spend gets classified downstream. A
campaign with no `[B]`/`[NB]` tag files as **Unclassified** in reporting — it doesn't fail
loudly, it just quietly stops being counted in the brand-vs-non-brand split that
[T1-7](../03-projects/t1-07-brand-vs-nonbrand.md) asks you to build. A name isn't cosmetic
here; it's the classifier.

### Three things to know before you use it

- ⚠️ **You will see a `BMM` suffix on older campaigns. It's a fossil.** Broad Match Modifier
  was retired by Google in 2021 and those keywords were folded into phrase match. A campaign
  called `... - BMM` today is running phrase. Don't create new ones, and don't assume the name
  tells you the match type — **check the keywords.**
- **Ad group naming isn't documented anywhere.** There's no team standard for it that this
  repo can point you at. The build below uses the plain product theme (`Patient ID
  Wristbands`), no tokens — the campaign name already carries brand, engine, geo and match.
  **Confirm with Alex before you standardize on anything**, because this is the kind of thing
  someone else may already have a preference about.
- **Match type sits at campaign level in this convention**, which is a budget-control choice:
  it stops a loose campaign spending the money you meant for a tight one. It costs you data
  fragmentation, which is exactly the trade Part 4 has to make.

---

## Part 4 — The volume test (why PDC's build isn't Brady US's build)

The split rule in Part 1 tells you where the cuts *could* go. Volume tells you how many of
them you can **afford**.

Brady US runs on a scale — hundreds of campaigns, far larger budgets — where a campaign per
theme *per match type* still leaves each one with enough conversions to be readable. **PDC
Healthcare non-brand doesn't.** At the order of magnitude Part 12 describes, a twelve-campaign
build gives you twelve campaigns you cannot draw a conclusion from, and a smart-bidding model
learning from scraps in each.

> ⚠️ **Both halves of that comparison are things to verify, not quote.** Campaign counts and
> conversion volumes live in Google Ads. Open both accounts and check before you use this
> reasoning in front of anyone.

> **The rule: split as far as the rule allows, then consolidate back until every campaign can
> carry a decision.** A structure you can't read is not a structure.

So the same six product themes that would be six campaigns on Brady US become **three
campaigns and twelve ad groups** on PDC — grouped by the two things that actually force a
campaign split here: **who buys** and **what counts as a conversion**.

### The staged rollout

Building all of it at once is how you end up unable to tell what worked. Stage it:

| Phase | What you launch | Why this order |
|---|---|---|
| **1** | Three **Phrase** campaigns, twelve ad groups, negatives attached from day one | Phrase is the right default on low-volume B2B terms ([`ppc-fundamentals.md`](./ppc-fundamentals.md) Part 12) — meaning-based reach without broad's swings on thin data |
| **2** | **Exact** carve-outs for the head terms that proved out | Two reasons: control on the terms you care most about, **and** the PMax interaction below |
| **3** | A **Broad** discovery campaign, if at all | Only once the negative library is real and there's enough conversion volume for the model to steer. This may never be justified — that's a fine outcome |

⚠️ **Don't skip straight to Phase 3 because broad "feeds the algorithm."** That advice is
written for e-commerce accounts with thousands of monthly conversions. Part 12 covers why it
doesn't transfer.

### ⚠️ The PMax interaction — this is why Phase 2 isn't optional

PDC Healthcare runs **lead-gen Performance Max alongside Search**
([`ppc-fundamentals.md`](./ppc-fundamentals.md) Part 3). Google's documented ranking behaviour
is that **PMax takes priority over a Search campaign in the same account — unless the Search
campaign has an eligible exact-match keyword identical to the query.**

Read that again, because it's the single most important structural fact on this account: on a
**phrase**-only build, PMax can outrank your Search campaign on your own target queries and
you'll see Search volume that looks mysteriously thin. **Exact-match carve-outs on your head
terms are the mechanism that holds them.**

> ⚠️ **Verify this behaviour in the account before you build a plan on it.** Confirm the
> current rule in Google's own documentation and check how the two campaign types are actually
> interacting in PDC today — this is exactly the sort of thing that changes between platform
> releases, and it's a good 1:1 question. [T1-9](../03-projects/t1-09-pmax-with-no-feed.md) is
> where you get properly acquainted with the PMax side.

---

## Part 5 — The worked build: PDC Healthcare non-brand

Three campaigns, twelve ad groups. **Structure only — see the three warnings at the top.**

### Campaign 1 — `[NB] - GGL - US - Patient ID & Safety Bands - Phrase`

Buyer: nursing and clinical leadership, patient safety, materials management. Repeat-purchase
consumables. Conversion: purchase.

| Ad group | Seed keywords (phrase) | The promise this group's ad has to make |
|---|---|---|
| `Patient ID Wristbands` | patient id wristbands · hospital patient wristbands · patient identification bands · hospital id bracelets · patient wristbands for hospitals | The core category page |
| `Barcode & Thermal Wristbands` | barcode patient wristbands · thermal patient wristbands · direct thermal wristbands · scannable patient id bands · printable patient wristbands | Print/scan compatibility — a different question from "do you sell wristbands" |
| `Alert & Allergy Bands` | allergy alert wristbands · fall risk wristbands · patient alert bands · hospital alert bracelets · color coded alert bands | Colour-coded risk communication, not identification |
| `Blood Band & Transfusion ID` | blood band wristbands · transfusion id bands · blood bank wristbands · patient blood id system | Transfusion-safety workflow — a compliance buy |
| `Infant Security & Mother-Baby` | infant security bands · mother baby matching bands · newborn id bands · infant protection bands | Different department, different page, different emotional register |

### Campaign 2 — `[NB] - GGL - US - Printers & Labels - Phrase`

Buyer: biomedical engineering and IT for the hardware; lab and pharmacy managers for the
consumables. Higher order value on printers, and a genuinely different sales motion.
Conversion: purchase, but the target has to differ from Campaign 1.

| Ad group | Seed keywords (phrase) | The promise |
|---|---|---|
| `Wristband Printers` | patient wristband printer · hospital wristband printer · thermal wristband printer · id band printer | Hardware — spec, compatibility, price |
| `Printer Supplies & Consumables` | wristband printer supplies · wristband printer cartridges · thermal wristband refills | Reorder, not evaluation. Completely different copy from the printer itself |
| `Specimen & Lab Labels` | specimen labels hospital · laboratory specimen labels · blood tube labels · lab specimen labeling | Lab workflow |
| `Medication & IV Labels` | medication labels hospital · iv line labels · anesthesia syringe labels · medication safety labels | Pharmacy / anesthesia — a different buyer again |

> **Why printers and labels share a campaign but not an ad group:** they're one campaign
> because the budget and target can reasonably be shared and neither has the volume to stand
> alone yet. They're separate ad groups because the ad and the page must differ. That is Part
> 1 and Part 4 working together — and it's the exact judgment you're being asked to learn.

### Campaign 3 — `[NB] - GGL - US - RFID & Patient Tracking - Phrase`

Buyer: IT, clinical informatics, hospital operations. Long evaluation cycle, committee
purchase. **Conversion is a lead form, not a purchase** — which is what forces it out of
Campaign 1 more than anything else.

| Ad group | Seed keywords (phrase) | The promise |
|---|---|---|
| `RFID Patient Wristbands` | rfid patient wristbands · rfid patient id bands · rfid hospital wristbands | The RFID product line |
| `Patient Tracking Systems` | patient tracking system hospital · rtls patient tracking · hospital patient flow tracking | A system, not a product — demo/consultation intent |
| `Asset & Staff Tracking` | hospital asset tracking rfid · rtls hospital asset tracking · equipment tracking hospital | Adjacent use case, different page |

⚠️ **Campaign 3 will look terrible on last-click ROAS and that may be correct.** It's lead-gen
with a long cycle — judge it on the first-touch reporting the team actually uses, and read
[`how-brady-measures.md`](./how-brady-measures.md) before you form a view. This is the same
mistake as reflex-cutting Wristbands, which [`pdc-primer.md`](./pdc-primer.md) walks through.

### And the brand campaign, for contrast

`[B] - GGL - US - PDC Healthcare - Exact` — brand queries are high-intent and well-defined, so
exact or phrase is right and broad is never needed. **PDC Healthcare's brand converts at
10–12%** ([`pdc-primer.md`](./pdc-primer.md)); if you ever see a blended non-brand + brand
number, brand is carrying it. Keeping them in separate campaigns is what lets you tell.

---

## Part 6 — Routing: negatives are structure, not just hygiene

Once you have more than one campaign, **negatives decide which campaign a query lands in.**
Get this wrong and your campaigns bid against each other, budgets go to the wrong theme, and
your reporting lines stop meaning anything.

| Route | What to add, where | Why |
|---|---|---|
| **Brand out of non-brand** | Brand terms as negatives in all three NB campaigns | Otherwise brand queries land in non-brand, and the split in [T1-7](../03-projects/t1-07-brand-vs-nonbrand.md) is fiction |
| **Printers out of Campaign 1** | `printer`, `printers` as **phrase** negatives on Campaign 1 | "patient wristband printer" can match Campaign 1's phrase keywords. Route it to Campaign 2, where the copy and page are right |
| **Exact carve-outs (Phase 2)** | The carved-out terms as exact negatives in the Phrase campaign | Otherwise the Phrase campaign competes with the Exact campaign you built to beat it |
| **Consumer / event bleed** | `party`, `festival`, `event`, `concert`, `silicone` as phrase negatives | Event and party wristbands are a completely different buyer |

⚠️ **The negative-keyword gotchas will bite you here.** Negatives don't use close variants, so
one form doesn't block the others — and an over-broad negative silently kills good traffic.
Both are covered in [`ppc-fundamentals.md`](./ppc-fundamentals.md) Part 2, and
[T2-3](../03-projects/t2-03-negative-keyword-build-v1.md) is the build itself. PDC's existing
negative coverage is thin, so you're largely starting from scratch.

### ⚠️ The cross-account question you need to ask, not answer

PDC Healthcare and PDC Wristbands are **two separate accounts on two separate domains**
([`pdc-primer.md`](./pdc-primer.md)). That means the usual "one advertiser, one ad" protection
may not apply between them the way it would inside a single account.

**Don't assume either way, and don't design around a guess.** Ask Alex or the outgoing owner
whether there's an agreed split between the two accounts on overlapping wristband terms — this
is exactly the kind of institutional knowledge the primer tells you to capture while the
handover window is open.

---

## Part 7 — Before it goes live

Structure is only half of a build. The rest:

| | Check |
|---|---|
| **Ads** | 2 RSAs minimum per ad group, and every headline true for every keyword in that group — [`ad-copy-and-assets.md`](./ad-copy-and-assets.md) |
| **Landing pages** | One page per ad group, message-matched to the promise — [`landing-pages.md`](./landing-pages.md) |
| **Tracking** | Paid search tracking runs `Channel \| Country \| Strategy \| Source \| Sub-Strategy \| Campaign \| Ad Group \| Keyword`. ⚠️ **PDC uses HubSpot and has its own templates** — confirm PDC's tab in the tracking-code workbook before you build final URLs, and check whether `hsa_*` parameters are expected |
| **Conversions** | ⚠️ **Do not build to PDC's current conversion setup without reading the landmines in [`pdc-primer.md`](./pdc-primer.md).** The real purchase action being set secondary is a known issue — a new campaign inherits that problem |
| **Time zone** | PDC is **Los Angeles**, not Chicago. It'll catch you on your first day-over-day comparison — [T1-8](../03-projects/t1-08-the-timezone-trap.md) |
| **The rest** | Run [`before-it-ships.md`](./before-it-ships.md) over the whole thing before you post it for review |

**Nothing in this file authorizes a live build.** A new campaign in a live account is a spend
decision — it goes to Alex, with the structure written down, before anything is enabled.

---

## Want to practice this?

The [campaign simulator](../06-tracker/simulation/README.md) is the one place you can build a
campaign from a blank page instead of auditing someone else's. It's a fictional company and
fake traffic, so the structure decisions in this file are the *only* thing at stake — which
makes it the right place to get them wrong the first few times.

---

## Check yourself — you can use this file when you can

- State the **two** — and only two — reasons to split an ad group.
- Say why a 40-ad-group build on PDC non-brand would be worse than a 12-ad-group one.
- Explain why **exact-match** carve-outs matter more on an account that also runs PMax.
- Name what a campaign with no `[B]`/`[NB]` tag does to downstream reporting.
- Point at the negative that stops Campaign 1 and Campaign 2 competing, and say which match
  type it needs.
- Say what you'd verify **in the account and on the site** before building any of this.

If any of those is fuzzy, that's the section to re-read — and a good thing to bring to a 1:1.
