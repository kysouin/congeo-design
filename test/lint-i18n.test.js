'use strict';
// congeo-design-lint --i18n: fixtures that must pass, fixtures that must fail, and the proof with <button>Αποθήκευση</button>.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { root, runNode } = require('./helpers');

const bin = path.join(root, 'bin/congeo-design-lint.js');

test('lint --i18n: passing fixture (L(), LL(), t(), data contracts, folder names, comments) exits 0', () => {
  const r = runNode([bin, 'test/fixtures/i18n/pass', '--i18n']);
  assert.equal(r.code, 0, r.stdout);
});

test('lint --i18n: failing fixture exits 1 and names every kind of finding', () => {
  const r = runNode([bin, 'test/fixtures/i18n/fail', '--i18n']);
  assert.equal(r.code, 1);
  const out = r.stdout;
  assert.match(out, /Bad\.tsx:2:\d+\s+Greek text outside L\(\): string shown to the user: 'Αποθηκεύτηκε'/);
  assert.match(out, /Bad\.tsx:3:\d+\s+.*'Νέα εργασία'/);
  assert.match(out, /Bad\.tsx:3:\d+\s+.*'Θέλεις να συνεχίσεις;'/);
  assert.match(out, /Bad\.tsx:6:\d+\s+Greek text outside L\(\): JSX text: Αποθήκευση/);
  assert.match(out, /Bad\.tsx:7:\d+\s+Greek text outside L\(\): visible attribute: "Αναζήτηση"/);
  assert.match(out, /Bad\.tsx:8:\d+\s+.*"Λογότυπο"/);
  assert.match(out, /Bad\.tsx:9:\d+\s+.*'Κλείσιμο'/);
  assert.match(out, /Bad\.tsx:10:\d+\s+Greek text outside L\(\): JSX text: Κείμενο χωρίς L\(\)/);
  assert.match(out, /8 finding\(s\)/);
});

test('lint --i18n: without the flag the same fixture is clean (the colour rules alone)', () => {
  const r = runNode([bin, 'test/fixtures/i18n/fail']);
  assert.equal(r.code, 0, r.stdout);
});

test('lint --i18n: proof: a component with <button>Αποθήκευση</button> fails; wrapped in L() it passes', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cg-i18n-'));
  const file = path.join(dir, 'Save.tsx');
  fs.writeFileSync(file, `export const Save = () => <button>Αποθήκευση</button>;\n`);
  let r = runNode([bin, file, '--i18n']);
  assert.equal(r.code, 1);
  assert.match(r.stdout, /Save\.tsx:1:\d+\s+Greek text outside L\(\): JSX text: Αποθήκευση/);
  fs.writeFileSync(file, `import { L } from '@congeo/design/i18n';\nexport const Save = () => <button>{L('Save', 'Αποθήκευση')}</button>;\n`);
  r = runNode([bin, file, '--i18n']);
  assert.equal(r.code, 0, r.stdout);
  fs.rmSync(dir, { recursive: true, force: true });
});

test("lint --i18n: this package's own src/ passes (component labels go through L())", () => {
  const r = runNode([bin, 'src', '--i18n']);
  assert.equal(r.code, 0, r.stdout);
});
