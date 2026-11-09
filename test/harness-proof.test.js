'use strict';
// Proof that the harness can fail: SwipeRow's vertical-scroll guard broken → its test fails; Sheet's threshold
// broken → the short-drag test fails. The bundles are built from patched sources in memory; nothing on disk changes.
const test = require('node:test');
const assert = require('node:assert/strict');
const { serve } = require('./helpers');
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
  await buildHarness({ name: 'broken-swipe', breakSwipeGuard: true });
  await buildHarness({ name: 'broken-sheet', breakSheetThreshold: true });
  await buildHarness({ name: 'broken-dialog', breakDialogBreakpoint: true });
  ({ server, port } = await serve());
  browser = await pw.chromium.launch();
});
test.after(async () => {
  if (browser) await browser.close();
  if (server) server.close();
});

async function withBundle(bundle, opts, fn) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, ...opts });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${port}/test/harness/index.html?bundle=${bundle}`);
  await page.waitForSelector('[data-case="titleblock"] .cg-titleblock');
  try {
    return await fn(page);
  } finally {
    await ctx.close();
  }
}

test('proof: with the vertical-scroll guard broken, the vertical-drag test fails', { skip }, async () => {
  await withBundle('broken-swipe', {}, async (page) => {
    await assert.rejects(() => cases.swipeVerticalScrolls(page), (e) => {
      console.log(`  broken-swipe → ${String(e.message).split('\n')[0]}`);
      return /scrolled|callback|displaced/.test(e.message);
    });
    // the control: the horizontal cases still pass on the broken bundle
    await cases.swipeRightDone(page);
  });
});

test('proof: with the threshold broken, the short-drag test fails (any drag closes the sheet)', { skip }, async () => {
  await withBundle('broken-sheet', {}, async (page) => {
    await assert.rejects(() => cases.sheetShortDragSpringsBack(page), (e) => {
      console.log(`  broken-sheet → ${String(e.message).split('\n')[0]}`);
      return /still open|sprang back/.test(e.message);
    });
  });
});

test('proof: with the 900 px breakpoint ignored, the Dialog-at-390 test fails (a modal where a sheet is due)', { skip }, async () => {
  await withBundle('broken-dialog', { viewport: { width: 390, height: 844 } }, async (page) => {
    await assert.rejects(() => cases.dialogContainer(page), (e) => {
      console.log(`  broken-dialog → ${String(e.message).split('\n')[0]}`);
      return /sheet at \d+px/.test(e.message);
    });
  });
});

test('proof: the unbroken bundle passes the same three cases', { skip }, async () => {
  await buildHarness();
  await withBundle('harness', {}, async (page) => {
    await cases.swipeVerticalScrolls(page);
    await cases.sheetShortDragSpringsBack(page);
    await cases.dialogContainer(page);
  });
});
