'use strict';
// Check 3: congeo-design-lint on fixtures that must pass and fixtures that must fail; and on our own source.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { root, runNode } = require('./helpers');

const bin = path.join(root, 'bin/congeo-design-lint.js');

test('lint: passing fixtures exit 0 (with an allowed legacy folder)', () => {
  const r = runNode([bin, 'test/fixtures/lint/pass', '--allow', 'test/fixtures/lint/pass/legacy/**']);
  assert.equal(r.code, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /2 file\(s\) clean/);
});

test('lint: the allowed folder is a finding when not allowed', () => {
  const r = runNode([bin, 'test/fixtures/lint/pass']);
  assert.equal(r.code, 1);
  assert.match(r.stdout, /legacy\/old\.css:2:\d+\s+hard-coded hex colour: #336699/);
  assert.match(r.stdout, /legacy\/old\.css:2:\d+\s+font-family literal/);
});

test('lint: failing fixtures exit 1 with file:line:col for each kind of finding', () => {
  const r = runNode([bin, 'test/fixtures/lint/fail']);
  assert.equal(r.code, 1);
  const out = r.stdout;
  assert.match(out, /Bad\.tsx:1:\d+\s+hard-coded hex colour: #5B6772/);
  assert.match(out, /Bad\.tsx:1:\d+\s+named colour: white/);
  assert.match(out, /Bad\.tsx:3:\d+\s+hard-coded colour function: rgba\(0,0,0,\.2\)/);
  assert.match(out, /Bad\.tsx:3:\d+\s+Tailwind palette class: bg-slate-100/);
  assert.match(out, /Bad\.tsx:3:\d+\s+Tailwind palette class: text-gray-700/);
  assert.match(out, /Bad\.tsx:3:\d+\s+font-family literal: 'Commissioner, sans-serif'/);
  assert.match(out, /bad\.css:1:\d+\s+Google Fonts link/);
  assert.match(out, /bad\.css:2:\d+\s+hard-coded hex colour: #f4f4f4/);
  assert.match(out, /bad\.css:2:\d+\s+hard-coded colour function: hsl\(210, 10%, 20%\)/);
  assert.match(out, /bad\.css:3:\d+\s+named colour: red/);
  assert.match(out, /bad\.css:3:\d+\s+font-family literal: "Commissioner", sans-serif/);
  assert.match(out, /11 finding\(s\)/);
});

test('lint: --json output', () => {
  const r = runNode([bin, 'test/fixtures/lint/fail', '--json']);
  assert.equal(r.code, 1);
  const j = JSON.parse(r.stdout);
  assert.equal(j.scanned, 2);
  assert.equal(j.findings.length, 11);
});

test('lint: this package\'s own src/ (CSS and React) holds no colour or font literal', () => {
  const r = runNode([bin, 'src']);
  assert.equal(r.code, 0, r.stdout);
});

test('lint: missing path exits 2', () => {
  const r = runNode([bin, 'does/not/exist']);
  assert.equal(r.code, 2);
});
