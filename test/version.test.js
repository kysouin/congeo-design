'use strict';
// Version guard: package.json's version must equal the top CHANGELOG heading.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { root } = require('./helpers');

test('version: package.json matches the top CHANGELOG heading', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const changelog = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8');
  const m = /^## v(\d+\.\d+\.\d+)\b/m.exec(changelog);
  assert.ok(m, 'CHANGELOG has a "## vX.Y.Z" heading');
  console.log(`  package.json ${pkg.version} · CHANGELOG ${m[1]}`);
  assert.equal(pkg.version, m[1], `package.json says ${pkg.version} but the top CHANGELOG heading is v${m[1]}`);
  const lock = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
  assert.equal(lock.version, pkg.version, 'package-lock.json version');
  assert.equal(lock.packages[''].version, pkg.version, 'package-lock.json root package version');
});
