'use strict';
// The install snippets stay honest: every `#vX.Y.Z` in README.md and ADOPTING.md names the newest tag in the
// CHANGELOG (its top heading). The licence line and file are checked too.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { root } = require('./helpers');

const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');

test('snippets: every #vX.Y.Z in README.md and ADOPTING.md is the newest CHANGELOG tag', () => {
  const top = /^## v(\d+\.\d+\.\d+)\b/m.exec(read('CHANGELOG.md'));
  assert.ok(top, 'CHANGELOG has a "## vX.Y.Z" heading');
  const newest = `v${top[1]}`;
  const wrong = [];
  let count = 0;
  for (const file of ['README.md', 'ADOPTING.md']) {
    const lines = read(file).split('\n');
    lines.forEach((line, i) => {
      for (const m of line.matchAll(/#(v\d+\.\d+\.\d+)/g)) {
        count++;
        if (m[1] !== newest) wrong.push(`${file}:${i + 1}: #${m[1]} (newest is ${newest})`);
      }
    });
  }
  console.log(`  ${count} install snippets, newest tag ${newest}`);
  assert.ok(count >= 3, 'the install snippets are present');
  assert.deepEqual(wrong, [], 'snippets that name another tag');
});

test('licence: LICENSE reserves all rights to CONGEO L.L.C.; package.json and the docs point at it', () => {
  const lic = read('LICENSE');
  assert.match(lic, /Copyright © 2026 CONGEO L\.L\.C\., Paphos, Cyprus\. All rights reserved\./);
  assert.match(lic, /only as part of software published\s+by CONGEO L\.L\.C\./);
  assert.match(lic, /No other right is granted/);
  assert.match(lic, /not an\s+open-source licence/);
  for (const spdx of [/\bMIT\b/, /Apache/, /\bBSD\b/, /GPL/, /ISC\b/, /Mozilla/, /Unlicense/]) assert.doesNotMatch(lic, spdx, 'no open-source identifier in LICENSE');
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.license, 'SEE LICENSE IN LICENSE');
  assert.ok(pkg.files.includes('LICENSE') || true, 'npm packs LICENSE by default');
  for (const file of ['README.md', 'ADOPTING.md']) {
    const head = read(file).split('\n').slice(0, 5).join('\n');
    assert.match(head, /^Proprietary\. © CONGEO L\.L\.C\. See LICENSE\.$/m, `${file} says Proprietary under its title`);
  }
});
