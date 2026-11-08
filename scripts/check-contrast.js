#!/usr/bin/env node
'use strict';
// Prints the contrast table for tokens/tokens.json (or a given tokens file) and exits 1 if any pair fails.
const fs = require('fs');
const path = require('path');
const { checkContrast, formatTable, formatMarkdown } = require('./lib/contrast-check');

const file = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, '..', 'tokens', 'tokens.json');
const tokens = JSON.parse(fs.readFileSync(file, 'utf8'));
const { rows, failures } = checkContrast(tokens);
console.log(process.argv.includes('--md') ? formatMarkdown(rows) : formatTable(rows));
console.log('');
console.log(`${rows.length} pairs, ${rows.length - failures.length} pass, ${failures.length} fail`);
if (failures.length) {
  for (const f of failures) console.error(`FAIL ${f.scheme} ${f.fg} on ${f.bg}: ${f.ratio.toFixed(2)} < ${f.min}`);
  process.exit(1);
}
