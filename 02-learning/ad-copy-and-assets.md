# Ad copy and assets

How to write the things searchers actually see — and the extensions that surround them.

> **Read this before [T2-6](../03-projects/t2-06-ad-copy-audit.md)**, which is the hands-on
> audit. This doc teaches the mechanics and the thinking; T2-6 puts them to work.

---

## The ad a searcher sees

A Google Search ad is assembled from parts, not written as a unit. The format you'll work
with most is the **RSA (Responsive Search Ad)**:

| Slot | You supply | Limit |
|------|-----------|-------|
| **Headlines** | Up to 15 | 30 characters each |
| **Descriptions** | Up to 4 | 90 characters each |

Google picks a combination per auction — typically three headlines and two descriptions —
based on the query, the device, and what it's learned about performance. **You are writing
parts that must work in any order**, not one ad. That changes everything about how you think
about copy:

- Every headline needs to stand on its own *and* read well next to any other headline.
- You can't write a headline that only makes sense as a follow-up to the one before it.
- Repeating the same idea in five slightly different headlines wastes slots — Google won't
  show two that say the same thing, so you've given it fewer real options.

### Asset strength (what it means and what it doesn't)

Google rates every RSA's **ad strength** from Poor to Excellent. It's measuring *variety and
completeness of your inputs* — did you fill the slots, are the headlines distinct, do they
use different themes? It is **not** measuring whether your ad is good. An Excellent-strength
ad with weak messaging will still underperform a Good-strength ad that says the right things.

**Use it as a completeness check, not a quality score.** If strength is Poor, you probably
haven't given Google enough parts to work with. If it's Excellent but CTR is bad, the
problem is what you wrote, not how many you wrote.

### Pinning

**Pinning** locks an asset to a specific position — "always show this headline in slot 1."
It's useful exactly once: when something *must* appear every time (a required legal line, a
brand name, a price qualifier). Outside that, pinning shrinks the combination space and
defeats the point of RSAs.

**The audit question for existing pins:** is this pinned because someone decided it must
always show, or because someone wanted it to show *first* and pinning was the only tool they
knew? The second one is accumulated habit, not strategy.

---

## Writing B2B ad copy (not the same game as B2C)

Generic PPC advice says "create urgency" and "use emotional triggers." That advice is
written for consumer retail. **B2B buying — especially Brady's industrial and healthcare
products — works differently:**

| Consumer (B2C) | B2B / Brady |
|----------------|------------|
| One person decides and buys | A buyer researches, a decision-maker approves, procurement orders |
| Impulse is a real lever | Nobody impulse-buys a lockout/tagout station |
| "Limited time!" works | Artificial urgency signals "not serious" to a procurement manager |
| Emotional hooks convert | Specificity converts — *what* it is, *what standard* it meets, *what problem* it solves |

### What works in B2B headlines

**Be specific about the product, not clever about the emotion.** A facility manager
searching for `arc flash labels` wants to know you sell arc flash labels that meet NFPA 70E.
They don't want wordplay.

| Weak | Better | Why |
|------|--------|-----|
| `Protect Your Team Today` | `NFPA 70E Arc Flash Labels` | The searcher typed the standard. Reflect it back |
| `Premium Safety Solutions` | `Custom Safety Signs & Labels` | "Premium solutions" describes nothing. The specific product category matches the search |
| `Shop Now - Free Shipping!` | `Custom Sizes - Ships in 24h` | The B2B buyer cares about lead time and fit, not a retail call to action |
| `We're #1 in Safety` | `ISO & OSHA Compliant Labels` | Unverifiable claims vs. standards the buyer is already evaluating against |

### The Brady rules (non-negotiable)

These come from brand standards and they apply to every ad:

- **AP style, no Oxford comma.** "Signs, labels and tags" — not "signs, labels, and tags."
- **No emoji, no slang, no exclamation points in headlines.** The tone is authoritative and
  professional, not excited.
- **Never invent a product claim.** If you're not certain Brady makes it, sells it, or can
  deliver it, don't write it in an ad. A false claim in an ad is not a copywriting mistake —
  it's a compliance problem. Check the site.
- **Brand name consistency.** It's "Brady" — not "BRADY," not "brady," not "Brady Corp"
  unless the account specifically uses the long form.

---

## How to read asset-level performance

Google reports performance for individual headlines and descriptions with a rating:

| Rating | What it means |
|--------|---------------|
| **Best** | This asset is shown often and performs well relative to others |
| **Good** | Performs about average |
| **Low** | Underperforms relative to others in the same ad |
| **Learning** | Not enough data yet — don't touch it |

**Two things this does *not* tell you:**

1. It doesn't tell you *why* an asset performs well. "Best" might mean it gets clicks
   because it's the only headline mentioning price, not because the copy is strong.
2. It doesn't tell you what would happen if you removed the "Low" assets. Google might be
   showing them on queries where nothing else fits — removing them could lose coverage rather
   than improve performance.

**The practical habit:** review asset ratings monthly. Replace assets rated "Low" that have
been running for 60+ days — they've had enough time. Replace them with something that tests
a *different angle*, not a minor rewording.

---

## Copy testing (how to know if a change actually worked)

Swapping out three headlines and watching CTR for a week is **not a test** — it's a
before-and-after (see [`running-a-real-test.md`](./running-a-real-test.md) for why that's
unreliable). To actually test ad copy:

**Option 1: RSA asset rotation (lightweight).** Keep one RSA and swap a few assets at a time.
Use asset-level ratings to evaluate over 60+ days. This is what you'll do most often. It's
directional, not conclusive — you're reading Google's own evaluation, not running a
controlled experiment.

**Option 2: Ad variation experiment (the real test).** Google Ads lets you create an
experiment that serves the original ad to half the traffic and a modified version to the
other half. This is the proper way to test a meaningful copy hypothesis — a new value
proposition, a different CTA approach, a structural change like removing all pins.

**What to test and what not to:**
- **Worth testing:** a fundamentally different value proposition (lead time vs. compliance
  vs. customization), removing vs. keeping pins, adding a price qualifier to headlines.
- **Not worth testing:** minor word swaps ("order" vs. "buy"), punctuation, capitalization.
  These differences are too small to reach significance at B2B traffic volumes.

⚠️ **Low-volume reality check:** many Brady campaigns don't have the traffic to conclude a
copy test in a reasonable time frame. Run the power calculation *before* you launch. If it
says 120 days, that's not a test — it's a hope. Say so, and use the asset-rotation approach
instead.

---

## PMax asset groups (a different animal)

Performance Max campaigns don't use RSAs. They use **asset groups** — a broader set of
creative that Google assembles across Search, Display, YouTube, Discover, Gmail and Maps:

| Asset type | You supply | Character/size limits |
|-----------|-----------|----------------------|
| **Headlines** | Up to 5 | 30 characters |
| **Long headlines** | Up to 5 | 90 characters |
| **Descriptions** | Up to 5 (1 must be ≤60 chars) | 90 characters |
| **Images** | Up to 20 | Landscape (1200×628), square (1200×1200), portrait (960×1200) |
| **Logos** | Up to 5 | Square (1200×1200), landscape (1200×300) |
| **Videos** | Up to 5 | YouTube-hosted, ideally 10s+ |
| **Business name** | 1 | 25 characters |
| **Final URL** | 1 per asset group | Where you're sending people |

**Key differences from RSAs:**

- **Long headlines exist** — 90 characters instead of 30. These show on Display and
  Discovery surfaces. You have room to write a real sentence.
- **Images matter as much as text.** On visual surfaces, the image *is* the ad. A PMax asset
  group with strong copy and weak images will underperform everywhere except Search.
- **Videos are optional but heavily favored.** If you don't supply one, Google will
  auto-generate one from your images — and it will usually look bad. If the account has real
  video assets, use them.
- **Each asset group can target a different audience signal and landing page.** This is the
  structural tool — you use asset groups to segment by product line or buyer persona, not
  just to vary creative.

⚠️ **PDC Healthcare is lead-gen PMax — no feed, no product listings.** The asset group *is*
the entire ad. Everything above applies directly. See
[T1-9](../03-projects/t1-09-pmax-with-no-feed.md).

---

## Ad extensions (now called "assets" in Google's UI)

Extensions are the extra lines that appear below or beside your ad — site links, callouts,
phone numbers. **They're not optional extras.** Extensions expand your ad's footprint on the
page, improve Ad Rank (Google factors them into the auction), and give the searcher more
reasons to click.

**You don't pay extra for extension clicks** (except call extensions, where a click *is* the
call). They're free real estate that most competitors underuse.

### The extensions that matter at Brady

| Extension | What it does | B2B use case |
|-----------|-------------|-------------|
| **Sitelinks** | Up to 4 additional links below the ad, each with its own headline (25 chars) and two description lines (35 chars each) | Point to specific product categories, custom ordering, or a "request a quote" page. On non-brand, these let one ad serve multiple product needs |
| **Callouts** | Short phrases (25 chars) that appear as a row beneath the ad. Up to 4 show | Highlight differentiators: `Custom Sizes Available` · `Ships in 24 Hours` · `GSA Contract Holder` · `ISO 9001 Certified` |
| **Structured snippets** | A header + a list of values. Google provides the headers (Brands, Types, Services, etc.) | "Types: Arc Flash, Pipe Markers, Lockout/Tagout, Custom Signs" — lets you show breadth without using headline space |
| **Call extensions** | Adds a phone number. On mobile, it's a tap-to-call button | Useful for accounts where phone leads are a real conversion path (PDC Healthcare) |
| **Lead form extensions** | A form that opens *inside* the ad, without visiting the site | ⚠️ Use carefully. The lead quality from in-ad forms is often lower than site forms because the person never saw your page. Track and compare quality before scaling |
| **Image extensions** | A small image beside the text ad | Product photos work well for hardware/signage. Don't use generic stock photos — they look like every other ad |

### The practical approach

1. **Start with sitelinks and callouts — they're the highest-impact, lowest-risk
   extensions.** Every Search campaign at Brady should have them.
2. **Write callouts from the buyer's perspective.** Not what you're proud of ("50 Years of
   Excellence") but what the buyer is evaluating ("Custom Sizes" · "Same-Day Shipping" ·
   "OSHA Compliant").
3. **Review extensions quarterly.** They go stale faster than ad copy because nobody looks
   at them after setup. A callout that says "New 2024 Catalog" in 2026 is actively
   embarrassing.
4. **Sitelinks should point to real, useful pages** — not four links to the homepage with
   different labels. Each sitelink is a chance to match a different part of the searcher's
   intent.

---

## Check yourself

- Explain why an RSA with "Excellent" ad strength can still have bad CTR.
- Name two things that work in B2C ad copy and *don't* work for Brady's B2B buyers.
- Say when pinning a headline is defensible and when it's accumulated habit.
- Name the extension type that improves Ad Rank at zero extra cost.

→ Drilled in [T2-6](../03-projects/t2-06-ad-copy-audit.md).
