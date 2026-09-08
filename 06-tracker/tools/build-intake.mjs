#!/usr/bin/env node
/**
 * build-intake.mjs - turns intake/questions.json into apps-script/DataIntake.gs.
 *
 *     node 06-tracker/tools/build-intake.mjs
 *
 * The How I work screen in the app asks the questions in about-how-you-work.md, and the
 * Excel workbook asks the same ones. Both are built from intake/questions.json so they
 * cannot disagree. Apps Script cannot read a file, so the JSON travels inside the script
 * as DATA_INTAKE(), the same way the document bodies do.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, '..', 'intake', 'questions.json');
const OUT = join(HERE, '..', 'apps-script', 'DataIntake.gs');

const data = JSON.parse(readFileSync(SRC, 'utf8'));
const count = data.sections.reduce((n, s) => n + s.questions.filter((q) => q.type !== 'note').length, 0);

const body = JSON.stringify({ source: data.source, sections: data.sections }, null, 2)
  // Keep the generated file free of anything the editor might read as a template tag.
  .replace(/<\//g, '<\\/');

writeFileSync(OUT, [
  '/**',
  ' * GENERATED FILE - do not edit here.',
  ' *',
  ' * Rebuild it from 06-tracker/intake/questions.json with tools/build-intake.mjs, then',
  ' * paste the result back in. Editing this file by hand means the next rebuild silently',
  ' * discards your change.',
  ' */',
  '',
  `/** The intake questionnaire: ${count} questions in ${data.sections.length} sections. */`,
  'function DATA_INTAKE() {',
  '  return ' + body.split('\n').join('\n  ') + ';',
  '}',
  ''
].join('\n'));

console.log(`DataIntake.gs: ${count} questions, ${data.sections.length} sections`);
