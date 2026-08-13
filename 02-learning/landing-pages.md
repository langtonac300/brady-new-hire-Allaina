# Landing pages

What makes the page behind the ad good or bad — and how to tell.

> **Read this before [T4-1](../03-projects/t4-01-where-the-money-goes.md)** (the spend
> diagnosis) and **[T4-3](../03-projects/t4-03-the-landing-page-test.md)** (the landing page
> test). T4-1 teaches you to spot a landing-page problem in the Quality Score data; T4-3
> asks you to design a test on one. This doc teaches you what to actually look for on the
> page itself.

---

## Why landing pages matter to paid search

You pay for a click. The landing page decides whether that click does anything. A great
keyword strategy and strong ad copy that send someone to a bad page is money spent getting
people to a place that loses them.

Google also cares. **Landing-page experience** is one of the three components of Quality
Score (alongside expected CTR and ad relevance). A Below Average rating on landing-page
experience across a cluster of keywords means Google is docking your Ad Rank — you're paying
more per click for the same position, or showing in a worse position for the same bid.

**That's two costs:** the direct cost (visitors who bounce without converting) and the
auction cost (Google charging you more because the page isn't good).

---

## Message match — the most common failure

**Message match** means the page delivers what the ad promised. This sounds obvious, and
it's violated constantly.

| The ad says | The page shows | Problem |
|------------|---------------|---------|
| "Custom Arc Flash Labels" | The homepage, with a search bar | The visitor has to start over. They searched, they clicked, they landed — and now they're searching again |
| "OSHA Compliant Safety Signs" | A category page with 200 signs, none pre-filtered for OSHA | Close, but the burden is on the visitor to find what they already told you they wanted |
| "Request a Quote - Ships in 24h" | A page with no quote form visible without scrolling | The action the ad promised is hidden |

**The fix is specific landing pages for specific ad groups.** In practice, Brady doesn't
custom-build a page per keyword — but you *can* control which existing page each ad group
points at. The goal is **shortest possible path from the ad's promise to the page's
delivery.**

When you audit landing pages, start with this question: **if I were the person who typed
this search and clicked this ad, would I immediately know I'm in the right place?** If the
answer is "yes, but I'd need to scroll" or "yes, but I'd need to click again," that's a
gap.

---

## The five things to look at on any landing page

### 1. Above the fold

"Above the fold" means what the visitor sees before scrolling — the first screen. On this
screen:

- **Is the headline related to what the ad said?** Not identical, but clearly the same
  topic. If the ad was about pipe markers and the page headline says "Industrial
  Identification Solutions," that's a message-match failure dressed up in marketing
  language.
- **Is there a clear next step?** A button, a form, a phone number — whatever the
  conversion action is, it should be visible without scrolling on desktop. On mobile,
  within one thumb-scroll.
- **Is the page obviously about what they searched for?** A product image, a category
  description, a form that says "Get a Quote for [thing]." The visitor should not need to
  read body copy to confirm they're in the right place.

### 2. Page load speed

A page that takes 5 seconds to load on mobile has already lost a meaningful share of
visitors. They clicked, the page didn't load, they hit back — and you paid for that click.

**You don't need to be a developer to check this.** Search "PageSpeed Insights" and paste
the URL. The score doesn't need to be perfect, but if the mobile score is below 50, that's
a real problem worth raising — and if it's below 30, it's actively costing conversions.

Common culprits on B2B sites: oversized product images that aren't compressed, third-party
tracking scripts that load synchronously, heavy hero banners designed for desktop that
murder mobile load time.

⚠️ **You can diagnose this but you can't fix it.** Page speed is a dev/web team problem.
Your job is to surface it with the data ("this page scores 28 on mobile, and 40% of our
paid traffic to it is mobile") and let the people who own the site prioritize it.

### 3. Mobile experience

Pull up the landing page on your phone — not a resized browser window, your actual phone.

- Can you read the text without zooming?
- Can you tap the CTA button without accidentally hitting something else?
- Does the form work? Are the fields sized for a thumb, not a mouse?
- Is the most important content still above the fold, or did a desktop-first design push it
  below a giant hero image?

**At Brady, check the traffic split in Google Ads** (Devices segment) before forming an
opinion. If 60% of paid traffic to a page is mobile and the mobile experience is poor,
that's a high-priority finding. If it's 90% desktop (common for some industrial B2B
categories), a mediocre mobile experience is less urgent — still worth noting, but not the
first thing to fix.

### 4. The conversion path

Whatever you're trying to get the visitor to do — fill out a form, call, add to cart, download
a spec sheet — how many steps does it take?

| Good | Bad |
|------|-----|
| Form is on the landing page | "Contact us" link goes to a generic contact page with no reference to what they were looking at |
| Phone number is visible and tappable on mobile | Phone number is in the footer, in an image, or requires a click to reveal |
| "Request a Quote" button leads to a form pre-filled with the product category | "Request a Quote" leads to a blank form that asks what product they're interested in — which they already told you by clicking the ad |

**Every additional click between the ad and the conversion is a place where people leave.**
You won't eliminate all of them, but you should be able to count them and ask whether each
one is necessary.

### 5. Trust signals (especially in B2B)

A consumer clicks an ad for shoes and the brand barely matters. A procurement manager
clicking an ad for lockout/tagout equipment needs to trust the vendor before they'll fill
out a form or start a purchase.

Things that build trust on a B2B landing page:
- Compliance certifications and standards met (ISO, OSHA, NFPA, UL)
- Customer logos or industry references (if permitted)
- Clear return/warranty information
- A real phone number and physical address
- Product specifications, not just marketing copy

Things that destroy trust:
- Stock photos of people in hard hats that are obviously not from a real facility
- Vague claims ("industry-leading," "best-in-class") with no specifics
- A page that looks like it was built in 2012
- Broken links, missing images, "lorem ipsum" anywhere

---

## Landing pages and Quality Score

Quality Score has three components. Here's how they connect to the page:

| Component | What Google's evaluating | What you can do about it |
|-----------|------------------------|-------------------------|
| **Expected CTR** | How likely people are to click your ad | Mostly about the ad, not the page — but a known-bad page suppresses CTR over time because people learn to avoid you |
| **Ad relevance** | How closely the ad matches the search intent | About keyword-to-ad alignment. Not the page |
| **Landing-page experience** | Is the page relevant, useful, transparent and easy to navigate? | **This is the page.** Relevance to the query, mobile-friendliness, load speed, original content, clear navigation |

**When you see Below Average on landing-page experience across a cluster of keywords, that
is a page problem.** No bid change, no ad rewrite and no amount of pausing keywords will fix
it. The fix lives on the page — and if you don't own the page (which you often won't), the
fix is a clear brief to the people who do.

**What a good brief to the web team looks like:**
- Which page, which URL
- What the paid traffic looks like (volume, keywords, device split)
- What the Quality Score data shows
- What specifically seems wrong (from the five checks above)
- What you'd want different, stated as a problem to solve, not a design to implement

---

## What you own vs. what you escalate

As a paid search analyst, you own:
- **Which page each ad group points to.** You can change final URLs.
- **Diagnosing page problems** using the framework above and Quality Score data.
- **Writing the brief** that explains the problem to whoever owns the page.
- **Flagging a message-match gap** and proposing which existing page would be a better fit.

You generally don't own:
- Redesigning pages (that's web/UX).
- Fixing page speed (that's dev).
- Creating new landing pages from scratch (that's a cross-functional project).

**But you are the person most likely to notice the problem**, because you're the one looking
at the data where it shows up — Quality Score, bounce rate by landing page, conversion rate
by landing page. Diagnosing it clearly and escalating it well is a real skill, not a
consolation prize.

---

## Check yourself

- Name the three components of Quality Score and say which one is about the page.
- Explain what message match means and give an example of a failure.
- Say what you'd do if you found Below Average landing-page experience across 30 keywords
  pointing to the same URL.
- Name one thing you'd check on a landing page from your phone that you can't check from a
  desktop browser.

→ Drilled in [T4-1](../03-projects/t4-01-where-the-money-goes.md) (diagnosis) and
[T4-3](../03-projects/t4-03-the-landing-page-test.md) (test design).
