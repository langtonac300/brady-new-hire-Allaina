# Cheat Sheet — keep this tab open

The ~30 terms you'll actually use, in **plain English** (not cross-references), plus
worked examples of the two things everyone gets wrong at first.

> If you remember nothing else: **the number in Google Ads is almost never the number we
> report.** See Worked Example 1.

---

## The metrics (what "good" looks like)

| Term | Plain English | Good = |
|------|---------------|--------|
| **A/S** | Ad **S**pend ÷ **S**ales. "For every $1 of sales, how much did we spend on ads?" | **Lower.** Brady blended and Seton/EMEDCO run to different guardrails — see [`how-brady-measures.md`](./how-brady-measures.md) |
| **ROAS** | Revenue ÷ ad spend. The flip side of A/S. "$3 back for every $1 in." | **Higher.** PDC Healthcare and Wristbands run to very different targets — see [`pdc-primer.md`](./pdc-primer.md) |
| **CVR** | Conversion rate — % of clicks that convert | Higher. PDC Healthcare brand runs 10–12% |
| **CPC** | Cost per click | Lower, but watch the trend — CPC inflation is a real driver of cost growth |
| **AOV** | Average order value | — |
| **CAC** | Cost to acquire one customer | Lower |
| **NCA** | New customer acquisition (net-new buyers) | Higher — a metric the team watches closely |
| **per-BD** | "Per business day." A lot of Brady reporting normalizes everything by business days | Frame numbers this way when reporting up |
| **IS** | Impression share — % of possible impressions you got | **Directional only** — don't set goals on it |
| **CPL / CPDL** | Cost per lead / per download-install | Lower |

## Attribution (how a sale gets credited to ads)

| Term | Plain English |
|------|---------------|
| **FT (First Touch)** | Credit the **first** paid click a customer ever made, up to 180 days before the sale. **This is our main reported model.** |
| **IP ("180day OD")** | A multi-touch view used only for Brady US Non-brand |
| **GCLID** | The invisible tag on a click that lets us follow it into our data. Tracks fine online; the gap is when a lead closes *offline* via a salesperson |
| **Platform "Conversions"** | The Conversions column *inside* Google Ads. ⚠️ Uses a shorter window and lives in a different place — **it does not match our reported revenue.** Always say which one you mean |

## Structure & campaign types

| Term | Plain English |
|------|---------------|
| **MCC** | A manager account that holds many ad accounts. ⚠️ "Brady US - MCC (Seton/Emed)" does **not** contain Brady US — it holds Seton/EMEDCO. Brady US + both PDC accounts are in **Brady Global MCC** |
| **Brand / Non-brand ([B]/[NB])** | Searches *for us by name* vs. *for what we sell*. The core split |
| **Keyword** | A term you bid on to *match* searches (not the search itself) |
| **Search term** | What the person *actually typed*. The gap between keyword and search term is where wasted spend hides |
| **Shopping / PLA** | Product listings (image + price) from a product feed |
| **PMax** | Google-automated campaign across all its surfaces. **Retail PMax** uses a product feed; **lead-gen PMax** (like PDC Healthcare) uses assets + audiences and has **no feed** |
| **DSA** | Dynamic Search Ads — Google builds targeting from your website |
| **DemandGen** | Visual/awareness campaigns (YouTube/Discover/Gmail) |

## Bidding

| Term | Plain English |
|------|---------------|
| **Manual CPC** | You set the max bid per click |
| **Smart bidding** | Google sets bids per auction toward a goal. ⚠️ It optimizes toward whatever conversion action is set **PRIMARY** — set the wrong one primary and it chases the wrong thing |
| **tROAS** | "Target ROAS" — smart bidding aimed at a return target |
| **tCPA** | "Target CPA" — aimed at a cost-per-conversion target |
| **PDC note** | PDC is **already fully on smart bidding** — your lever is the target/budget, not manual bids |

## Process & meetings

| Term | Plain English |
|------|---------------|
| **SQR review** | The daily 10-min "Keep/Kill" of yesterday's search terms — an *intent* filter (see Example 2) |
| **L10** | The weekly team huddle, EOS "Level 10" format |
| **IDS** | Identify-Discuss-Solve — the problem-solving core of the L10 |
| **Rocks** | Quarterly priorities · **Scorecard** = the weekly numbers read in L10 |
| **GTM** | Google Tag Manager — where conversion tags live |

## Don't-mix-these-up

**MECCO ≠ EMEDCO** (easy to typo) · **WBC** = Wristbands.com · **HPS** = the PDC/Healthcare
group of accounts. A few names repeat across the wider team (more than one Alex, Matt,
Courtney, CJ) — if a name feels ambiguous in a conversation, just ask which one.

---

## Worked Example 1 — why Google Ads and our reports disagree (the #1 thing to get)

A hospital buyer's real journey to a Wristbands.com order:

```
Day 1   Clicks a Google paid ad  ← FIRST TOUCH (paid)
Day 8   Comes back via an email link
Day 20  Comes back via organic search
Day 41  Places the $2,000 order
```

- **Our reported model (First-Touch, 180-day):** the sale is credited to the **Day-1 paid
  click**, because the order (Day 41) is within 180 days of it. Paid gets the credit.
- **Google Ads platform "Conversions":** may credit the order differently (data-driven,
  ≤90-day window) — or, if the last click was organic/email, **may not show this sale at
  all.**

**So the same order can be "paid revenue" in our reporting and "not a conversion" in
Google Ads.** Neither is lying — they're different rules. That's why you **always say
which source and model a number came from.** If you quote the Google Ads Conversions
column as "our revenue," it will be wrong and it will show.

## Worked Example 2 — a Keep/Kill (SQR) mini-round

You're reviewing yesterday's Wristbands.com search terms. The question is **only**: *could
a person typing this ever be shopping for what we sell?* (Not "did it convert" — that's a
different job.)

| Search term | Keep or Kill? | Why (one line) |
|-------------|---------------|----------------|
| `hospital patient id wristbands` | ✅ Keep | Exactly what we sell |
| `waterproof event wristbands bulk` | ✅ Keep | We sell event bands; commercial intent |
| `how to remove a hospital bracelet` | ❌ Kill | Wrong intent — they want it *off*, not to buy |
| `free printable wristband template` | ❌ Kill | Wants a freebie, not a purchase |
| `24 hour wristbands coupon` | ❌ Kill | Shopping for a **competitor** by name |

Kills go onto the negative-keyword list so ads stop showing on them. Notice you can decide
every row **without looking at cost or conversions** — it's about *intent*.

## Worked Example 3 — a good "why" vs. a bad one

Same fact, two write-ups:

- 🔴 **Bad:** "PDC Healthcare leads were down 15% last month."
- 🟢 **Good:** "PDC Healthcare form leads fell 15% MoM (−4/BD). Driver: the Merchant
  Center feed lapsed for a week, so Shopping impressions dropped sharply for that stretch;
  leads recovered once the feed was restored. Not a demand problem — a feed outage."

The good version says **what**, then **why**, normalized **per-BD**, with the mechanism
named. Always aim for the second one.
