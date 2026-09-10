# Negative keywords — the mechanics

Negative keywords stop your ads showing on searches you don't want. That sentence is the easy
part. **The mechanics underneath it are genuinely counter-intuitive**, they behave differently
from positive keywords in ways that surprise everyone, and getting them wrong costs money in
both directions — wasted spend if they're too loose, lost customers if they're too tight.

This file is the *how it works*. Two companions:

| For | Read |
|---|---|
| **Deciding** whether a search term is waste — the judgment call | [`who-else-is-searching.md`](./who-else-is-searching.md) |
| **Doing** your first real build | [T2-3](../03-projects/t2-03-negative-keyword-build-v1.md), then [M-3](../03-projects/m-03-attach-and-build-the-negatives.md) |

---

## ⚠️ The three rules that catch everyone

Learn these before anything else. Each one has cost somebody real money.

1. **Negatives do not use close variants.** Positive keywords catch plurals, misspellings and
   rewordings automatically. **Negatives don't.** A negative for `wristband` does not block
   "wristbands," "wrist band," or "wristbnd." You have to add the forms.
2. **A negative always beats a positive.** If a negative blocks a query, your ad doesn't show —
   even if you're bidding on that exact word as a keyword. There is no "but I really want this
   one" override.
3. **A negative list that isn't attached to anything does nothing.** It sits there looking
   like coverage and blocks nothing at all. **This is a real condition in Brady accounts right
   now**, not a hypothetical — see the end of this file.

---

## Part 1 — The three negative match types

Same three names as positive keywords. **Different rules.**

| Type | Written | Blocks when |
|---|---|---|
| **Negative broad** | `patient wristbands` | **All** of your words appear in the query, in any order — with other words allowed |
| **Negative phrase** | `"patient wristbands"` | Your words appear **in that order**, as a run — other words allowed before/after |
| **Negative exact** | `[patient wristbands]` | The query is **exactly** that, and nothing else |

Worked against the negative `patient wristbands`:

| Search query | Broad | Phrase | Exact |
|---|:---:|:---:|:---:|
| `patient wristbands` | 🚫 | 🚫 | 🚫 |
| `cheap patient wristbands` | 🚫 | 🚫 | ✅ shows |
| `wristbands for patient` | 🚫 | ✅ shows | ✅ shows |
| `patient id wristbands` | 🚫 | ✅ shows | ✅ shows |
| `patient wristband` *(singular)* | ✅ **shows** | ✅ **shows** | ✅ **shows** |

**Read that last row again.** Nothing blocked it, at any match type, because the singular is a
different word and negatives don't do close variants.

> ⚠️ **Negative broad is not the same as positive broad.** Positive broad chases *meaning* —
> synonyms, related intents. **Negative broad does not.** It only blocks when your literal
> words are all present. So a negative broad `free` blocks "free wristbands" but will never
> block "no cost wristbands." Negatives are literal; positives are semantic.

### What this means in practice

To block a concept, you need its **forms**, not just the word:

```
"wristband"
"wristbands"
"wrist band"
"wrist bands"
```

⚠️ **This is why negative lists get long, and why that's correct.** A short list usually means
an incomplete one.

---

## Part 2 — Where negatives live (the four levels)

| Level | Applies to | Use it for |
|---|---|---|
| **Account** | Every campaign in the account | The universal ones — profanity, a competitor you never bid on. Use sparingly; it's a blunt instrument with the widest blast radius |
| **Shared list** | Every campaign you attach it to | **The workhorse.** Build themed lists once, attach to many campaigns, edit in one place |
| **Campaign** | That one campaign | Campaign-specific exclusions, and **routing** between campaigns |
| **Ad group** | That one ad group | Routing *within* a campaign — steering a query to the right ad group |

**Default to shared lists.** The alternative is the same fifty negatives pasted into thirty
campaigns and drifting apart over the next year, which is how accounts become unmaintainable.

⚠️ **A shared list attaches to campaigns, not to ad groups.** For ad-group-level exclusion you
add the negative directly.

⚠️ **There are limits** on how many negatives a campaign can hold, how many keywords fit in a
shared list, and how many lists an account can have. They're large enough that you'll rarely
hit them by hand and small enough that a scripted build can. **Check Google's current
documentation for the numbers** — they change, and a stale figure here would be worse than
none.

### Routing: negatives as structure, not just hygiene

Once you have more than one campaign, negatives decide **which** campaign a query lands in.
This is the part most people miss:

- Brand terms as negatives in your non-brand campaigns, so brand queries go to the brand
  campaign — otherwise your brand/non-brand split is fiction.
- `printer` as a negative in the wristbands campaign, so printer queries go to the printer
  campaign where the ad and page are right.
- The terms you carved into an exact-match campaign, as negatives in the phrase campaign it
  came from — otherwise the two compete.

Worked through properly in [`campaign-architecture.md`](./campaign-architecture.md) Part 6.

⚠️ **At Seton/EMEDCO some "negative" lists aren't hygiene at all — they're routing.** Deleting
one because it "looks like it's blocking good traffic" would break the account's structure.
**Read a list's contents and check what it's attached to before you touch it.**

---

## Part 3 — How negatives behave by campaign type

They don't work the same way everywhere. ([`campaign-types.md`](./campaign-types.md) covers
the types themselves.)

| Campaign type | How negatives behave |
|---|---|
| **Search** | Straightforward — block the query |
| **Shopping** | Work on queries, same as Search. Often your **only** targeting control, since there are no positive keywords |
| **DSA** (dynamic search ads) | Negative keywords block queries — but to exclude **pages** you need **negative dynamic ad targets**, which are a different control. A negative keyword will not stop DSA crawling a page |
| **Performance Max** | Historically limited to account-level negatives plus **brand exclusions**; campaign-level negative keywords were added later. ⚠️ **Check what's actually available in the account today** — this is one of the fastest-moving parts of the platform |
| **Display / Video** | A "negative keyword" is a **content exclusion** — it excludes pages and videos *about* that topic. Nobody searched anything. Different mechanism, same name |

⚠️ **Brand exclusions are not negative keywords.** They're a separate PMax control for keeping
PMax off your branded queries. If you're trying to stop PMax eating brand traffic, that's the
lever.

---

## Part 4 — The ways this goes wrong

### The over-broad negative — the expensive one

Adding `free` looks harmless. Depending on match type it also blocks **"free shipping patient
wristbands"** — someone with a purchase intent and a budget.

> **This is the single most common way a new analyst quietly kills good traffic**, and it's
> quiet because nothing breaks. There's no error. Traffic just... isn't there, and nobody
> connects it to a change made three weeks ago.

**The habit that prevents it:** for anything ambiguous, use **phrase or exact, not broad**.
Ask "what else contains this word?" before adding it.

### The conflict — a negative blocking your own keyword

If a negative blocks a query your positive keyword is bidding on, **the negative wins** and the
keyword goes quiet. Google flags some of these, but not all.

**Check for it deliberately:** before a list goes live, run your proposed negatives against the
account's *existing keyword list* and look for overlaps. This is a step in
[T2-3](../03-projects/t2-03-negative-keyword-build-v1.md) precisely because it's the one people
skip.

### Sculpting — the thing that sounds clever and isn't

Using tight negatives to force traffic into your "preferred" ad groups feels like control. In
practice it fragments conversion data across many small buckets and starves smart bidding of
the volume it needs to learn — the same problem covered in
[`campaign-architecture.md`](./campaign-architecture.md) Part 2. **Route deliberately; don't
sculpt for its own sake.** [`before-it-ships.md`](./before-it-ships.md) has a specific warning
about this.

### The smaller traps

| Trap | What happens |
|---|---|
| **Adding a negative and expecting it to be retroactive** | It isn't. It stops future impressions and changes nothing about yesterday's report |
| **Assuming the singular covers the plural** | It doesn't. Rule 1 |
| **Adding negatives without reading the search terms first** | You're blocking your guess about waste rather than actual waste |
| **A negative longer than about ten words** | Google caps negative keyword length; long ones get rejected |
| **Trusting a list by its name** | `REVIEWED - ` is the team's convention for a human-vetted list. **The name is a claim, not a guarantee** — open it |

---

## Part 5 — The workflow

Negatives are maintenance, not a project you finish.

1. **Pull the search terms report** — the account's record of what people actually typed. The
   `search-terms-export.js` script in [`06-tracker/google-ads-scripts/`](../06-tracker/google-ads-scripts/_shared-notes.md)
   does this read-only.
2. **Sort by cost, not by volume.** A term with 400 cheap clicks and no conversions matters
   less than one that quietly spent real money.
3. **Keep or kill each one**, using the judgment in
   [`who-else-is-searching.md`](./who-else-is-searching.md). ⚠️ **"Didn't convert" is not the
   same as "is waste"** — B2B cycles are long, and research-stage queries convert months later.
4. **Choose the match type** — the narrowest one that does the job.
5. **Check it against existing keywords** for conflicts.
6. **Post it for review before it ships.** Negatives are reversible, but the traffic you lose
   while one is live is not.
7. **Look at it again the next day.** Impressions dropping more than you expected is the signal
   that something is over-broad.

---

## Where Brady actually stands

Two facts worth knowing before you assume the accounts are in good shape:

- **PDC's negative coverage is thin** compared with Brady US and the EU accounts. That makes it
  a genuinely useful early contribution rather than busywork — and it's why
  [T2-3](../03-projects/t2-03-negative-keyword-build-v1.md) exists.
- **Some negative lists in Brady accounts are attached to zero campaigns.** They look like
  coverage in a list view and block nothing. Mecco's is one of them —
  [M-3](../03-projects/m-03-attach-and-build-the-negatives.md) is the project where you fix it,
  and attaching it is a two-minute change.

> ⚠️ **Verify both in the account before repeating them.** They're the state described in this
> repo, not a live reading, and the point of the projects above is that you check.

---

## Check yourself — you know this material when you can

- State why a negative for `wristband` doesn't block "wristbands."
- Say what negative **broad** actually requires before it blocks something — and why it won't
  block a synonym.
- Give the difference between negative broad and *positive* broad in one sentence.
- Name the four levels a negative can live at, and which one you should reach for by default.
- Explain what happens when a negative conflicts with one of your own keywords.
- Say what a "negative keyword" means on a Display campaign, and why it's a different thing.
- Name the control that keeps PMax off your brand terms — and why it isn't a negative keyword.
- Explain why an unattached shared list is worse than no list at all.

If any of those is fuzzy, that's the section to re-read — and a good thing to bring to a 1:1.
