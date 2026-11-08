'use strict';
// A CJS consumer (require) and an ESM consumer (import) in one process share the language state.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { spawnSync } = require('child_process');
const { root } = require('./helpers');

const pkgDir = path.resolve(process.env.CG_PACKAGE_DIR || root);

function runNode(args, input) {
  const r = spawnSync(process.execPath, args, { cwd: pkgDir, encoding: 'utf8', input });
  return { code: r.status, out: (r.stdout + r.stderr).trim() };
}

test('dual: import and require of @congeo/design/i18n resolve different files but one state', () => {
  // the package refers to itself by name through its exports map
  const esm = `
    import { createRequire } from 'node:module';
    import * as esm from '@congeo/design/i18n';
    const cjs = createRequire(import.meta.url)('@congeo/design/i18n');
    const files = { esm: (await import.meta.resolve('@congeo/design/i18n')).replace(/.*\\/dist\\//, 'dist/'), cjs: createRequire(import.meta.url).resolve('@congeo/design/i18n').replace(/.*\\/dist\\//, 'dist/') };
    esm.setLang('el');
    const a = cjs.getLang();
    cjs.setLang('en');
    const b = esm.getLang();
    let seen = [];
    esm.onLangChange((l) => seen.push('esm:' + l));
    cjs.setLang('el');
    console.log(JSON.stringify({ files, afterEsmSet: a, afterCjsSet: b, seen, sameModule: esm === cjs }));
  `;
  const r = runNode(['--input-type=module', '-e', esm]);
  assert.equal(r.code, 0, r.out);
  const res = JSON.parse(r.out.split('\n').pop());
  console.log(`  ${JSON.stringify(res)}`);
  assert.equal(res.sameModule, false, 'two module instances (CJS and ESM)');
  assert.notEqual(res.files.esm, res.files.cjs);
  assert.match(res.files.esm, /dist\/esm\/i18n\/index\.js$/);
  assert.match(res.files.cjs, /dist\/i18n\/index\.js$/);
  assert.equal(res.afterEsmSet, 'el', 'setLang in the ESM copy is seen by getLang in the CJS copy');
  assert.equal(res.afterCjsSet, 'en', 'and the reverse');
  assert.deepEqual(res.seen, ['esm:el'], 'a listener on one copy hears a change made through the other');
});

test('dual: the React entry never reaches across formats', () => {
  const esm = `
    import { createRequire } from 'node:module';
    const req = createRequire(import.meta.url);
    const r = (s) => (s.startsWith('file:') ? s : 'file://' + s).replace(/.*\\/dist\\//, 'dist/');
    console.log(JSON.stringify({
      reactEsm: r(import.meta.resolve('@congeo/design/react')), reactCjs: r(req.resolve('@congeo/design/react')),
      inlineEsm: r(import.meta.resolve('@congeo/design/inline')), inlineCjs: r(req.resolve('@congeo/design/inline')),
    }));
  `;
  const r = runNode(['--input-type=module', '-e', esm]);
  assert.equal(r.code, 0, r.out);
  const res = JSON.parse(r.out.split('\n').pop());
  assert.equal(res.reactEsm, 'dist/esm/react/index.js');
  assert.equal(res.reactCjs, 'dist/react/index.js');
  assert.equal(res.inlineEsm, 'dist/inline.mjs');
  assert.equal(res.inlineCjs, 'dist/inline.js');
  // the ESM react build imports the ESM i18n (relative, inside dist/esm), the CJS one requires the CJS i18n
  const fs = require('fs');
  const esmReact = fs.readFileSync(path.join(pkgDir, 'dist/esm/react/Sheet.js'), 'utf8');
  const cjsReact = fs.readFileSync(path.join(pkgDir, 'dist/react/Sheet.js'), 'utf8');
  assert.match(esmReact, /from ['"]\.\.\/i18n\/core\.js['"]/);
  assert.doesNotMatch(esmReact, /require\(/);
  assert.match(cjsReact, /require\("\.\.\/i18n\/core\.js"\)/);
  // a Node ESM consumer can load the React entry (every relative import carries its extension)
  const load = runNode(['--input-type=module', '-e', `import * as R from '@congeo/design/react'; console.log(Object.keys(R).length);`]);
  assert.equal(load.code, 0, load.out);
  assert.ok(Number(load.out.split('\n').pop()) > 30);
});
