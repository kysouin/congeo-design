'use strict';
// Check 2: regenerating dist/ and site/index.html gives no diff.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { root, listFiles } = require('./helpers');

function snapshot() {
  const files = [...listFiles(path.join(root, 'dist')), path.join(root, 'site/index.html'), path.join(root, 'site/contrast.md')];
  const map = new Map();
  for (const f of files) map.set(path.relative(root, f), fs.readFileSync(f));
  return map;
}

test('determinism: npm run build reproduces dist/ and site/index.html byte for byte', () => {
  const before = snapshot();
  const r = spawnSync('npm', ['run', 'build', '--silent'], { cwd: root, encoding: 'utf8', shell: process.platform === 'win32' });
  assert.equal(r.status, 0, r.stderr + r.stdout);
  const after = snapshot();
  assert.deepEqual([...after.keys()], [...before.keys()], 'same set of files');
  const changed = [...after.keys()].filter((k) => !before.get(k).equals(after.get(k)));
  assert.deepEqual(changed, [], 'files that changed on regeneration');
});
