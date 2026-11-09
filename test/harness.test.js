'use strict';
// Real-browser component tests: the React components mounted in Chromium with React running.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { root, serve } = require('./helpers');
const { buildHarness } = require('../scripts/build-harness');
const { cases } = require('./harness-cases');

let pw;
try {
  pw = require('playwright');
} catch {
  pw = null;
}
const skip = !pw && 'playwright not installed';

let server, port, browser;
test.before(async () => {
  if (!pw) return;
  await buildHarness();
  ({ server, port } = await serve());
  browser = await pw.chromium.launch();
});
test.after(async () => {
  if (browser) await browser.close();
  if (server) server.close();
});

const url = (q = '') => `http://127.0.0.1:${port}/test/harness/index.html${q}`;

async function open(opts = {}, q = '') {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, hasTouch: true, ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  if (opts.clock) await page.clock.install({ time: new Date('2026-11-12T09:00:00+02:00') });
  await page.goto(url(q));
  await page.waitForSelector('[data-case="titleblock"] .cg-titleblock');
  return { ctx, page, errors };
}

const run = (name, fn, opts = {}, q = '') =>
  test(`harness: ${name}`, { skip }, async () => {
    const { ctx, page, errors } = await open(opts, q);
    try {
      await fn(page);
      assert.deepEqual(errors, [], 'page errors');
    } finally {
      await ctx.close();
    }
  });

run('SwipeRow: a right drag past the threshold → onDone once, springs back', cases.swipeRightDone);
run('SwipeRow: a left drag → onLater', cases.swipeLeftLater);
run('SwipeRow: a short drag springs back with no callback', cases.swipeShortSpringsBack);
run('SwipeRow: a vertical touch drag on the row scrolls the page and fires nothing', cases.swipeVerticalScrolls, { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
run('Sheet: a drag down on the grabber closes it', cases.sheetDragCloses, { viewport: { width: 390, height: 844 } });
run('Sheet: a short drag springs back', cases.sheetShortDragSpringsBack, { viewport: { width: 390, height: 844 } });
run('Sheet: Escape closes it and focus returns to the opener; Tab stays inside', cases.sheetEscapeReturnsFocus);
run('Segmented: arrow keys, Home/End, roles radiogroup/radio', cases.segmentedKeyboard);
run('Textarea: grows with the text; Enter calls onSubmit', cases.textareaGrowsAndSubmits);
run('DateField: typing 12112026 gives 2026-11-12 (locale forced to en-US)', cases.dateFieldTyping, { locale: 'en-US' });
run('DateField: a wrong day shows the error', cases.dateFieldWrongDay);
run('DateField: the picker is Monday-first and sets the value', cases.dateFieldPicker);
run('TimeField: 930 → 09:30; 2400 refused', cases.timeFieldTyping, { locale: 'en-US' });
run('TimeField: the 5-minute list sets the value', cases.timeFieldPicker);
run('Select: native, label associated, value changes, disabled and error states', cases.selectWorks);
run('StatusBar ok: auto-hides at 4 s with a mocked clock; persist keeps it', cases.statusBarOkAutoHides, { clock: true });
run('ProposalCard: Reject (secondary) left, Approve (primary) right', cases.proposalOrder);
run('TitleBlock: 5 cells in one row at 1280 px', cases.titleBlockLayout, { viewport: { width: 1280, height: 900 } });
run('TitleBlock: 5 cells in two columns at 390 px, the number first and full-width', cases.titleBlockLayout, { viewport: { width: 390, height: 844 } });
run('TitleBlock: at 320 px', cases.titleBlockLayout, { viewport: { width: 320, height: 700 } });
run('Dialog: a centred modal at 1280 px; Escape closes and focus returns', cases.dialogContainer, { viewport: { width: 1280, height: 900 } });
run('Dialog: a bottom sheet at 390 px; Escape closes and focus returns', cases.dialogContainer, { viewport: { width: 390, height: 844 } });
run('Switch: toggles by click, Space and Enter; role switch; 44 px', cases.switchToggles);
run('RadioList: arrow keys move the selection, Home/End, one tab stop, trailing mark', cases.radioListKeyboard);
run('IconButton: aria-label present, 44 vs 36 measured, tooltip on hover', cases.iconButtonSizes, { hasTouch: false });
run('Progress: «3 of 7», aria values, indeterminate animates', cases.progressText);
run('Progress: «3 από 7» in Greek', cases.progressText, {}, '?lang=el');
run('Greek: the same cases read right in Greek (fields, select, proposal, picker heads)', async (page) => {
  await cases.dateFieldTyping(page);
  await cases.dateFieldPicker(page);
  await cases.selectWorks(page);
  await cases.proposalOrder(page);
  assert.equal(await page.locator('[data-case="proposal"] .cg-proposal__actions button').first().textContent(), 'Απόρριψη');
}, {}, '?lang=el');

test('harness: visual runs at 1280 / 390 / 320, light and dark (and Greek at 390)', { skip }, async () => {
  const dir = path.join(root, 'site/screenshots/harness');
  fs.mkdirSync(dir, { recursive: true });
  for (const [w, h] of [[1280, 900], [390, 844], [320, 700]]) {
    for (const theme of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: theme });
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(url(`?theme=${theme}`));
      await page.waitForSelector('[data-case="titleblock"] .cg-titleblock');
      await page.evaluate(() => document.fonts.ready);
      // open the date picker and the sheet-less states for the picture
      await page.click('[data-case="fields"] .cg-datefield .cg-btn--icon');
      await page.locator('.cg-popover [role="grid"]').waitFor();
      await page.click('#sw');
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      assert.ok(sw <= w, `${theme} ${w}: no sideways scroll (${sw})`);
      assert.deepEqual(errors, []);
      await page.screenshot({ path: path.join(dir, `${theme}-${w}.png`), fullPage: false, clip: { x: 0, y: 0, width: w, height: Math.min(h * 2, 2400) }, fullPage: true });
      await ctx.close();
    }
  }
  for (const theme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: theme });
    const page = await ctx.newPage();
    await page.goto(url(`?theme=${theme}&lang=el`));
    await page.waitForSelector('[data-case="titleblock"] .cg-titleblock');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(dir, `${theme}-390-el.png`), fullPage: true });
    await ctx.close();
  }
});

test('harness: WebKit, if available here', { skip }, async () => {
  let wk;
  try {
    wk = await pw.webkit.launch();
  } catch (e) {
    console.log(`webkit harness: not available (${String(e.message).split('\n')[0]})`);
    fs.appendFileSync(path.join(root, 'site/screenshots/webkit.txt'), `Harness in WebKit: not available.\n`);
    return;
  }
  try {
    const page = await wk.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(url());
    await page.waitForSelector('[data-case="titleblock"] .cg-titleblock');
    await cases.dateFieldTyping(page);
    await cases.selectWorks(page);
    await cases.proposalOrder(page);
    fs.appendFileSync(path.join(root, 'site/screenshots/webkit.txt'), `Harness in WebKit: ran (DateField, Select, ProposalCard).\n`);
  } finally {
    await wk.close();
  }
});
