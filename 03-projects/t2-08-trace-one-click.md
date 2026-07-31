# T2-8 · Trace one click end to end

| | |
|---|---|
| **Time box** | Half a day |
| **Account** | PDC + EMEDCO |
| **Safety** | Read-only |
| **Paired or solo** | Solo, with a readout |
| **Deliverable** | The trace diagram plus where it could break → `04-my-work/projects/` |
| **Builds toward** | [B · How Brady measures things](../05-self-assessment/baseline.md#b--how-brady-measures-things) |

**Read first:** Part 6 (conversion tracking & attribution) of
[`ppc-fundamentals.md`](../02-learning/ppc-fundamentals.md), the tracking-landmines section
of [`pdc-primer.md`](../02-learning/pdc-primer.md), and your own
[T1-12](./t1-12-dont-clean-that-up.md) write-up — this is the project it was setting up.

---

## The point

You've learned the pieces separately: ads, tracking parameters, conversion actions,
reporting models. This is where you follow **one single click** all the way through and see
them as one chain.

Do it once properly and a whole category of question stops being mysterious — *why doesn't
this sale appear in Google Ads*, *why did conversions go to zero on Tuesday*. Each is
"something broke at a specific link," and you can't diagnose a chain you've never walked.

You're doing it on **two accounts** because they're plumbed differently, and the difference
is the lesson.

---

## What to do

### 1 · Walk the chain on PDC

Pick one real ad. Follow it through every stage and write down what happens at each:

| Stage | What to capture |
|---|---|
| **The ad** | Which campaign, ad group, final URL |
| **The URL template** | What gets appended to the destination, and what each parameter is for |
| **The landing page** | What arrives — full URL including every parameter |
| **The conversion** | Which conversion action fires, what triggers it, primary or secondary |
| **Reporting** | Where the conversion surfaces, under which model, on which date |

On PDC you'll see `hsa_*` parameters. Work out what writes them and what reads them.

### 2 · Walk the same chain on EMEDCO

Same exercise, and expect it to look different. EMEDCO routes through a third-party tracking
layer at account level, with its own parameters — the ones T1-12 told you not to clean up.
Now you get to see what they actually do.

### 3 · Draw it

One diagram, both paths, side by side. A diagram beats prose here because the whole point is
seeing where the paths diverge and rejoin.

### 4 · Mark the break points

At every stage, ask: **if this link failed, what would I see?** That's the deliverable that
makes this project worth half a day.

| If this breaks | The symptom looks like |
|---|---|
| URL template drops a parameter | Traffic still arrives; attribution goes missing |
| Landing page strips the query string | Conversions stop being attributable to the click |
| Tag doesn't fire | Conversions go to zero — usually obvious |
| Tag fires twice | Conversions inflate — usually *not* obvious |
| Conversion action mis-set | Bidding optimizes toward the wrong thing, silently |

---

## ⚠️ The quiet failures are the dangerous ones

A tag that stops firing is loud. Someone notices within a day.

A tag that fires twice, or a parameter that silently drops on one browser, or a conversion
action flagged primary that shouldn't be — those produce numbers that look plausible. Nobody
raises them. Smart bidding meanwhile takes them completely seriously and spends real money
chasing them.

**Rank your break points by how long each would take to notice**, not by how bad each is.
That ordering is usually more useful, and it's not the one people expect.

## ⚠️ Don't test by clicking your own live ads

It costs money, it pollutes the data you're trying to read, and repeated clicks on your own
ads look exactly like something Google's systems are built to detect.

If you need to see a live click behave, ask Alex — there are safe ways to do it, including
preview tools and tag-assistant modes that don't involve a real auction.

---

## What good looks like

- Your diagram covers **both** accounts and makes the divergence obvious at a glance.
- You can explain, in one sentence each, what every parameter in the PDC URL is for. If one
  is a mystery, you said so rather than skipping it — an unexplained parameter is a finding.
- Your break-point list includes at least two failures that would be **invisible** for weeks.
- The same click can be a conversion in one reporting model and not in another — you already
  knew that. Now you can point at **where** in the chain the divergence happens.
