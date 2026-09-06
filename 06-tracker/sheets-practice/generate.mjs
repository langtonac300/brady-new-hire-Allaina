#!/usr/bin/env node
/**
 * generate.mjs — builds the Sheets practice dataset and its answer key.
 *
 *     node 06-tracker/sheets-practice/generate.mjs [seed]
 *
 * Everything downstream is derived from one seed, so the dataset is reproducible and the
 * answer key is *computed from the rows that shipped* rather than written by hand. That
 * matters more than it sounds: hand-written answers to spreadsheet exercises are exactly
 * where quiet errors live, and an answer key that disagrees with the data teaches the
 * wrong lesson at the worst moment.
 *
 * Reseed (pass a different number) if the answers ever leak or get memorised. Commit the
 * regenerated data/ and ANSWERS.md together — they are one artifact in two files.
 *
 * ⚠️ Every number this emits is invented. Northgate Safety Supply is not a real company.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SEED = Number(process.argv[2] ?? 20260908);

/* ---------- deterministic RNG ---------- */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(SEED);
const between = (lo, hi) => lo + rnd() * (hi - lo);
const intBetween = (lo, hi) => Math.floor(between(lo, hi + 1));
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const round2 = (n) => Math.round(n * 100) / 100;

/* ---------- the fictional account ----------
 * Shaped like a Brady-style B2B safety/identification account so the skills transfer,
 * but the advertiser, the terms and every number are invented.
 */
const CAMPAIGNS = {
  'NG | US | NB | Safety Signage':  ['OSHA Signs', 'Custom Signs', 'Danger + Warning'],
  'NG | US | NB | Pipe Markers':    ['Pipe Markers - Generic', 'Ammonia + Chemical'],
  'NG | US | NB | Lockout Tagout':  ['LOTO Kits', 'LOTO Padlocks'],
  'NG | US | NB | Floor Marking':   ['Floor Tape', 'Floor Signs'],
  'NG | US | BR | Brand':           ['Brand - Core', 'Brand - Products'],
};

/* Term classes carry their own performance shape. This is what makes the exercise
 * answerable: a pivot by campaign, or a zero-conversion filter, has to surface something
 * real rather than noise. */
const CLASSES = {
  brand:      { ctr: [0.14, 0.26], cvr: [0.07, 0.15], cpc: [0.90, 2.80], imp: [40, 900] },
  commercial: { ctr: [0.045, 0.095], cvr: [0.02, 0.055], cpc: [2.80, 8.50], imp: [60, 1400] },
  grey:       { ctr: [0.035, 0.075], cvr: [0.004, 0.018], cpc: [1.90, 5.20], imp: [80, 1600] },
  competitor: { ctr: [0.025, 0.055], cvr: [0.006, 0.020], cpc: [4.50, 12.00], imp: [40, 700] },
  junk:       { ctr: [0.008, 0.030], cvr: [0, 0.002], cpc: [0.90, 3.80], imp: [90, 2200] },
  collision:  { ctr: [0.004, 0.018], cvr: [0, 0], cpc: [0.45, 1.90], imp: [400, 6500] },
};

const HEADS = {
  commercial: [
    ['safety signs', 'Safety Signage', 'OSHA Signs'],
    ['osha safety signs', 'Safety Signage', 'OSHA Signs'],
    ['danger signs', 'Safety Signage', 'Danger + Warning'],
    ['warning signs for workplace', 'Safety Signage', 'Danger + Warning'],
    ['custom safety signs', 'Safety Signage', 'Custom Signs'],
    ['pipe markers', 'Pipe Markers', 'Pipe Markers - Generic'],
    ['pipe marking labels', 'Pipe Markers', 'Pipe Markers - Generic'],
    ['ammonia pipe markers', 'Pipe Markers', 'Ammonia + Chemical'],
    ['chemical pipe labels', 'Pipe Markers', 'Ammonia + Chemical'],
    ['lockout tagout kits', 'Lockout Tagout', 'LOTO Kits'],
    ['loto station', 'Lockout Tagout', 'LOTO Kits'],
    ['lockout padlocks', 'Lockout Tagout', 'LOTO Padlocks'],
    ['floor marking tape', 'Floor Marking', 'Floor Tape'],
    ['warehouse floor tape', 'Floor Marking', 'Floor Tape'],
    ['floor safety signs', 'Floor Marking', 'Floor Signs'],
  ],
  grey: [
    ['osha pipe marking requirements', 'Pipe Markers', 'Pipe Markers - Generic'],
    ['what color is an ammonia pipe label', 'Pipe Markers', 'Ammonia + Chemical'],
    ['how to label pipes in a plant', 'Pipe Markers', 'Pipe Markers - Generic'],
    ['ansi pipe marking standard', 'Pipe Markers', 'Pipe Markers - Generic'],
    ['osha sign color requirements', 'Safety Signage', 'OSHA Signs'],
    ['do i need a lockout tagout program', 'Lockout Tagout', 'LOTO Kits'],
    ['lockout tagout requirements osha', 'Lockout Tagout', 'LOTO Kits'],
    ['floor marking color standard', 'Floor Marking', 'Floor Tape'],
    ['how wide should aisle marking be', 'Floor Marking', 'Floor Tape'],
  ],
  junk: [
    ['free printable safety signs', 'Safety Signage', 'OSHA Signs'],
    ['safety sign clipart', 'Safety Signage', 'Custom Signs'],
    ['safety signs free download pdf', 'Safety Signage', 'OSHA Signs'],
    ['osha inspector jobs', 'Safety Signage', 'OSHA Signs'],
    ['safety officer salary', 'Safety Signage', 'OSHA Signs'],
    ['how to become a safety manager', 'Lockout Tagout', 'LOTO Kits'],
    ['safety sign meanings quiz', 'Safety Signage', 'Danger + Warning'],
    ['diy floor tape hack', 'Floor Marking', 'Floor Tape'],
  ],
  competitor: [
    ['seldon safety signs', 'Safety Signage', 'Custom Signs'],
    ['vantage pipe markers', 'Pipe Markers', 'Pipe Markers - Generic'],
    ['seldon lockout tagout', 'Lockout Tagout', 'LOTO Kits'],
    ['vantage floor tape', 'Floor Marking', 'Floor Tape'],
  ],
  /* The name-collision trap — the same shape as Brady's own NFL-quarterback problem.
   * Huge impressions, no intent, and it hides inside the brand campaign. */
  collision: [
    ['northgate mall hours', 'Brand', 'Brand - Core'],
    ['northgate apartments for rent', 'Brand', 'Brand - Core'],
    ['northgate station parking', 'Brand', 'Brand - Core'],
    ['northgate high school football', 'Brand', 'Brand - Core'],
    ['northgate shopping centre', 'Brand', 'Brand - Core'],
  ],
  brand: [
    ['northgate safety supply', 'Brand', 'Brand - Core'],
    ['northgate safety', 'Brand', 'Brand - Core'],
    ['northgate safety supply catalog', 'Brand', 'Brand - Products'],
    ['northgate pipe markers', 'Brand', 'Brand - Products'],
    ['northgate loto kit', 'Brand', 'Brand - Products'],
  ],
};

const MODS = {
  commercial: ['', ' near me', ' bulk', ' wholesale', ' for sale', ' supplier', ' custom',
    ' industrial', ' outdoor', ' heavy duty', ' pack of 50', ' aluminum', ' vinyl',
    ' waterproof', ' large', ' reflective', ' with logo', ' same day', ' usa made', ' osha compliant'],
  grey: ['', ' 2026', ' explained', ' chart', ' guide', ' pdf', ' checklist', ' standard'],
  junk: ['', ' free', ' template', ' images', ' reddit', ' youtube'],
  competitor: ['', ' alternative', ' vs', ' price', ' review'],
  collision: ['', ' directions', ' phone number', ' open today', ' map'],
  brand: ['', ' login', ' catalog', ' phone', ' shipping', ' coupon'],
};

const MATCH = ['Broad match', 'Phrase match', 'Exact match'];

/* ---------- build the search-terms table ---------- */
const seen = new Set();
const rows = [];
const TARGET_ROWS = 940;

function addRow(term, cls, campShort, adGroup) {
  if (seen.has(term) || term.length > 70) return false;
  seen.add(term);
  const c = CLASSES[cls];
  const impressions = intBetween(c.imp[0], c.imp[1]);
  const clicks = Math.max(0, Math.round(impressions * between(c.ctr[0], c.ctr[1])));
  const cpc = between(c.cpc[0], c.cpc[1]);
  const cost = round2(clicks * cpc);
  let conversions = 0;
  const cvr = between(c.cvr[0], c.cvr[1]);
  for (let i = 0; i < clicks; i++) if (rnd() < cvr) conversions++;
  // B2B order values are wide and right-skewed; a couple of large orders per month is normal.
  let convValue = 0;
  for (let i = 0; i < conversions; i++) {
    convValue += rnd() < 0.09 ? between(1400, 4200) : between(140, 880);
  }
  const campaign = Object.keys(CAMPAIGNS).find((k) => k.includes(campShort));
  rows.push({
    term, match: pick(MATCH), campaign, adGroup,
    impressions, clicks, cost, conversions, convValue: round2(convValue),
  });
  return true;
}

// Heads first, so every class is present even if the modifier pass runs short.
for (const [cls, heads] of Object.entries(HEADS))
  for (const [term, camp, ag] of heads) addRow(term, cls, camp, ag);

// Then modifier combinations until the table is the right size.
let guard = 0;
while (rows.length < TARGET_ROWS && guard++ < 60000) {
  const cls = pick(['commercial', 'commercial', 'commercial', 'grey', 'junk', 'competitor', 'collision', 'brand']);
  const [term, camp, ag] = pick(HEADS[cls]);
  const mod = pick(MODS[cls]);
  const prefix = rnd() < 0.18 ? pick(['best ', 'cheap ', 'buy ', 'where to buy ', '']) : '';
  addRow((prefix + term + mod).trim().replace(/\s+/g, ' '), cls, camp, ag);
}

/* ---------- daily spend, November 2026 ----------
 * November is chosen deliberately: it contains Thanksgiving (Thu Nov 26, 2026) and the
 * company holiday on the Friday after. Counting weekdays alone gives 21 business days;
 * the real figure is 19. That ~10% error in the divisor is the whole point of Task 7.
 */
const MONTH = { year: 2026, month: 10 }; // 0-indexed: 10 = November
const HOLIDAYS = ['2026-11-26', '2026-11-27'];
const AS_OF = '2026-11-20'; // the "today" the pacing task runs from
const MONTHLY_TARGET = 48000;

const iso = (d) => d.toISOString().slice(0, 10);
const daily = [];
for (let day = 1; day <= 30; day++) {
  const d = new Date(Date.UTC(MONTH.year, MONTH.month, day));
  const dow = d.getUTCDay();
  const isWeekend = dow === 0 || dow === 6;
  const isHoliday = HOLIDAYS.includes(iso(d));
  let spend;
  if (isWeekend) spend = between(190, 430);           // B2B weekends are thin, not zero
  else if (isHoliday) spend = between(120, 260);
  else spend = between(1850, 2650);
  daily.push({ date: iso(d), dow: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dow], spend: round2(spend) });
}

/* ---------- write the data ---------- */
mkdirSync(join(HERE, 'data'), { recursive: true });
const tsv = (header, lines) => header.join('\t') + '\n' + lines.join('\n') + '\n';

writeFileSync(join(HERE, 'data', 'search-terms.tsv'), tsv(
  ['Search term', 'Match type', 'Campaign', 'Ad group', 'Impressions', 'Clicks', 'Cost', 'Conversions', 'Conv. value'],
  rows.map((r) => [r.term, r.match, r.campaign, r.adGroup, r.impressions, r.clicks,
    r.cost.toFixed(2), r.conversions, r.convValue.toFixed(2)].join('\t'))
), 'utf8');

writeFileSync(join(HERE, 'data', 'daily-spend.tsv'), tsv(
  ['Date', 'Day', 'Spend'],
  daily.map((d) => [d.date, d.dow, d.spend.toFixed(2)].join('\t'))
), 'utf8');

console.log(`search-terms.tsv  ${rows.length} rows`);
console.log(`daily-spend.tsv   ${daily.length} rows`);

/* ---------- the answer key, computed from the rows above ---------- */
const sum = (a, f) => round2(a.reduce((t, x) => t + f(x), 0));
const money = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const totCost = sum(rows, (r) => r.cost);
const totClicks = rows.reduce((t, r) => t + r.clicks, 0);
const totImpr = rows.reduce((t, r) => t + r.impressions, 0);
const totConv = rows.reduce((t, r) => t + r.conversions, 0);
const totValue = sum(rows, (r) => r.convValue);

const byCost = [...rows].sort((a, b) => b.cost - a.cost);
const zeroConv = rows.filter((r) => r.conversions === 0);
const zeroConvOver50 = zeroConv.filter((r) => r.cost > 50).sort((a, b) => b.cost - a.cost);

const groupBy = (arr, key) => {
  const m = new Map();
  for (const r of arr) {
    const k = key(r);
    if (!m.has(k)) m.set(k, { cost: 0, conv: 0, clicks: 0, value: 0 });
    const g = m.get(k);
    g.cost += r.cost; g.conv += r.conversions; g.clicks += r.clicks; g.value += r.convValue;
  }
  return [...m.entries()].map(([k, g]) => ({
    key: k, cost: round2(g.cost), conv: g.conv, clicks: g.clicks, value: round2(g.value),
    cpa: g.conv ? round2(g.cost / g.conv) : null,
    roas: g.cost ? round2(g.value / g.cost) : null,
  }));
};

const campRows = groupBy(rows, (r) => r.campaign).sort((a, b) => b.cost - a.cost);
const agRows = groupBy(rows, (r) => `${r.campaign} › ${r.adGroup}`).sort((a, b) => b.cost - a.cost);
const agWithConv = agRows.filter((a) => a.cpa !== null);
const worstAg = [...agWithConv].sort((a, b) => b.cpa - a.cpa)[0];
const bestAg = [...agWithConv].sort((a, b) => a.cpa - b.cpa)[0];

const collisionTerms = rows.filter((r) => /mall|apartment|station parking|high school|shopping centre/.test(r.term));
const collisionCost = sum(collisionTerms, (r) => r.cost);
const collisionImpr = collisionTerms.reduce((t, r) => t + r.impressions, 0);

/* Business-day math for November 2026. Computed, not asserted. */
const asOf = new Date(AS_OF + 'T00:00:00Z');
const isWeekendD = (d) => d.getUTCDay() === 0 || d.getUTCDay() === 6;
let bdTotalNaive = 0, bdTotalReal = 0, bdElapsedNaive = 0, bdElapsedReal = 0;
for (const row of daily) {
  const d = new Date(row.date + 'T00:00:00Z');
  if (isWeekendD(d)) continue;
  const hol = HOLIDAYS.includes(row.date);
  bdTotalNaive++; if (!hol) bdTotalReal++;
  if (d <= asOf) { bdElapsedNaive++; if (!hol) bdElapsedReal++; }
}
const mtdSpend = sum(daily.filter((r) => new Date(r.date + 'T00:00:00Z') <= asOf), (r) => r.spend);
const monthSpend = sum(daily, (r) => r.spend);
const actualPerBd = round2(mtdSpend / bdElapsedReal);
const targetPerBdNaive = round2(MONTHLY_TARGET / bdTotalNaive);
const targetPerBdReal = round2(MONTHLY_TARGET / bdTotalReal);
const projNaive = round2(actualPerBd * bdTotalNaive);
const projReal = round2(actualPerBd * bdTotalReal);

const t = (n) => n.toLocaleString('en-US');
const md = `# Answer key

> **Generated by \`generate.mjs\` (seed \`${SEED}\`) — do not hand-edit.** Every figure below is
> computed from the rows in \`data/\`, so it cannot drift from the dataset. Regenerate both
> together.
>
> ⚠️ **Every number here is invented.** Northgate Safety Supply does not exist. Nothing on this
> page is a Brady figure and none of it should ever be quoted as one.

**Don't open this until you've had a real go.** Being wrong first is the point — the gap
between your answer and this one is the part you'll remember.

---

## Task 1 — control totals

Reconcile these before anything else. If any one is off, your paste is short.

| Check | Value |
|---|---|
| Rows (excluding the header) | **${t(rows.length)}** |
| Total impressions | ${t(totImpr)} |
| Total clicks | ${t(totClicks)} |
| Total cost | **${money(totCost)}** |
| Total conversions | ${t(totConv)} |
| Total conv. value | ${money(totValue)} |
| Account CPA | ${money(round2(totCost / totConv))} |
| Account ROAS | ${round2(totValue / totCost)}× |

---

## Task 2 — sort and filter

**Ten highest-cost search terms:**

| # | Search term | Cost | Conv. |
|---|---|---|---|
${byCost.slice(0, 10).map((r, i) => `| ${i + 1} | ${r.term} | ${money(r.cost)} | ${r.conversions} |`).join('\n')}

**Ten highest-cost terms with zero conversions:**

| # | Search term | Cost | Clicks |
|---|---|---|---|
${zeroConv.sort((a, b) => b.cost - a.cost).slice(0, 10).map((r, i) => `| ${i + 1} | ${r.term} | ${money(r.cost)} | ${t(r.clicks)} |`).join('\n')}

---

## Tasks 3 & 4 — the pivots

**By campaign:**

| Campaign | Cost | Conv. | CPA | ROAS |
|---|---|---|---|---|
${campRows.map((c) => `| ${c.key} | ${money(c.cost)} | ${c.conv} | ${c.cpa === null ? '— (no conv.)' : money(c.cpa)} | ${c.roas}× |`).join('\n')}

**Ad groups — the two ends:**

- **Worst CPA:** ${worstAg.key} — ${money(worstAg.cpa)} (${money(worstAg.cost)} for ${worstAg.conv} conv.)
- **Best CPA:** ${bestAg.key} — ${money(bestAg.cpa)} (${money(bestAg.cost)} for ${bestAg.conv} conv.)

> ⚠️ **Read the ad groups with no conversions at all separately.** A blank CPA is not a good
> CPA, and a pivot will happily show you an empty cell where the worst number should be. Sort
> by cost as well as by CPA or you will miss them.

---

## Tasks 5 & 6 — FILTER and QUERY

Zero-conversion terms costing more than \$50:

| | |
|---|---|
| How many | **${t(zeroConvOver50.length)}** |
| Their total cost | **${money(sum(zeroConvOver50, (r) => r.cost))}** |
| Share of account spend | **${round2((sum(zeroConvOver50, (r) => r.cost) / totCost) * 100)}%** |

Both formulas must return the same total. If they don't, one of them is wrong — usually a
\`>\` that should be \`>=\`, or a QUERY column letter off by one.

---

## Task 7 — per-business-day math (the one that matters)

As of **${AS_OF}**, monthly target **${money(MONTHLY_TARGET)}**.

| | Weekdays only | Holidays removed |
|---|---|---|
| Business days in November | ${bdTotalNaive} | **${bdTotalReal}** |
| Business days elapsed | ${bdElapsedNaive} | **${bdElapsedReal}** |
| Target per business day | ${money(targetPerBdNaive)} | **${money(targetPerBdReal)}** |
| Projected full month | ${money(projNaive)} | **${money(projReal)}** |

- **MTD spend through ${AS_OF}:** ${money(mtdSpend)}
- **Actual per business day:** ${money(actualPerBd)}
- **Full month, if every day ran:** ${money(monthSpend)}

**What the trap does.** Thanksgiving (Thu Nov 26) and the Friday after are company holidays,
so November has **${bdTotalReal}** business days, not ${bdTotalNaive}. Counting weekdays alone
understates the target per business day by **${money(round2(targetPerBdReal - targetPerBdNaive))}**
and overstates the full-month projection by **${money(round2(projNaive - projReal))}**.

**And on this month's numbers it flips the answer.** Weekday-only math says
${money(actualPerBd)}/day against a ${money(targetPerBdNaive)} target — **${actualPerBd >= targetPerBdNaive ? 'ahead of' : 'behind'} pace.**
Holiday-corrected, the same spend runs against ${money(targetPerBdReal)} — **${actualPerBd >= targetPerBdReal ? 'ahead of' : 'behind'} pace.**
Same spend, same month, opposite conclusion, and only one of them is true.

Both errors point the same way — *"we're fine"* — which is exactly why this one survives. The
spend was real; the divisor wasn't.

---

## Task 8 — the name collision

| | |
|---|---|
| Collision terms found | **${collisionTerms.length}** |
| Impressions they took | **${t(collisionImpr)}** |
| Cost | **${money(collisionCost)}** |
| Conversions | **${collisionTerms.reduce((s, r) => s + r.conversions, 0)}** |

They sit inside the **brand** campaign, which is where the damage hides: brand campaigns are
supposed to look efficient, so a cheap, high-impression, zero-conversion term drags the whole
campaign's CTR down without ever looking expensive enough to investigate.

**${round2((collisionImpr / totImpr) * 100)}% of account impressions** went to people looking
for a shopping centre.

---

## Task 9 — the pacing note

No single right answer, but a good one uses ${money(mtdSpend)} MTD against
${money(targetPerBdReal)}/business-day, names **${bdTotalReal} business days not ${bdTotalNaive}**,
and gives a driver you can point at — the ${money(collisionCost)} in collision terms and the
${money(sum(zeroConvOver50, (r) => r.cost))} in zero-conversion spend are both defensible ones.

If your note doesn't survive *"where did that number come from?"*, it isn't finished.
`;

writeFileSync(join(HERE, 'ANSWERS.md'), md, 'utf8');
console.log(`ANSWERS.md        written`);
