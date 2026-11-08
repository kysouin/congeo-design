'use strict';
// The shared language in a browser: a local server behind a.congeo.test / b.congeo.test (host-resolver-rules),
// cookie Domain=.congeo.test. Default English for an el-GR browser. <html lang> before anything mounts.
// Greek uppercase still drops accents with the switch on Greek.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { serve } = require('./helpers');

let pw;
try {
  pw = require('playwright');
} catch {
  pw = null;
}

const launch = () => pw.chromium.launch({ args: ['--host-resolver-rules=MAP *.congeo.test 127.0.0.1'] });

const skip = !pw && 'playwright not installed';

test('shared cookie: Greek on a.congeo.test → b.congeo.test loads in Greek; English on b → a follows on visibilitychange', { skip }, async () => {
  const { server, port } = await serve();
  const browser = await launch();
  try {
    const ctx = await browser.newContext({ locale: 'el-GR', viewport: { width: 390, height: 844 } });
    const a = await ctx.newPage();
    await a.goto(`http://a.congeo.test:${port}/site/index.html`);
    await a.waitForSelector('#lang-table tbody tr');
    assert.equal(await a.evaluate(() => document.documentElement.lang), 'en', 'an el-GR browser with no cookie opens in English');
    assert.equal(await a.evaluate(() => document.querySelector('#lang-current').textContent), 'en');

    await a.click('#lang-switch [role="radio"]:nth-child(2)'); // ΕΛ
    assert.equal(await a.evaluate(() => document.documentElement.lang), 'el');
    const cookies = await ctx.cookies(`http://b.congeo.test:${port}/`);
    const c = cookies.find((x) => x.name === 'congeo_lang');
    assert.ok(c, 'cookie set');
    assert.equal(c.value, 'el');
    assert.equal(c.domain, '.congeo.test');
    assert.equal(c.path, '/');
    assert.equal(c.sameSite, 'Lax');
    assert.ok(c.expires - Date.now() / 1000 > 360 * 86400, 'about a year');

    const b = await ctx.newPage();
    const langAtDcl = [];
    await b.addInitScript(() => {
      document.addEventListener('DOMContentLoaded', () => {
        window.__langAtDCL = document.documentElement.lang;
      });
    });
    await b.goto(`http://b.congeo.test:${port}/site/index.html`);
    await b.waitForSelector('#lang-table tbody tr');
    langAtDcl.push(await b.evaluate(() => window.__langAtDCL));
    assert.deepEqual(langAtDcl, ['el'], '<html lang> is el before DOMContentLoaded, i.e. before anything mounts');
    assert.equal(await b.evaluate(() => document.documentElement.lang), 'el');
    assert.equal(await b.evaluate(() => document.querySelector('#lang-table tbody tr td:nth-child(2)').textContent), 'Πέμπτη 12 Νοεμβρίου 2026', 'the live table shows the current language first');

    await b.click('#lang-switch [role="radio"]:nth-child(1)'); // EN
    assert.equal(await b.evaluate(() => document.documentElement.lang), 'en');

    // back to a: it is still open in Greek; a visibility change makes it re-read the shared choice
    assert.equal(await a.evaluate(() => document.documentElement.lang), 'el');
    await a.bringToFront();
    await a.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    assert.equal(await a.evaluate(() => document.documentElement.lang), 'en', 'a turned English on visibilitychange');
    assert.equal(await a.evaluate(() => document.querySelector('#lang-current').textContent), 'en');
    await ctx.close();
  } finally {
    await browser.close();
    server.close();
  }
});

test('default: an el-GR browser with no cookie and no storage opens in English; localStorage fallback off-domain', { skip }, async () => {
  const { server, port } = await serve();
  const browser = await launch();
  try {
    const ctx = await browser.newContext({ locale: 'el-GR' });
    const p = await ctx.newPage();
    await p.goto(`http://127.0.0.1:${port}/site/index.html`); // not a cookie domain: localStorage only
    await p.waitForSelector('#lang-table tbody tr');
    assert.equal(await p.evaluate(() => navigator.language), 'el-GR');
    assert.equal(await p.evaluate(() => document.documentElement.lang), 'en');
    await p.click('#lang-switch [role="radio"]:nth-child(2)');
    assert.equal(await p.evaluate(() => localStorage.getItem('congeo.lang')), 'el');
    assert.equal((await ctx.cookies()).filter((c) => c.name === 'congeo_lang').length, 0, 'no cookie off the shared domain');
    await p.reload();
    await p.waitForSelector('#lang-table tbody tr');
    assert.equal(await p.evaluate(() => document.documentElement.lang), 'el', 'remembered through localStorage');
    await ctx.close();
  } finally {
    await browser.close();
    server.close();
  }
});

test('greek uppercase: with the switch on Greek, the rendered caption has no accent', { skip }, async () => {
  const { server, port } = await serve();
  const browser = await launch();
  try {
    const p = await browser.newPage();
    await p.goto(`http://a.congeo.test:${port}/site/index.html`);
    await p.waitForSelector('#lang-table tbody tr');
    await p.click('#lang-switch [role="radio"]:nth-child(2)');
    await p.evaluate(() => document.fonts.ready);
    const res = await p.evaluate(() => {
      const el = document.querySelector('#lang-caption');
      return { lang: document.documentElement.lang, source: el.textContent, rendered: el.innerText };
    });
    assert.equal(res.lang, 'el');
    assert.equal(res.source, 'Εβδομάδα · Πρόταση · Έγινε');
    assert.equal(res.rendered, 'ΕΒΔΟΜΑΔΑ · ΠΡΟΤΑΣΗ · ΕΓΙΝΕ');
    assert.deepEqual(res.rendered.normalize('NFD').match(/[̀-ͯ]/g) || [], []);
    // and the switch itself reads right: EN in English, ΕΛ in Greek
    const labels = await p.$$eval('#lang-switch [role="radio"]', (els) => els.map((e) => e.textContent + '|' + e.querySelector('span').getAttribute('aria-label')));
    assert.deepEqual(labels, ['EN|English', 'ΕΛ|Ελληνικά']);
    await p.close();
  } finally {
    await browser.close();
    server.close();
  }
});
