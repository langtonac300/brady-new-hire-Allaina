#!/usr/bin/env node
/**
 * build-sim.mjs — embeds scenario-corpus.json into sim.html.
 *
 *   node 06-tracker/simulation/build-sim.mjs
 *
 * sim.html is a standalone file opened straight from disk (file://), so it can't fetch the
 * corpus at runtime — browsers block that. Instead we inline the validated corpus between the
 * /*CORPUS_START* / ... /*CORPUS_END* / markers. scenario-corpus.json stays the single source
 * of truth; edit it, re-run this, commit both.
 *
 * Validate the corpus first with scripts/validate (see the simulation README) — this script
 * only transports data, it doesn't check it.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const corpusPath = join(HERE, 'scenario-corpus.json');
const simPath = join(HERE, 'sim.html');

const corpus = JSON.parse(readFileSync(corpusPath, 'utf8'));
if (!Array.isArray(corpus) || corpus.length === 0) {
  console.error('ERROR: scenario-corpus.json is empty or not an array.');
  process.exit(1);
}

const json = JSON.stringify(corpus);
const html = readFileSync(simPath, 'utf8');

const marker = /\/\*CORPUS_START\*\/[\s\S]*?\/\*CORPUS_END\*\//;
if (!marker.test(html)) {
  console.error('ERROR: could not find the /*CORPUS_START*/.../*CORPUS_END*/ markers in sim.html.');
  process.exit(1);
}

const out = html.replace(marker, `/*CORPUS_START*/${json}/*CORPUS_END*/`);
writeFileSync(simPath, out, 'utf8');

const totalQueries = corpus.reduce((n, c) => n + (c.queries ? c.queries.length : 0), 0);
console.log(`Embedded ${corpus.length} scenarios, ${totalQueries} queries (${Math.round(json.length / 1024)} KB) into sim.html`);
corpus.forEach((c, i) => console.log(`  ${i}. ${c.company} — ${c.queries.length} queries`));
