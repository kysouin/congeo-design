'use strict';
// The defect calendar-7 found in v1.2.0: with `import` resolving the ESM i18n and the components requiring the
// CJS one, there were two language states. A small Vite app, bundled as an app would, proves there is one.
// CG_PACKAGE_DIR points the fixture's @congeo/design at another checkout (e.g. v1.2.0) to see it fail.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { root, serve } = require('./helpers');

let pw;
try {
  pw = require('playwright');
} catch {
  pw = null;
}
const skip = !pw && 'playwright not installed';

const app = path.join(root, 'test/fixtures/vite-app');
const pkgDir = path.resolve(process.env.CG_PACKAGE_DIR || root);

function linkPackage() {
  const nm = path.join(app, 'node_modules/@congeo');
  fs.rmSync(path.join(app, 'node_modules'), { recursive: true, force: true });
  fs.mkdirSync(nm, { recursive: true });
  fs.symlinkSync(pkgDir, path.join(nm, 'design'), 'dir');
}

test('vite app: one language state across @congeo/design/i18n and @congeo/design/react', { skip }, async () => {
  linkPackage();
  const { build } = await import('vite');
  await build({ configFile: path.join(app, 'vite.config.mjs'), root: app });
  const built = fs.readFileSync(path.join(app, 'dist/index.html'), 'utf8');
  assert.match(built, /assets\//, 'bundled');
  // the bundle must hold one copy of the core (the symbol lookup makes two copies safe too, but one is the goal)
  const js = fs.readdirSync(path.join(app, 'dist/assets')).filter((f) => f.endsWith('.js')).map((f) => fs.readFileSync(path.join(app, 'dist/assets', f), 'utf8')).join('\n');
  const copies = (js.match(/congeo-lang-domains/g) || []).length;
  console.log(`  core copies in the bundle: ${copies} (package at ${path.relative(root, pkgDir) || '.'})`);

  const { server, port } = await serve();
  const browser = await pw.chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(`http://127.0.0.1:${port}/test/fixtures/vite-app/dist/index.html`);
    await page.waitForSelector('#switch [role="radio"]');
    assert.deepEqual(errors, []);
    const read = () =>
      page.evaluate(() => ({
        appTitle: document.querySelector('#app-title').textContent,
        appLang: document.querySelector('#app-lang').textContent,
        approve: document.querySelector('.cg-proposal__actions .cg-btn--primary').textContent,
        status: document.querySelector('.cg-statusbar__text').textContent,
        html: document.documentElement.lang,
        checked: document.querySelector('#switch [role="radio"][aria-checked="true"]').textContent,
      }));
    let s = await read();
    assert.equal(s.appTitle, 'Site visit');
    assert.equal(s.approve, 'Approve');

    // 1. setLang('el') from the app's own import: the app's L() and the component's label both turn Greek
    await page.evaluate(() => window.cgApp.setLang('el'));
    s = await read();
    assert.equal(s.appTitle, 'Επίσκεψη στο εργοτάξιο', "the app's own L() text");
    assert.equal(s.approve, 'Έγκριση', "a component's label");
    assert.equal(s.status, 'Εκτός σύνδεσης');
    assert.equal(s.checked, 'ΕΛ', 'the switch follows');
    assert.equal(s.html, 'el');

    // 2. the reverse: the component's LanguageSwitch changes the app's L()
    await page.click('#switch [role="radio"]:nth-child(1)');
    s = await read();
    assert.equal(s.appTitle, 'Site visit', "the switch changed the app's L() text back");
    assert.equal(s.approve, 'Approve');
    assert.equal(s.appLang, 'en');
    assert.equal(await page.evaluate(() => window.cgApp.getLang()), 'en', "the app's getLang sees the switch");
    await page.click('#switch [role="radio"]:nth-child(2)');
    s = await read();
    assert.equal(s.appTitle, 'Επίσκεψη στο εργοτάξιο');
    assert.equal(s.approve, 'Έγκριση');
  } finally {
    await browser.close();
    server.close();
  }
});
