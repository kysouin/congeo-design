'use strict';
// Check 1: every declared text/background pair meets WCAG AA, light and dark. The table is printed.
// Check 6: prove the check can fail: ink-3 on bg set to a failing grey.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { readTokens, runNode, root } = require('./helpers');
const { checkContrast, formatTable } = require('../scripts/lib/contrast-check');

test('contrast: every declared pair passes WCAG AA (light and dark)', () => {
  const tokens = readTokens();
  const { rows, failures } = checkContrast(tokens);
  console.log('\n' + formatTable(rows) + `\n${rows.length} pairs, ${failures.length} fail\n`);
  assert.ok(rows.length >= 100, 'expected a full table of pairs');
  assert.ok(rows.some((r) => r.scheme === 'light') && rows.some((r) => r.scheme === 'dark'));
  assert.deepEqual(
    failures.map((f) => `${f.scheme} ${f.fg} on ${f.bg} = ${f.ratio.toFixed(2)}`),
    [],
    'contrast failures',
  );
});

test('contrast: the CLI exits 0 on the real tokens', () => {
  const r = runNode([path.join(root, 'scripts/check-contrast.js')]);
  assert.equal(r.code, 0, r.stderr);
  assert.match(r.stdout, /0 fail/);
});

test('contrast: the check fails when ink-3 on bg is a failing grey (the originally proposed #868E95)', () => {
  const tokens = readTokens();
  tokens.color.light['ink-3'] = '#868E95';
  const { failures } = checkContrast(tokens);
  const hit = failures.find((f) => f.scheme === 'light' && f.fg === 'ink-3' && f.bg === 'bg');
  assert.ok(hit, 'ink-3 on bg must fail');
  assert.ok(hit.ratio < 4.5 && hit.ratio > 3, `ratio ${hit.ratio}`);

  // and through the CLI, with a temp tokens file, so the exit code is proven too
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'cg-tokens-')), 'tokens.json');
  fs.writeFileSync(tmp, JSON.stringify(tokens));
  const r = runNode([path.join(root, 'scripts/check-contrast.js'), tmp]);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /FAIL light ink-3 on bg: 3\.\d\d < 4\.5/);
  fs.rmSync(path.dirname(tmp), { recursive: true, force: true });
});
