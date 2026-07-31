# What a deliverable looks like

Nearly every project asks you to produce something — "a one-page structure map," "an
annotated 30-row list," "five lines." **You've never seen one of those**, which makes the
first few a guessing game. This file removes the guessing.

> ## ⚠️ The account below is invented
>
> **"Northwind Safety Supply" is not a Brady account and none of these numbers are real.**
> They were made up for this example, deliberately, so that nothing in here can ever be
> mistaken for a real figure or quoted by accident.
>
> This is the one place in the repo where you'll see fabricated numbers, and it's labeled
> this loudly on purpose. **Everywhere else, a number you can't source is a number you
> don't use.**

---

## Worked example — a structure map

This is the T1-1 deliverable: open an account, list what's actually spending, and describe
what it's doing.

### Northwind Safety Supply — account structure, last 30 days

*Pulled 12 Mar, last 30 days, sorted by cost. Paused campaigns excluded.*

| Campaign | Type | Bidding | Optimizing to | Brand / NB |
|---|---|---|---|---|
| NW-GGL-US-[B]-Core | Search | tROAS, target 600% | Online purchase (primary) | Brand |
| NW-GGL-US-[NB]-Signage | Search | tROAS, target 350% | Online purchase (primary) | Non-brand |
| NW-GGL-US-[NB]-LOTO | Search | Max conversions, no target | Online purchase + **Quote request** | Non-brand |
| NW-GGL-US-PMax-Retail | PMax (retail, feed) | tROAS, target 400% | Online purchase (primary) | Mixed |
| NW-GGL-US-[NB]-DSA | DSA | Max clicks | Online purchase (primary) | Non-brand |

**How I told brand from non-brand:** the `[B]`/`[NB]` tag in the campaign name, checked
against the keywords — the brand campaign is all variations of the company name, and the
non-brand ones don't contain it anywhere. The PMax campaign is marked mixed because it has
no keywords to check and its search themes cover both.

**What this account is trying to do:** drive online purchases of safety signage and
lockout/tagout products, mostly through non-brand search, with a brand campaign defending
the name cheaply.

**How I'd know if it stopped:** purchase volume on the two non-brand search campaigns is the
number to watch. Brand would keep converting for a while even if non-brand collapsed, so
total account conversions would hide the problem for a few weeks.

### ⚠️ Three things I noticed but didn't chase

1. **The LOTO campaign is optimizing to two actions**, one of which is a quote request. A
   quote and a purchase aren't worth the same, so I'd want to know whether that's deliberate.
2. **The DSA campaign is on Max clicks** while everything else is on a value target. That
   might be intentional for coverage, but it means it's chasing traffic rather than revenue.
3. **PMax has no target on its brand exclusions** that I could find, so it may be absorbing
   brand traffic the brand campaign is also paying for.

---

## Why that's a good deliverable

| It does this | Which matters because |
|---|---|
| **Says when and how it was pulled** — date, window, what was excluded | Without that, nobody can reproduce it or tell whether it's stale. This one line is the difference between a document and a screenshot |
| **Every column filled, including the hard one** | "Optimizing to" is the one people skip because it takes an extra click. It's also the one that matters most on an account that's already on smart bidding |
| **Shows the reasoning, not just the answer** | "How I told brand from non-brand" is one sentence and it lets a reader catch you being wrong |
| **Answers the question that was actually asked** | The brief asked for two sentences on what the account is doing and how you'd know if it stopped. They're there, at the end, in plain language |
| **Separates observations from conclusions** | The three noticed-but-didn't-chase items are flagged as questions, not findings. That's honest and it's also how you build a list of things worth doing next |

---

## The weak version of the same thing

For contrast — this is what it looks like when someone does the work but not the thinking:

> *"The account has 5 active campaigns. There are search campaigns, a PMax campaign and a
> DSA campaign. Most use tROAS bidding. Brand and non-brand are both present. Overall the
> account is performing reasonably well."*

Everything in it is true. It is also almost useless:

- **No date and no window** — is this today or a month ago?
- **Nothing is per-campaign**, so nobody can act on any of it
- **"Optimizing to" is missing entirely** — the column that would have caught the two-action
  problem
- **"Performing reasonably well"** is a judgment with no number behind it, and nobody asked
  for a verdict
- **Nothing noticed, nothing questioned** — which reads as "I looked at the surface"

The gap between those two write-ups isn't effort or talent. It's four extra clicks and the
willingness to write down what you weren't sure about.

---

## The three things every deliverable needs

Whatever the project, whatever the shape:

1. **Where it came from.** Source, date, window, and anything you excluded. One line at the top.
2. **The thing that was asked for**, in the shape it was asked for. If the brief says five
   lines, five lines is the correct answer and eleven is a worse one.
3. **What you weren't sure about.** The questions are not a sign you did it badly — they are
   usually the most valuable part, and they're the difference between a deliverable and a
   homework assignment.

> **On length:** short is nearly always right. A one-page map that someone reads beats a
> four-page one that they skim. If you're padding, stop.

---

## Where to put them

`04-my-work/projects/`, one file per project, named after the project — `t1-01-account-tour.md`
or similar. Uploading through the GitHub web interface is completely fine.
