'use strict';
// Check 4: Playwright screenshots of the reference page at 320 / 390 / 1280, light and dark (+ WebKit if available).
// Check 5: the rendered Greek caption, read off the DOM, has no accent.
// Also: no sideways scroll at any width, no page errors, fonts loaded.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { root } = require('./helpers');

let pw;
try {
  pw = require('playwright');
} catch {
  pw = null;
}

const url = 'file://' + path.join(root, 'site/index.html');
const shots = path.join(root, 'site/screenshots');
const WIDTHS = [320, 390, 1280];
const THEMES = ['light', 'dark'];

async function launchChromium() {
  try {
    return await pw.chromium.launch();
  } catch (e) {
    if (process.env.CG_CHROMIUM) return pw.chromium.launch({ executablePath: process.env.CG_CHROMIUM });
    throw e;
  }
}

test('browser: screenshots at three widths, light and dark; no sideways scroll; no errors', { skip: !pw && 'playwright not installed' }, async () => {
  fs.mkdirSync(shots, { recursive: true });
  const browser = await launchChromium();
  try {
    for (const theme of THEMES) {
      for (const width of WIDTHS) {
        const ctx = await browser.newContext({ viewport: { width, height: 844 }, colorScheme: theme, deviceScaleFactor: 1 });
        const page = await ctx.newPage();
        const errors = [];
        page.on('pageerror', (e) => errors.push(e.message));
        page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
        await page.goto(url);
        await page.evaluate(() => document.fonts.ready);
        const info = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          bg: getComputedStyle(document.body).backgroundColor,
          fonts: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight}`),
          overflowing: [...document.querySelectorAll('.cg-row__title')].filter((el) => el.scrollWidth > el.clientWidth + 1).length,
        }));
        assert.deepEqual(errors, [], `${theme} ${width}: page errors`);
        assert.ok(info.scrollWidth <= info.clientWidth, `${theme} ${width}: page scrolls sideways (${info.scrollWidth} > ${info.clientWidth})`);
        assert.equal(info.overflowing, 0, `${theme} ${width}: row titles that overflow instead of wrapping`);
        assert.equal(info.bg, theme === 'dark' ? 'rgb(10, 22, 34)' : 'rgb(243, 245, 247)', `${theme}: body background follows prefers-color-scheme`);
        assert.ok(info.fonts.some((f) => f.startsWith('Inter')), 'Inter loaded');
        assert.ok(info.fonts.some((f) => f.startsWith('JetBrains Mono')), 'JetBrains Mono loaded');
        const file = path.join(shots, `${theme}-${width}.png`);
        await page.screenshot({ path: file, fullPage: true });
        console.log(`screenshot ${path.relative(root, file)} (${width}px, ${theme})`);
        await ctx.close();
      }
    }
  } finally {
    await browser.close();
  }
});

test('browser: forced [data-theme] panels render both schemes on one page', { skip: !pw && 'playwright not installed' }, async () => {
  const browser = await launchChromium();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, colorScheme: 'light' });
    await page.goto(url);
    const bgs = await page.evaluate(() => ['#showcase-light', '#showcase-dark'].map((s) => getComputedStyle(document.querySelector(s)).backgroundColor));
    assert.deepEqual(bgs, ['rgb(243, 245, 247)', 'rgb(10, 22, 34)']);
    const btn = await page.evaluate(() => ['#showcase-light', '#showcase-dark'].map((s) => getComputedStyle(document.querySelector(`${s} .cg-btn--primary`)).backgroundColor));
    assert.deepEqual(btn, ['rgb(0, 174, 239)', 'rgb(0, 174, 239)']);
    // touch targets
    const sizes = await page.evaluate(() => {
      const el = document.querySelector('#showcase-light .cg-btn--icon');
      const b = el.getBoundingClientRect();
      const btn = document.querySelector('#showcase-light .cg-btn--primary').getBoundingClientRect();
      return { icon: [Math.round(b.width), Math.round(b.height)], primaryH: Math.round(btn.height) };
    });
    assert.deepEqual(sizes.icon, [44, 44]);
    assert.ok(sizes.primaryH >= 44);
    await page.close();
  } finally {
    await browser.close();
  }
});

test('greek: the rendered uppercase caption has no accent (read from the DOM, not the source)', { skip: !pw && 'playwright not installed' }, async () => {
  const browser = await launchChromium();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    const res = await page.evaluate(() => {
      const el = document.querySelector('#greek-check');
      const source = el.textContent;
      const rendered = el.innerText; // innerText applies text-transform: it is what the user sees
      // control: same text, same class, but English language context
      const ctl = document.createElement('span');
      ctl.className = 'cg-cap';
      ctl.lang = 'en';
      ctl.textContent = source;
      document.body.appendChild(ctl);
      const renderedEn = ctl.innerText;
      ctl.remove();
      return { source, rendered, renderedEn, lang: el.closest('[lang]').getAttribute('lang'), transform: getComputedStyle(el).textTransform };
    });
    console.log(`greek check: source "${res.source}" -> rendered "${res.rendered}" (lang=${res.lang}); with lang=en: "${res.renderedEn}"`);
    assert.equal(res.transform, 'uppercase');
    assert.equal(res.lang, 'el');
    assert.equal(res.rendered, 'ΕΒΔΟΜΑΔΑ · ΠΡΟΤΑΣΗ · ΕΓΙΝΕ');
    const marks = res.rendered.normalize('NFD').match(/[̀-ͯ]/g) || [];
    assert.deepEqual(marks, [], 'combining accents left in the rendered caption');
    assert.notEqual(res.rendered, res.source.toUpperCase(), 'String.toUpperCase keeps the tonos; the rendered text must not');
    await page.close();
  } finally {
    await browser.close();
  }
});

test('browser: WebKit screenshot once, if WebKit is available here', { skip: !pw && 'playwright not installed' }, async () => {
  let browser;
  try {
    browser = await pw.webkit.launch();
  } catch (e) {
    console.log(`webkit: not available (${String(e.message).split('\n')[0]}). Recorded, not a failure.`);
    fs.mkdirSync(shots, { recursive: true });
    fs.writeFileSync(path.join(shots, 'webkit.txt'), `WebKit was not available in this run.\n${String(e.message).split('\n')[0]}\n`);
    return;
  }
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    const file = path.join(shots, 'webkit-light-390.png');
    await page.screenshot({ path: file, fullPage: true });
    const greek = await page.evaluate(() => document.querySelector('#greek-check').innerText);
    fs.writeFileSync(path.join(shots, 'webkit.txt'), `WebKit ran. Greek caption rendered as: ${greek}\n`);
    console.log(`webkit: ok, screenshot ${path.relative(root, file)}; greek caption "${greek}"`);
  } finally {
    await browser.close();
  }
});
