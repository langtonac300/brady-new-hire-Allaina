# T2-5 · Feed-label QA

| | |
|---|---|
| **Time box** | Half a day |
| **Account** | Seton US |
| **Safety** | Read-only — you flag, you don't fix |
| **Paired or solo** | Solo, routed to Alex |
| **Deliverable** | The QA pass plus flagged rows → `04-my-work/projects/` |
| **Builds toward** | [A · Foundational paid-search skills](../05-self-assessment/baseline.md#a--foundational-paid-search-skills) |

**Read first:** Part 4 (Feeds & Shopping) of
[`ppc-fundamentals.md`](../02-learning/ppc-fundamentals.md), and
[`seton-emedco-primer.md`](../02-learning/seton-emedco-primer.md). Ask Alex for the current
feed-label reference for Seton — it lives on the manager side, not in this repo, and you'll
need it to know what the labels are *supposed* to be.

---

## The point

A **product feed** is the file that tells Google what you sell — one row per product, with
price, availability, images and so on. Shopping and PMax campaigns run off it. No feed, no
Shopping ads.

A **feed label** (you may still see it called a custom label) is a tag you attach to
products so campaigns can target subsets of them: a margin tier, a season, a product family.
It's the handle campaigns grab.

**A blank or wrong feed label doesn't produce an error.** The product just quietly fails to
land in the campaign that was supposed to have it, and the campaign quietly underdelivers.
Nothing turns red.

This isn't housekeeping. Empty feed labels are one of the named reasons Shopping and PMax
underperformed here in the past, and anything built on the feed later inherits whatever is
wrong with it now.

---

## What to do

1. Get access to Seton's **Merchant Center** — the tool where the feed lives. Ask Alex; the
   account identifier is not in this repo, and you'll need it plus permission.
2. Read the feed-label reference first, so you know the intended scheme **before** you look
   at live data. Reading the intent after the reality is how you talk yourself into
   believing whatever you find is correct.
3. Pull the live product rows and QA them against the scheme. For each row you flag:

   | Product | Label found | Label expected | Mismatch type |
   |---|---|---|---|
   | identifier | what's there now | what the scheme says | blank / wrong / inconsistent |

4. Sort your findings into three buckets — they get very different responses:

   | Bucket | Means |
   |---|---|
   | **Blank** | No label at all. Product is invisible to any campaign targeting that label |
   | **Wrong** | Labeled, but as the wrong thing. Product is in a campaign it doesn't belong in |
   | **Inconsistent** | Same kind of product labeled differently in different rows. Usually a process gap, not a typo |

5. Count and characterize. "About a fifth of rows in this category are blank" is more useful
   than a list of 300 rows nobody will read. Attach the full list as backup.
6. Route it to **Alex**. You don't fix these, and you don't take it to whoever owns the
   account yourself.

---

## ⚠️ You are not editing the feed

Merchant Center changes propagate to live Shopping ads. A well-meant label correction can
move a product into a campaign with different bids and different economics, and you will not
find out for days.

Flag, quantify, hand over. That's the whole job this time.

## ⚠️ "Inconsistent" is the most valuable bucket

Blanks and errors are individual defects — someone can fix them in an afternoon.

**Inconsistency means the process that generates labels doesn't have a rule.** Fix the rows
and they'll drift back. That's a finding about a system rather than about data, and it's the
kind of observation that's worth far more than the row count. Call it out explicitly rather
than burying it in a spreadsheet.

---

## What good looks like

- You read the intended scheme before looking at live rows, and you can say so.
- Your write-up leads with **scale and pattern**, not a raw dump. Someone should learn the
  shape of the problem in thirty seconds.
- You separated the three buckets, and you said which one you think matters most and why.
- You resisted fixing anything.
- If the reference and reality disagree in a way that suggests the *reference* is out of
  date rather than the feed, you said that too. That's a real possibility and it's worth
  more than silently trusting the document.
