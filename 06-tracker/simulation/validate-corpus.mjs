#!/usr/bin/env node
/**
 * validate-corpus.mjs — checks a generated B2B query corpus against the spec.
 *
 *   node validate-corpus.mjs <path-to-corpus.json>
 *
 * Exits 0 if clean, 1 if any hard rule fails. Warnings (soft rules like intent mix)
 * are printed but don't fail the run.
 */
import { readFileSync } from 'node:fs';

const path = process.argv[2];
if (!path) { console.error('usage: node validate-corpus.mjs <corpus.json>'); process.exit(1); }

let data;
try {
  data = JSON.parse(readFileSync(path, 'utf8'));
} catch (e) {
  console.error('HARD FAIL: not valid JSON —', e.message);
  process.exit(1);
}

const INTENTS = ['high', 'research', 'jobs', 'residential', 'irrelevant', 'gray', 'competitor'];
const WASTE = ['jobs', 'residential', 'irrelevant'];
const BUYER = ['high', 'research'];
const QFIELDS = ['q', 'intent', 'baseImp', 'baseCtr', 'baseCvr', 'value', 'tags'];
// Target mix from the spec (soft — warn if far off).
const TARGET_MIX = { high: 0.25, research: 0.20, gray: 0.12, competitor: 0.08, jobs: 0.12, residential: 0.12, irrelevant: 0.11 };

const hard = [];   // hard failures
const soft = [];   // warnings
const ok = (m) => console.log('  ok  ' + m);

if (!Array.isArray(data)) { console.error('HARD FAIL: top level must be an array of companies'); process.exit(1); }
if (data.length !== 6) hard.push(`expected 6 companies, got ${data.length}`);

let totalQueries = 0;
const globalIntentCounts = Object.fromEntries(INTENTS.map(i => [i, 0]));

for (const [ci, company] of data.entries()) {
  const cname = company.company || `company[${ci}]`;
  for (const f of ['company', 'vertical', 'brief', 'landingPageBrief', 'queries', 'answerKey']) {
    if (!(f in company)) hard.push(`${cname}: missing top field "${f}"`);
  }
  const queries = Array.isArray(company.queries) ? company.queries : [];
  if (queries.length < 80 || queries.length > 100) soft.push(`${cname}: ${queries.length} queries (spec asks 80–100)`);
  totalQueries += queries.length;

  const intentCounts = Object.fromEntries(INTENTS.map(i => [i, 0]));
  const buyerTexts = [];           // full text of high/research queries (the ones a negative must never block)
  const wasteTexts = [];           // full text of waste queries

  for (const [qi, q] of queries.entries()) {
    const tag = `${cname} q[${qi}] "${q && q.q ? q.q : '?'}"`;
    if (typeof q !== 'object' || q === null) { hard.push(`${tag}: not an object`); continue; }
    for (const f of QFIELDS) if (!(f in q)) hard.push(`${tag}: missing field "${f}"`);
    if (!INTENTS.includes(q.intent)) hard.push(`${tag}: bad intent "${q.intent}"`);
    if (typeof q.q === 'string' && q.q !== q.q.toLowerCase()) soft.push(`${tag}: not lowercase`);
    if (typeof q.baseCtr === 'number' && (q.baseCtr < 0 || q.baseCtr >= 1)) hard.push(`${tag}: baseCtr ${q.baseCtr} not a decimal <1`);
    if (typeof q.baseCvr === 'number' && (q.baseCvr < 0 || q.baseCvr >= 1)) hard.push(`${tag}: baseCvr ${q.baseCvr} not a decimal <1`);
    if (!Array.isArray(q.tags) || q.tags.length < 2) soft.push(`${tag}: tags should be 2–4 tokens`);
    if (INTENTS.includes(q.intent)) { intentCounts[q.intent]++; globalIntentCounts[q.intent]++; }

    // Waste must be zeroed.
    if (WASTE.includes(q.intent)) {
      if (q.baseCvr !== 0) hard.push(`${tag}: waste intent but baseCvr=${q.baseCvr} (must be 0)`);
      if (q.value !== 0) hard.push(`${tag}: waste intent but value=${q.value} (must be 0)`);
      if (typeof q.q === 'string') wasteTexts.push(q.q.toLowerCase());
    }
    // Collect full buyer query text for the negative-safety check (substring, mirroring the sim).
    if (BUYER.includes(q.intent) && typeof q.q === 'string') {
      buyerTexts.push(q.q.toLowerCase());
    }
  }

  // Negative starter list must actually work.
  const negs = (company.answerKey && Array.isArray(company.answerKey.negativeStarterList))
    ? company.answerKey.negativeStarterList : null;
  if (!negs) {
    hard.push(`${cname}: answerKey.negativeStarterList missing or not an array`);
  } else {
    for (const neg of negs) {
      const n = String(neg).toLowerCase();
      // Rule 5a: negative must block at least one waste query.
      const blocksWaste = wasteTexts.some(t => t.includes(n));
      if (!blocksWaste) soft.push(`${cname}: negative "${neg}" blocks none of its waste queries`);
      // Rule 5b (LOAD-BEARING): a negative that blocks a buyer is a bug. Substring, as the sim applies it.
      const hitBuyer = buyerTexts.find(t => t.includes(n));
      if (hitBuyer) hard.push(`${cname}: negative "${neg}" is a substring of high/research query "${hitBuyer}" — blocks a buyer`);
    }
  }

  // gray-zone calls: one per gray query.
  const grayQs = queries.filter(q => q.intent === 'gray').length;
  const grayCalls = (company.answerKey && Array.isArray(company.answerKey.grayZoneCalls)) ? company.answerKey.grayZoneCalls.length : 0;
  if (grayCalls < grayQs) soft.push(`${cname}: ${grayCalls} gray-zone calls for ${grayQs} gray queries`);

  const seeded = (company.answerKey && Array.isArray(company.answerKey.seededDefects)) ? company.answerKey.seededDefects.length : 0;
  if (seeded < 3) soft.push(`${cname}: only ${seeded} seeded defects (spec asks 3–5)`);

  // Per-company mix drift.
  for (const [intent, targetPct] of Object.entries(TARGET_MIX)) {
    const actual = queries.length ? intentCounts[intent] / queries.length : 0;
    if (Math.abs(actual - targetPct) > 0.10) {
      soft.push(`${cname}: ${intent} is ${(actual*100).toFixed(0)}% (target ~${(targetPct*100).toFixed(0)}%)`);
    }
  }
}

console.log(`\n== corpus summary ==`);
console.log(`companies: ${data.length}   total queries: ${totalQueries}`);
console.log('global intent mix:');
for (const i of INTENTS) {
  const pct = totalQueries ? (globalIntentCounts[i] / totalQueries * 100).toFixed(1) : '0';
  console.log(`  ${i.padEnd(12)} ${String(globalIntentCounts[i]).padStart(4)}  ${pct}%`);
}

if (soft.length) { console.log(`\n== ${soft.length} warning(s) (soft rules) ==`); soft.forEach(s => console.log('  ! ' + s)); }
if (hard.length) {
  console.log(`\n== ${hard.length} HARD FAILURE(S) ==`);
  hard.forEach(h => console.log('  X ' + h));
  console.log('\nRESULT: FAIL');
  process.exit(1);
}
console.log('\nRESULT: PASS (hard rules) — review warnings above before integrating.');
