# PDC Primer — everything you need about the accounts you're taking over

This is the crash course on **PDC** (the "HPS" account group): what the business is, the
two Google Ads accounts, the tech/feed/tracking quirks that make PDC different from
everything else at Brady, and the landmines to know about before you touch anything live.

> When you learn something new about PDC that isn't captured here, **update this file** —
> it's meant to outlast whoever currently holds the knowledge in their head.

---

## ⚠️ The two things to internalize first

1. **PDC's FY27 scope is being finalized above the team.** This is **Alex's to resolve,
   not yours to worry about** — the practical takeaway for you is just: focus on
   **transferable skills** and don't sink weeks into long-horizon PDC bets until Alex says
   the scope is settled. Your skills are valuable on any account.
2. **Wristbands.com is a different technology stack from everything else at Brady**
   (Shopify + Analyzify + HubSpot, not the systems the rest of the team uses). Its feed,
   tracking, and conversion setup all behave differently. This is the single steepest
   part of the PDC learning curve — budget real time for it.

---

## What PDC is (the business)

**PDC = the Healthcare arm of Brady** — one of the company's revenue pillars alongside
industrial and safety products. In marketing it shows up as the **"HPS"** group — a
deck section, a data segment, an org/creative grouping, and its own SEO lane (Phil covers
Healthcare — see [`../01-start-here/how-the-ramp-works.md`](../01-start-here/how-the-ramp-works.md)).

Three brands sit under the same PDC cost center:

| Brand | Site | What it sells | Notes |
|-------|------|---------------|-------|
| **PDC Healthcare** | pdchealthcare.com | Clinical/hospital ID & safety products (incl. an **RFID** line) | Brand CVR high (10–12%). Search + PMax + DemandGen + a dedicated LinkedIn program |
| **PDC Wristbands** | Wristbands.com ("WBC") | Patient-ID / event wristbands e-commerce | PMax-led, lead-gen heavy, low direct ROAS by design |
| **Identicard** | (US + CA) | ID card / credential products | Small; recently started |

**PDC Healthcare's audience is genuinely different from industrial Brady** — think
nursing & clinical leadership, IT, supply chain/procurement, and informatics/EHR buyers.
You're marketing to hospitals, not factories.

---

## The two Google Ads accounts (ground truth)

Both live in the **Brady Global MCC** — **not** the confusingly-named "Brady US - MCC
(Seton/Emed)."

| Account | Currency / TZ | Shape |
|---------|---------------|-------|
| **PDC: Healthcare** | USD / **Los Angeles** | Search + PMax + DemandGen |
| **PDC: Wristbands** | USD / **Los Angeles** | PMax-led |

Quirks that will trip you up:
- **Los Angeles timezone** on both — daily reporting cutoffs differ from the Chicago-based
  Brady accounts. Watch this when comparing day-over-day numbers.
- **Wristbands is its own standalone account**, not a sub-account of Healthcare.
- **PDC uses HubSpot** for marketing automation — the rest of Brady uses different systems.
  If you see `hsa_*` in a URL template, that's PDC.
- **Named-competitor bidding (Wristbands only):** the account explicitly bids to outrank
  two specific competitors by name. You won't see this tactic anywhere else on the team —
  and *how* it's implemented isn't obvious (you'll work that out in
  [T1-10](../03-projects/t1-10-competitor-outrank-teardown.md)).
- **Negatives are thin** on PDC — light shared-list coverage compared to Brady US/UK.
  Building them out is a good, safe early project —
  [T2-3](../03-projects/t2-03-negative-keyword-build-v1.md) is that build.

---

## The tech stack — where PDC diverges (study this table)

| Dimension | Rest of Brady | **PDC** |
|-----------|---------------|---------|
| Shopping feed | Managed by the internal dev team (Brady) / Feedonomics (Seton) | HC = managed by the internal dev team; **WB = Shopify + Analyzify** (unique) |
| Website CMS | A shared platform for bradyid.com | **pdchealthcare.com**; **Wristbands.com on Shopify** |
| Marketing automation | A different platform for the rest of the team | **HubSpot** |
| Bidding maturity | Brady mid-migration to smart bidding | **Already fully on smart bidding** — PDC is the team's finished proof case |
| Purchase tracking | Standard analytics / upload feeds | HC = standard tracking; **WB = Analyzify (Shopify) purchase events** |

**Bidding takeaway:** unlike Brady US (mid-migration from manual CPC to tROAS), **PDC is
already fully on smart bidding (tROAS/PMax).** There's no manual-bidding legacy to unwind.

---

## ⚠️ Tracking & conversion landmines (do not trust platform "Conversions" until you check these)

> **If you're about to do [T1-4](../03-projects/t1-04-conversion-action-inventory.md), stop
> here.** That project asks you to form your *own* read of PDC's conversion setup before you
> see the answer — and this section **is** the answer. Do T1-4's steps first, then come back
> and compare. The gap between your read and this list is the most useful thing you'll produce
> that week. (Same for [T3-1](../03-projects/t3-01-first-conversion-tracking-pass.md), the
> deeper pass.)

The reported team numbers are **First-Touch, 180-day — not Google Ads platform
Conversions** (full explanation in [`how-brady-measures.md`](./how-brady-measures.md)). On
top of that general rule, PDC has its own specific config issues:

1. **PDC Healthcare: the real purchase action is set SECONDARY**, while older legacy
   goals are **PRIMARY.** That means **smart bidding may be optimizing to the wrong
   thing.** This is the highest-value fix on PDC. ⚠️ As the new analyst you **diagnose and
   document** this; the live flip is executed by **Alex or a senior**, gated behind a
   proper conversion audit — you don't re-point a live smart-bidding account at numbers
   that haven't been verified.
2. **PDC Wristbands (Shopify stack): two purchase-tracking actions overlap, and the
   de-duplication between them hasn't been verified.** Possible double-count exposure.
3. **PDC and the Shopify container haven't had a full tag-management audit yet.** Until
   that's done, treat PDC platform conversion data with caution.

**Why the deck ROAS looks so much worse than platform ROAS:** the first-touch model credits
only the first paid touch, and PDC (especially Wristbands, a lead-gen storefront) has long,
multi-touch journeys. Wristbands' first-touch ROAS running well below platform ROAS is
*expected*, not a fire — it's lead-gen, not direct-response. Don't panic-cut it on that
number alone.

> **Worked judgment — "Wristbands ROAS looks terrible, should we cut?"** Walk it in order:
> **(1) Which number?** First-touch or platform — they differ a lot here, so pin down which
> one raised the alarm. **(2) Which profile?** Wristbands is lead-gen by design; a low direct
> ROAS is its expected shape, not a failure. **(3) Inside its guardrail?** If efficiency is
> within guardrail and pacing is behind, the instinct at Brady is **push, not cut** (see
> [`how-brady-measures.md`](./how-brady-measures.md)). Only after all three does "cut" get on
> the table at all. Reflex-cutting a scary-looking ROAS is the most common wrong move on this
> account.

---

## Open items you're likely to inherit (the PDC backlog)

1. **FY27 fate of PDC paid search** — unresolved (see the note at the top of this file).
2. **PDC Healthcare Merchant Center feed issue** — open since mid-2026, with no clear
   owner of the fix yet. Route feed questions to the **internal dev team**.
3. **PDC + Wristbands tag-management audit** — still pending; see the landmines above.
4. **LinkedIn PDC feed** — worth verifying it's actually delivering data, not silently
   broken.
5. **Thin negative-keyword coverage** — a safe, useful early build-out.

---

## The handover (capture it early — the window is short)

PDC's outgoing owner is transitioning onto Seton/EMEDCO, and holds a lot of institutional
memory about how PDC reached full smart bidding. The overlap window is short, so **capture
the knowledge early and in writing**, and build a **direct line to the internal dev team**
for anything about feeds/Merchant Center. Alex books and records capture sessions — your
job in those is to transcribe and organize what you hear.

**What to capture while you can:**
- How the Wristbands Shopify/Analyzify feed + purchase tracking works, and who owns each
  piece.
- The state of the PDC Healthcare feed issue and who's on it.
- Account-specific history: why campaigns are structured the way they are, what's been
  tried, what the competitor-outrank strategy is doing.
- Login/access paths and any account-level settings quirks (LA timezone, HubSpot
  templates).

---

## How PDC differs from Brady US / Seton / EMEDCO (the one-screen summary)

- **Same MCC as Brady** (Global), **not** with Seton/EMEDCO — despite being a separate
  division.
- **LA timezone**, HubSpot automation, and (for Wristbands) a **Shopify/Analyzify stack**
  — three things that exist *nowhere else* on the team.
- **Already fully smart-bidding** — no manual legacy to migrate.
- **Different efficiency logic** — Wristbands is intentionally low-direct-ROAS lead-gen;
  Healthcare is high-CVR brand. Judge each by its own profile, not Brady's.
- **Under a strategic cloud** — the whole assignment's FY27 scope is being decided above
  the team.

---

## Check yourself — you're ready to open PDC when you can

- Say which MCC holds PDC, and which **similarly-named** one does *not*.
- Name the **three things** about PDC that exist nowhere else on the team.
- Explain your main **bidding lever** on PDC, given it's already fully smart-bidding.
- Read a scary-looking **Wristbands ROAS** without reaching for the cut button — and name the
  three checks you run first.
- Say why the tracking landmines above are **gated behind T1-4** rather than handed to you.

If any of those is fuzzy, that's the section to re-read — and a good thing to raise in a 1:1.

Read this alongside [`ppc-fundamentals.md`](./ppc-fundamentals.md) (the general skills) —
this primer is the PDC-specific layer on top of it.
