# Campaign types — what each one is, and where the ads actually show

Google Ads is not one advertising product. It's about eight of them sharing a login, and each
one **runs on a different input, shows in a different place, and breaks in a different way.**
This file is the reference for all of them: what feeds it, where it appears, what creative it
needs, and how you tell when it's misbehaving.

> **[`ppc-fundamentals.md`](./ppc-fundamentals.md) Part 3 is the one-table summary.** This file
> is the long version — open it when you need to actually reason about a campaign type rather
> than recognize its name.

---

## The one distinction that organizes everything

Every campaign type is either **pull** or **push**, and almost every wrong expectation comes
from confusing the two.

| | **Pull (intent-based)** | **Push (audience-based)** |
|---|---|---|
| **Triggered by** | Something the person typed | Something Google knows about the person |
| **Types** | Search, Shopping, DSA | Display, Demand Gen, Video |
| **The person is** | Actively looking, right now | Not looking. You interrupted them |
| **Judge it on** | Conversions, close to the click | Assisted conversions, view-through, brand lift, longer windows |
| **The classic error** | — | **Judging it on last-click revenue** and killing it |

**Performance Max spans both**, which is exactly why it's hard to reason about.

---

## Where the ads can appear (the networks)

Campaign types don't have their own real estate — they buy access to shared inventory. Worth
knowing what the two network names actually contain, because "Search Network" is bigger than
people assume:

| Network | What's in it |
|---|---|
| **Google Search Network** | Google Search itself, plus the **Shopping tab**, **Images**, **Maps**, and **Google Play**. Separately: **search partners** — non-Google sites running a Google-powered search box |
| **Google Display Network** | A very large pool of third-party sites and apps, plus **Gmail**, **YouTube** and **Discover** as placements |

⚠️ **Search partners is a setting worth checking, not accepting.** It's on by default, it
isn't Google.com, and its quality varies a lot by account. You can't exclude individual
partner sites — it's one on/off switch and one reporting row. Look at it before assuming
"Search" numbers mean Google Search.

---

## Search

| | |
|---|---|
| **Runs on** | Keywords you choose, matched to what people type |
| **Shows on** | Google Search results, plus the rest of the Search Network above |
| **Creative** | **Responsive Search Ads (RSAs)** — you supply up to 15 headlines and 4 descriptions, Google assembles combinations. Usually 3 headlines and 2 descriptions show |
| **Plus** | Assets (formerly "extensions"): sitelinks, callouts, structured snippets, call, lead form, image, price, promotion, location |
| **Bidding** | Everything — manual CPC through to tCPA/tROAS |
| **Reports** | The **search terms report** — what people actually typed |
| **Fails by** | Matching queries you never intended, silently, until someone reads the search terms report |

**The core mental model:** a keyword is a *net*, not a filter — covered properly in
[`ppc-fundamentals.md`](./ppc-fundamentals.md) Part 2.

⚠️ **Expanded Text Ads are gone.** Google stopped letting anyone create them in June 2022, so
RSAs are the only text ad format you can build. If you find an ETA still running in an old
campaign, it's a survivor, not a template.

---

## Dynamic Search Ads (DSA)

| | |
|---|---|
| **Runs on** | **Your website's content.** No keywords at all — Google crawls your site (or a page feed you supply) and matches pages to queries |
| **Shows on** | Search results, same as Search |
| **Creative** | Google **generates the headline** from the page and the query. You write only the description |
| **Targeted by** | Categories, specific URLs, page feeds, or "all web pages" |
| **Fails by** | Roaming the whole site — serving on your careers page, your blog, out-of-stock products |

**Where it earns its place:** catalogue coverage. When you sell thousands of SKUs, DSA finds
the long tail you'd never build keywords for. At Brady it's used on Seton US for category
coverage.

⚠️ **Never point DSA at "all web pages" and walk away.** Use a page feed to steer it, and give
it its own negatives. It also needs **negative dynamic ad targets** to exclude pages — those
are a separate control from negative keywords, and blocking a page needs the page-level one.

---

## Shopping (PLA)

| | |
|---|---|
| **Runs on** | A **product feed** in Google Merchant Center — one row per product with title, price, image, availability, custom labels |
| **Shows on** | The Shopping tab, Search results, Images, and Google's shopping surfaces |
| **Creative** | **There isn't any.** The ad *is* the feed row — image, title, price, merchant name. You cannot write a Shopping ad |
| **Targeted by** | The feed plus **listing groups** — no keywords. You influence matching through feed content and negatives only |
| **Fails by** | Feed problems: disapprovals, missing GTINs, stale prices, out-of-stock items |

> **The single most useful Shopping instinct: "no products showing" is a feed problem until
> proven otherwise.** Bids and budget are the *second* place to look, not the first. Because
> the feed is the creative, **feed quality — especially the title — is your main lever.** You
> optimize a Shopping campaign by editing product data, not ad copy.

⚠️ **Smart Shopping no longer exists.** Google migrated every Smart Shopping campaign into
Performance Max during 2022. "Standard Shopping" is what remains. If a document or an old
report mentions Smart Shopping, it's describing something that was replaced.

**At Brady:** Brady and Seton run Shopping. ⚠️ **PDC's product listings serve inside PMax, not
as standalone Shopping campaigns** — so don't go looking for a Shopping campaign in PDC and
conclude something is broken.

---

## Performance Max

**One campaign that buys nearly every Google surface at once** — Search, Shopping, YouTube,
Display, Discover, Gmail and Maps — with Google deciding the split.

| | |
|---|---|
| **Runs on** | Asset groups, audience signals, and (if retail) a product feed |
| **Shows on** | All of the above |
| **Creative** | Headlines, descriptions, images, logos, video. ⚠️ **If you don't supply video, Google auto-generates one from your assets** |
| **Bidding** | Smart bidding only — tCPA or tROAS. There is no manual option |
| **Fails by** | Being un-diagnosable: reporting is far thinner than Search, and much of the placement detail simply isn't exposed |

### The two flavours — this distinction matters more than any other here

| | **Retail PMax** | **Lead-gen PMax** |
|---|---|---|
| **Feed** | Yes — Merchant Center | **None** |
| **Structured by** | Listing groups (which products) | Asset groups (which creative + which signal) |
| **When it breaks, look at** | The feed | Assets, audience signals, final URLs |
| **At Brady** | PDC **Wristbands** | PDC **Healthcare** |

**Audience signals are hints, not targeting.** They tell Google where to start looking; they
do not restrict who sees the ad. Treating a signal as a targeting rule is a standard
misreading, and it's why PMax reach so often looks "wrong."

**Final URL expansion** lets Google send traffic to pages it picks from your site rather than
the ones you nominated. It's on unless you turn it off.

### ⚠️ Two PMax behaviours to know before you build alongside it

1. **PMax cannibalizes brand Search.** Left alone it will happily serve on your own branded
   queries and take the credit. **Brand exclusions** are the control.
2. **PMax generally takes priority over Search campaigns in the same account — unless the
   Search campaign has an eligible exact-match keyword matching the query.** This is why
   exact-match carve-outs matter so much on an account that runs both, and it's covered in
   [`campaign-architecture.md`](./campaign-architecture.md) Part 4.

> ⚠️ **Verify both in Google's current documentation before you build a plan on them.** PMax
> changes faster than any other campaign type — behaviour, reporting and controls have all
> moved repeatedly since launch. [T1-9](../03-projects/t1-09-pmax-with-no-feed.md) is where you
> get properly acquainted with it.

---

## Demand Gen

| | |
|---|---|
| **Runs on** | **Audiences.** No keywords |
| **Shows on** | **YouTube** (in-feed, in-stream, Shorts), **Discover**, and **Gmail** |
| **Creative** | Image and video, presented like social content rather than like ads |
| **Bidding** | Smart bidding, including bidding toward clicks or conversions |
| **Fails by** | Being measured like Search |

**This is the type most likely to be wrongly killed.** It's upper-funnel: people see it while
scrolling, not while shopping. Its job is to create demand that shows up later — often as a
branded search someone else gets last-click credit for.

⚠️ **Demand Gen replaced Discovery campaigns** (the migration completed during 2024), adding
Shorts and in-stream inventory. Older material calling it "Discovery" is describing the
predecessor.

**At Brady:** PDC Healthcare runs Demand Gen. Read
[`how-brady-measures.md`](./how-brady-measures.md) before forming any view on its performance —
the first-touch model the team reports on treats it very differently from last-click.

---

## Display

| | |
|---|---|
| **Runs on** | Audiences, topics, placements, or keywords used **contextually** (page content, not queries) |
| **Shows on** | The Display Network — third-party sites and apps, plus Gmail and YouTube placements |
| **Creative** | **Responsive display ads** — images, logos, headlines, descriptions that Google recombines to fit any slot. Uploaded fixed-size banners are also possible |
| **Fails by** | Cheap clicks that mean nothing, junk app placements, and accidental clicks on mobile |

⚠️ **Keywords on Display do not mean what they mean on Search.** A Display keyword describes
the *page* you want to appear next to, not something a person typed. Nobody searched anything.

**At Brady:** there's a separate Brady US Display account. ⚠️ **It has recorded zero tracked
conversions** — which is a measurement question before it's a performance question. Worth
understanding why before quoting anything from it.

---

## Video (YouTube)

| | |
|---|---|
| **Runs on** | Audiences, topics, placements, keywords (contextual) |
| **Shows on** | YouTube, and video partners on the Display Network |
| **Creative** | A hosted YouTube video |

The formats, because "a video ad" isn't one thing:

| Format | Length / behaviour | Charged when |
|---|---|---|
| **Skippable in-stream** | Skippable after 5 seconds | Someone watches 30s (or the whole thing if shorter), or interacts |
| **Non-skippable in-stream** | Up to 15 seconds, no skip | Impressions (CPM) |
| **Bumper** | 6 seconds, no skip | Impressions (CPM) |
| **In-feed** | A thumbnail in search/watch-next/home | Someone clicks to watch |
| **Shorts** | Vertical, in the Shorts feed | Varies by objective |
| **Masthead** | The YouTube homepage banner — reserved, booked with a rep | Fixed / CPM |

⚠️ **A "view" is a defined event, not a synonym for an impression.** On skippable in-stream
it's 30 seconds or an interaction. When someone reports "views," find out which metric they
mean before you compare it to anything.

---

## App

| | |
|---|---|
| **Runs on** | Your app listing. Google generates most of the targeting |
| **Shows on** | Search, Play, YouTube, Display, Discover |
| **Optimizes for** | Installs, in-app actions, or in-app value |
| **Fails by** | Cheap installs from people who never open the app again |

⚠️ **At Brady this one distorts a number you'll otherwise trust.** The BradyScan app campaign
books installs as conversions at a nominal $1 each, inside Brady US non-brand. That inflates
non-brand conversion counts and drags the average conversion value down. If a non-brand
conversion number looks surprisingly healthy, check whether app installs are in it — this is
exactly the kind of thing [T1-12](../03-projects/t1-12-dont-clean-that-up.md) is about.

---

## The comparison table

| Type | Input | Where it shows | Creative | Keywords? | Feed? |
|---|---|---|---|---|---|
| **Search** | Keywords | Search Network | RSAs | ✅ | ❌ |
| **DSA** | Your site / page feed | Search Network | Auto headline | ❌ | Page feed |
| **Shopping** | Product feed | Shopping tab, Search | The feed row | ❌ | ✅ Required |
| **PMax (retail)** | Feed + assets | Everywhere | Assets + feed | ❌ | ✅ |
| **PMax (lead-gen)** | Assets + signals | Everywhere | Assets | ❌ | ❌ |
| **Demand Gen** | Audiences | YouTube, Discover, Gmail | Image + video | ❌ | ❌ |
| **Display** | Audiences / placements | Display Network | Responsive display | Contextual only | ❌ |
| **Video** | Audiences / placements | YouTube | Video | Contextual only | ❌ |
| **App** | App listing | Search, Play, YouTube, Display | Mostly automated | ❌ | ❌ |

---

## Which types exist where at Brady

| Account | Types running |
|---|---|
| **PDC Healthcare** | Search + **lead-gen** PMax + Demand Gen |
| **PDC Wristbands** | **Retail** PMax-led |
| **Brady US** | Search + Shopping |
| **Seton US** | Search + Shopping + **DSA** for category coverage |
| **Brady US Display** | Display ⚠️ zero tracked conversions |
| **Mecco** | Search only — all non-brand exact/phrase |

> ⚠️ **This table is a starting map, not ground truth.** Accounts change, and this repo isn't
> the live system. Confirm what's actually running in Google Ads —
> [T1-1](../03-projects/t1-01-account-tour.md) is that exercise.

---

## Check yourself — you know this material when you can

- Say which types are **pull** and which are **push**, and what changes about how you judge them.
- Name what's in the **Search Network** besides Google Search.
- Explain why you can't write a Shopping ad, and what you optimize instead.
- Give the difference between **retail** and **lead-gen** PMax, and where you'd look first when
  each one misbehaves.
- Explain what an **audience signal** does and does not do.
- Say what a Display "keyword" targets, and why it isn't a search.
- Say what a YouTube **view** actually is.
- Name the campaign type that distorts Brady US non-brand conversion counts, and how.

If any of those is fuzzy, that's the section to re-read — and a good thing to bring to a 1:1.
