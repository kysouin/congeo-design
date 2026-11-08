'use strict';
// The real-browser cases, as functions of a Playwright page, so the proof test can run the same ones
// against a deliberately broken bundle and expect them to fail.
const assert = require('node:assert/strict');

const events = (page) => page.evaluate(() => window.__events.map((e) => e.name));
const clearEvents = (page) => page.evaluate(() => (window.__events = []));

async function dragMouse(page, from, to, steps = 12) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  for (let i = 1; i <= steps; i++) await page.mouse.move(from.x + ((to.x - from.x) * i) / steps, from.y + ((to.y - from.y) * i) / steps);
  await page.mouse.up();
}

async function swipeBox(page) {
  const box = await page.locator('[data-case="swipe"] .cg-swipe').boundingBox();
  return { box, y: box.y + box.height / 2, x0: box.x + 40 };
}

const cases = {
  async swipeRightDone(page) {
    await clearEvents(page);
    const { y, x0 } = await swipeBox(page);
    await dragMouse(page, { x: x0, y }, { x: x0 + 140, y });
    await page.waitForTimeout(50);
    const ev = await events(page);
    assert.deepEqual(ev.filter((e) => e === 'done' || e === 'later'), ['done'], `events: ${ev}`);
    assert.ok(ev.includes('haptic'), 'haptic callback on arm/commit');
    const x = await page.locator('[data-case="swipe"] .cg-swipe').evaluate((el) => getComputedStyle(el).getPropertyValue('--cg-swipe-x').trim());
    assert.equal(x, '0px', 'springs back after commit');
  },
  async swipeLeftLater(page) {
    await clearEvents(page);
    const { y, box } = await swipeBox(page);
    const x0 = box.x + box.width - 40;
    await dragMouse(page, { x: x0, y }, { x: x0 - 140, y });
    await page.waitForTimeout(50);
    const ev = await events(page);
    assert.deepEqual(ev.filter((e) => e === 'done' || e === 'later'), ['later'], `events: ${ev}`);
  },
  async swipeShortSpringsBack(page) {
    await clearEvents(page);
    const { y, x0 } = await swipeBox(page);
    await page.mouse.move(x0, y);
    await page.mouse.down();
    await page.mouse.move(x0 + 20, y);
    await page.mouse.move(x0 + 40, y);
    const mid = await page.locator('[data-case="swipe"] .cg-swipe').evaluate((el) => el.style.getPropertyValue('--cg-swipe-x'));
    assert.notEqual(mid, '0px', 'the content follows the finger');
    await page.mouse.up();
    await page.waitForTimeout(50);
    const ev = await events(page);
    assert.deepEqual(ev.filter((e) => e === 'done' || e === 'later'), [], `no callback on a short drag: ${ev}`);
    const x = await page.locator('[data-case="swipe"] .cg-swipe').evaluate((el) => el.style.getPropertyValue('--cg-swipe-x'));
    assert.equal(x, '0px', 'springs back');
  },
  /** A vertical touch drag that starts on the row scrolls the page and fires nothing. Chromium only (CDP touch). */
  async swipeVerticalScrolls(page) {
    await clearEvents(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    const { box } = await swipeBox(page);
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    const client = await page.context().newCDPSession(page);
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let i = 1; i <= 12; i++) {
      await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + i * 0.6, y: y - i * 25 }] });
    }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await client.detach();
    await page.waitForTimeout(150);
    const scrollY = await page.evaluate(() => window.scrollY);
    const ev = await events(page);
    assert.ok(scrollY > 50, `the page scrolled (scrollY=${scrollY})`);
    assert.deepEqual(ev.filter((e) => e === 'done' || e === 'later'), [], `no callback: ${ev}`);
    const tx = await page.locator('[data-case="swipe"] .cg-swipe').evaluate((el) => el.style.getPropertyValue('--cg-swipe-x'));
    assert.ok(tx === '' || tx === '0px', `content not displaced: ${tx}`);
  },

  async sheetDragCloses(page) {
    await clearEvents(page);
    await page.click('#open-sheet');
    const sheet = page.locator('.cg-sheet');
    await sheet.waitFor();
    await sheet.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished))); // the rise animation moves the grabber
    const box = await sheet.boundingBox();
    const g = await page.locator('.cg-sheet__grabber').boundingBox();
    const from = { x: g.x + g.width / 2, y: g.y + g.height / 2 };
    await dragMouse(page, from, { x: from.x, y: from.y + box.height * 0.5 });
    await page.waitForTimeout(50);
    assert.equal(await page.locator('#sheet-state').textContent(), 'closed');
    assert.deepEqual(await events(page), ['sheet-close']);
  },
  async sheetShortDragSpringsBack(page) {
    await clearEvents(page);
    await page.click('#open-sheet');
    const sheet = page.locator('.cg-sheet');
    await sheet.waitFor();
    await sheet.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished))); // the rise animation moves the grabber
    const box = await sheet.boundingBox();
    const g = await page.locator('.cg-sheet__grabber').boundingBox();
    const from = { x: g.x + g.width / 2, y: g.y + g.height / 2 };
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(from.x, from.y + 20);
    await page.mouse.move(from.x, from.y + Math.round(box.height * 0.1));
    const mid = await sheet.evaluate((el) => el.style.transform);
    assert.match(mid, /translateY\(\d+px\)/, 'follows the finger');
    await page.mouse.up();
    await page.waitForTimeout(50);
    assert.equal(await page.locator('#sheet-state').textContent(), 'open', 'still open after a short drag');
    assert.equal(await sheet.evaluate((el) => el.style.transform), '', 'sprang back');
    assert.deepEqual(await events(page), []);
    await page.keyboard.press('Escape');
    await page.waitForSelector('.cg-sheet', { state: 'detached' });
  },
  async sheetEscapeReturnsFocus(page) {
    await clearEvents(page);
    await page.focus('#open-sheet');
    await page.keyboard.press('Enter');
    await page.locator('.cg-sheet').waitFor();
    const focusedInside = await page.evaluate(() => document.querySelector('.cg-sheet').contains(document.activeElement));
    assert.ok(focusedInside, 'focus moved into the sheet');
    // Tab cycles inside
    for (let i = 0; i < 6; i++) await page.keyboard.press('Tab');
    assert.ok(await page.evaluate(() => document.querySelector('.cg-sheet').contains(document.activeElement)), 'focus stays trapped');
    await page.keyboard.press('Escape');
    await page.waitForSelector('.cg-sheet', { state: 'detached' });
    assert.deepEqual(await events(page), ['sheet-close']);
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'open-sheet', 'focus returned to the opener');
  },

  async segmentedKeyboard(page) {
    const group = page.locator('[data-case="segmented"] [role="radiogroup"]');
    assert.equal(await group.count(), 1);
    assert.equal(await group.locator('[role="radio"]').count(), 3);
    await group.locator('[role="radio"][aria-checked="true"]').focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#seg-value').textContent(), 'm');
    await page.keyboard.press('End');
    assert.equal(await page.locator('#seg-value').textContent(), 'y');
    await page.keyboard.press('Home');
    assert.equal(await page.locator('#seg-value').textContent(), 'w');
    await page.keyboard.press('ArrowLeft');
    assert.equal(await page.locator('#seg-value').textContent(), 'y', 'wraps');
    const focusedChecked = await page.evaluate(() => document.activeElement.getAttribute('aria-checked'));
    assert.equal(focusedChecked, 'true', 'focus follows the selection');
  },

  async textareaGrowsAndSubmits(page) {
    await clearEvents(page);
    const ta = page.locator('#ta');
    const h0 = (await ta.boundingBox()).height;
    await ta.fill('one\ntwo\nthree\nfour');
    await page.waitForTimeout(50);
    const h1 = (await ta.boundingBox()).height;
    assert.ok(h1 > h0 + 40, `grew from ${h0} to ${h1}`);
    await ta.press('Enter');
    assert.deepEqual(await events(page), ['submit']);
    assert.equal(await ta.inputValue(), 'one\ntwo\nthree\nfour', 'Enter did not add a line');
  },

  async dateFieldTyping(page) {
    await clearEvents(page);
    const input = page.locator('#date');
    await input.fill('');
    await input.pressSequentially('12112026');
    assert.equal(await input.inputValue(), '12/11/2026', 'the mask inserts the slashes, DD/MM/YYYY whatever the locale');
    assert.equal(await page.locator('#date-value').textContent(), '2026-11-12');
    assert.equal(await page.locator('#date').getAttribute('aria-invalid'), null);
  },
  async dateFieldWrongDay(page) {
    const input = page.locator('#date');
    await input.fill('');
    await input.pressSequentially('32112026');
    await input.blur();
    assert.equal(await input.getAttribute('aria-invalid'), 'true');
    const hint = await page.locator('[data-case="fields"] .cg-field--error .cg-field__hint').first().textContent();
    assert.match(hint, /valid date|έγκυρη ημερομηνία/);
  },
  async dateFieldPicker(page) {
    await page.click('[data-case="fields"] .cg-datefield .cg-btn--icon');
    const grid = page.locator('.cg-popover [role="grid"]');
    await grid.waitFor();
    const heads = await grid.locator('[role="columnheader"]').allTextContents();
    assert.equal(heads[0].toLowerCase(), (await page.evaluate(() => document.documentElement.lang)) === 'el' ? 'δε' : 'mo', 'Monday first');
    await grid.locator('[role="gridcell"][aria-label="2026-11-20"]').click();
    assert.equal(await page.locator('#date-value').textContent(), '2026-11-20');
    assert.equal(await page.locator('#date').inputValue(), '20/11/2026');
    assert.equal(await page.locator('.cg-popover').count(), 0, 'picker closed');
  },

  async timeFieldTyping(page) {
    const input = page.locator('#time');
    await input.fill('');
    await input.pressSequentially('930');
    await input.blur();
    assert.equal(await input.inputValue(), '09:30');
    assert.equal(await page.locator('#time-value').textContent(), '09:30');
    await input.fill('');
    await input.pressSequentially('2400');
    await input.blur();
    assert.equal(await input.getAttribute('aria-invalid'), 'true', '24:00 refused');
    assert.equal(await page.locator('#time-value').textContent(), '09:30', 'value unchanged');
    await input.fill('');
    await input.pressSequentially('14:05');
    assert.equal(await page.locator('#time-value').textContent(), '14:05');
  },
  async timeFieldPicker(page) {
    await page.click('[data-case="fields"] .cg-timefield .cg-btn--icon');
    const list = page.locator('.cg-popover[role="listbox"]');
    await list.waitFor();
    assert.equal(await list.locator('[role="option"]').count(), 288, '5-minute steps');
    await list.locator('[role="option"]', { hasText: '14:35' }).click();
    assert.equal(await page.locator('#time-value').textContent(), '14:35');
  },

  async selectWorks(page) {
    await clearEvents(page);
    const sel = page.getByLabel(/^(Project|Έργο)$/);
    assert.equal(await sel.evaluate((el) => el.tagName), 'SELECT', 'native select');
    await sel.selectOption('0712');
    assert.equal(await page.locator('#select-value').textContent(), '0712');
    assert.deepEqual(await events(page), ['select']);
    assert.equal(await page.getByLabel(/^(Disabled|Ανενεργό)$/).isDisabled(), true);
    assert.equal(await page.getByLabel(/^(With error|Με σφάλμα)$/).getAttribute('aria-invalid'), 'true');
  },

  async statusBarOkAutoHides(page) {
    await clearEvents(page);
    await page.click('#status-ok');
    const bar = page.locator('#status-out .cg-statusbar--ok');
    await bar.waitFor();
    assert.match(await bar.textContent(), /3 changes sent|Στάλθηκαν 3 αλλαγές|3/);
    await page.clock.fastForward(3900);
    assert.equal(await bar.count(), 1, 'still shown just before 4 s');
    await page.clock.fastForward(200);
    await page.waitForSelector('#status-out .cg-statusbar--ok', { state: 'detached' });
    assert.deepEqual(await events(page), ['status-hide']);
    await clearEvents(page);
    await page.click('#status-persist');
    await page.locator('#status-out .cg-statusbar--ok').waitFor();
    await page.clock.fastForward(10000);
    assert.equal(await page.locator('#status-out .cg-statusbar--ok').count(), 1, 'persist keeps it');
    assert.deepEqual(await events(page), []);
  },

  async proposalOrder(page) {
    await clearEvents(page);
    const buttons = page.locator('[data-case="proposal"] .cg-proposal__actions button');
    assert.equal(await buttons.count(), 2);
    const classes = await buttons.evaluateAll((els) => els.map((e) => e.className));
    assert.match(classes[0], /cg-btn--secondary/);
    assert.match(classes[1], /cg-btn--primary/);
    const texts = await buttons.allTextContents();
    assert.match(texts[0], /^(Reject|Απόρριψη)$/);
    assert.match(texts[1], /^(Approve|Έγκριση)$/);
    await buttons.nth(1).click();
    await buttons.nth(0).click();
    assert.deepEqual(await events(page), ['approve', 'reject']);
    assert.equal(await buttons.evaluateAll((els) => els.every((e) => e.getAttribute('type') === 'button')), true);
  },

  async titleBlockLayout(page) {
    const cells = page.locator('[data-case="titleblock"] .cg-titleblock__cell');
    assert.equal(await cells.count(), 5);
    const width = await page.evaluate(() => window.innerWidth);
    const boxes = await cells.evaluateAll((els) => els.map((e) => ({ x: e.offsetLeft, y: e.offsetTop, w: e.offsetWidth, cls: e.className })));
    assert.match(boxes[0].cls, /cg-titleblock__cell--number/, 'the number is the first cell');
    const tb = await page.locator('[data-case="titleblock"] .cg-titleblock').evaluate((e) => e.clientWidth);
    if (width >= 640) {
      assert.ok(boxes.every((b) => b.y === boxes[0].y), `one row at ${width}px: ${JSON.stringify(boxes.map((b) => b.y))}`);
    } else {
      assert.ok(Math.abs(boxes[0].w - tb) < 4, `the number cell is full-width (${boxes[0].w} of ${tb})`);
      const xs = new Set(boxes.slice(1).map((b) => b.x));
      assert.ok(xs.size <= 2, `two columns at ${width}px: ${[...xs]}`);
      assert.ok(boxes[1].y > boxes[0].y, 'the others start below the number');
    }
  },

  /** Dialog: a centred modal from 900 px up, a bottom sheet below. */
  async dialogContainer(page) {
    await clearEvents(page);
    await page.click('#open-dialog');
    const dlg = page.locator('[role="dialog"].cg-dialog');
    await dlg.waitFor();
    await dlg.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
    const width = await page.evaluate(() => window.innerWidth);
    const cls = await dlg.getAttribute('class');
    const box = await dlg.boundingBox();
    const vp = await page.evaluate(() => ({ w: window.innerWidth, h: window.innerHeight }));
    if (width >= 900) {
      assert.match(cls, /cg-dialog--modal/, `modal at ${width}px`);
      assert.doesNotMatch(cls, /cg-sheet/);
      const centreX = box.x + box.width / 2;
      assert.ok(Math.abs(centreX - vp.w / 2) < 4, `horizontally centred (${centreX} vs ${vp.w / 2})`);
      assert.ok(box.y > 40 && box.y + box.height < vp.h - 40, 'floats, not glued to the bottom');
      assert.ok(box.width <= 560 + 1, `max-width 560 (${box.width})`);
    } else {
      assert.match(cls, /cg-sheet/, `sheet at ${width}px`);
      assert.match(cls, /cg-dialog--sheet/);
      assert.ok(Math.abs(box.y + box.height - vp.h) < 2, 'glued to the bottom');
      assert.ok(await page.locator('.cg-sheet__grabber').count() === 1);
    }
    // footer order: secondary left, primary right
    const classes = await page.locator('.cg-dialog__foot .cg-btn').evaluateAll((els) => els.map((e) => e.className));
    assert.match(classes[0], /secondary/);
    assert.match(classes[1], /primary/);
    // focus inside, Escape closes, focus returns
    assert.ok(await page.evaluate(() => document.querySelector('[role="dialog"].cg-dialog').contains(document.activeElement)), 'focus moved into the dialog');
    await page.keyboard.press('Escape');
    await page.waitForSelector('[role="dialog"].cg-dialog', { state: 'detached' });
    assert.deepEqual(await events(page), ['dialog-close']);
    assert.equal(await page.locator('#dialog-state').textContent(), 'closed');
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'open-dialog', 'focus returned to the opener');
  },

  async switchToggles(page) {
    await clearEvents(page);
    const sw = page.locator('#sw');
    assert.equal(await sw.getAttribute('role'), 'switch');
    const box = await sw.boundingBox();
    assert.ok(box.height >= 44, `44 px target (${box.height})`);
    await sw.click();
    assert.equal(await sw.getAttribute('aria-checked'), 'true');
    await sw.focus();
    await page.keyboard.press('Space');
    assert.equal(await sw.getAttribute('aria-checked'), 'false');
    await page.keyboard.press('Enter');
    assert.equal(await sw.getAttribute('aria-checked'), 'true');
    assert.equal(await page.locator('#switch-value').textContent(), 'true');
    assert.deepEqual(await events(page), ['switch', 'switch', 'switch']);
    const name = await sw.evaluate((el) => el.textContent);
    assert.match(name, /Auto capture|Αυτόματη λήψη/);
  },

  async radioListKeyboard(page) {
    const group = page.locator('[data-case="radio"] [role="radiogroup"]');
    assert.equal(await group.locator('[role="radio"]').count(), 3);
    await group.locator('[role="radio"][aria-checked="true"]').focus();
    await page.keyboard.press('ArrowDown');
    assert.equal(await page.locator('#radio-value').textContent(), 'ranges');
    await page.keyboard.press('ArrowDown');
    assert.equal(await page.locator('#radio-value').textContent(), 'every');
    await page.keyboard.press('ArrowDown');
    assert.equal(await page.locator('#radio-value').textContent(), 'each', 'wraps');
    await page.keyboard.press('End');
    assert.equal(await page.locator('#radio-value').textContent(), 'every');
    await page.keyboard.press('Home');
    assert.equal(await page.locator('#radio-value').textContent(), 'each');
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-checked')), 'true');
    await group.locator('[role="radio"]').nth(1).click();
    assert.equal(await page.locator('#radio-value').textContent(), 'ranges');
    assert.equal(await group.locator('.cg-radio__mark').count(), 1, 'the trailing mark');
    const tabbable = await group.locator('[role="radio"][tabindex="0"]').count();
    assert.equal(tabbable, 1, 'one tab stop');
  },

  async iconButtonSizes(page) {
    const md = await page.locator('#ib-md').boundingBox();
    const sm = await page.locator('#ib-sm').boundingBox();
    assert.deepEqual([Math.round(md.width), Math.round(md.height)], [44, 44]);
    assert.deepEqual([Math.round(sm.width), Math.round(sm.height)], [36, 36]);
    assert.match(await page.locator('#ib-md').getAttribute('aria-label'), /Delete|Διαγραφή/);
    assert.equal(await page.locator('#ib-sm').getAttribute('data-tooltip'), await page.locator('#ib-sm').getAttribute('aria-label'));
    await page.locator('#ib-sm').hover();
    await page.waitForTimeout(450);
    const tip = await page.locator('#ib-sm').evaluate((el) => {
      const cs = getComputedStyle(el, '::after');
      return { content: cs.content, opacity: cs.opacity };
    });
    assert.match(tip.content, /Delete|Διαγραφή/);
    assert.ok(Number(tip.opacity) > 0.9, `tooltip shown on hover (opacity ${tip.opacity})`);
  },

  async progressText(page) {
    const det = page.locator('#prog-det [role="progressbar"]');
    assert.equal(await det.getAttribute('aria-valuenow'), '3');
    assert.equal(await det.getAttribute('aria-valuemax'), '7');
    const text = await page.locator('#prog-det .cg-progress__text').textContent();
    const lang = await page.evaluate(() => document.documentElement.lang);
    assert.equal(text, lang === 'el' ? '3 από 7' : '3 of 7');
    assert.equal(await det.getAttribute('aria-valuetext'), text);
    const w = await page.locator('#prog-det .cg-progress__bar').evaluate((el) => el.getBoundingClientRect().width / el.parentElement.getBoundingClientRect().width);
    assert.ok(Math.abs(w - 3 / 7) < 0.02, `bar at 3/7 (${w})`);
    const ind = page.locator('#prog-ind [role="progressbar"]');
    assert.equal(await ind.getAttribute('aria-busy'), 'true');
    assert.equal(await ind.getAttribute('aria-valuenow'), null);
    const anim = await page.locator('#prog-ind .cg-progress__bar').evaluate((el) => getComputedStyle(el).animationName);
    assert.equal(anim, 'cg-indeterminate');
  },
};

module.exports = { cases, events, clearEvents };
