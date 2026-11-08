'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { readTokens, root } = require('./helpers');

test('tokens: light and dark declare the same set of colour names', () => {
  const t = readTokens();
  assert.deepEqual(Object.keys(t.color.light).sort(), Object.keys(t.color.dark).sort());
});

test('tokens: values are hex or rgba, and every contrast pair references a real token', () => {
  const t = readTokens();
  for (const scheme of ['light', 'dark']) {
    for (const [k, v] of Object.entries(t.color[scheme])) {
      assert.match(v, /^(#[0-9A-F]{6}|rgba\(\d+,\d+,\d+,[0-9.]+\))$/, `${scheme}.${k} = ${v}`);
    }
  }
  for (const p of t.contrast.pairs) {
    assert.ok(t.color.light[p.fg], `fg ${p.fg}`);
    for (const b of p.bg) assert.ok(t.color.light[b], `bg ${b}`);
  }
});

test('tokens: fixed values from the approved mockups are intact', () => {
  const t = readTokens();
  assert.equal(t.color.light.bg, '#F3F5F7');
  assert.equal(t.color.light.primary, '#00AEEF');
  assert.equal(t.color.light['on-primary'], '#0A1622');
  assert.equal(t.color.dark.bg, '#0A1622');
  assert.equal(t.color.dark.link, '#5CCBF5');
  assert.equal(t.color.light['tool-rhoi'], '#1D5BB8');
  assert.equal(t.color.light['tool-trace'], '#B5541D');
  assert.equal(t.color.light['tool-permitflow'], '#0F766E');
  assert.deepEqual(Object.values(t.space), [4, 8, 12, 16, 20, 24, 32]);
  assert.deepEqual(t.radius, { chip: 6, row: 10, card: 14, 'card-lg': 16, sheet: 22, pill: 999 });
  assert.equal(t.touch, 44);
  assert.deepEqual(t.motion.duration, { fast: 120, base: 200, slow: 320 });
  assert.equal(t.motion.easing, 'cubic-bezier(.2,.8,.2,1)');
  assert.deepEqual(t.motion.spring, { damping: 18, stiffness: 220 });
});

test('dist: generated outputs carry the tokens', () => {
  const css = fs.readFileSync(path.join(root, 'dist/congeo.css'), 'utf8');
  assert.match(css, /--cg-bg: #F3F5F7;/);
  assert.match(css, /@media \(prefers-color-scheme: dark\)/);
  assert.match(css, /\[data-theme="dark"\]/);
  assert.match(css, /\.cg-btn--primary/);
  assert.match(css, /prefers-reduced-motion/);
  const fonts = fs.readFileSync(path.join(root, 'dist/fonts.css'), 'utf8');
  const imports = fonts.match(/@import/g) || [];
  assert.equal(imports.length, 6, 'Inter 400/500/600/700 + JetBrains Mono 500/600, nothing more');
  assert.doesNotMatch(fonts, /googleapis/);
  const tk = require(path.join(root, 'dist/tokens.js'));
  assert.equal(tk.light.color.bg, '#F3F5F7');
  assert.equal(tk.dark.color.bg, '#0A1622');
  assert.equal(tk.dark.tools.rhoi.label, 'Rhoi');
  assert.equal(tk.font.caps.textTransform, 'uppercase');
  const swift = fs.readFileSync(path.join(root, 'dist/Tokens.swift'), 'utf8');
  assert.match(swift, /public static let bg = CGDynamicColor\(light: CGTokenColor\(r: 243, g: 245, b: 247, a: 1\), dark: CGTokenColor\(r: 10, g: 22, b: 34, a: 1\)\)/);
  assert.match(swift, /public static let card: CGFloat = 14/);
  const tw = require(path.join(root, 'dist/tailwind.preset.js'));
  assert.equal(tw.theme.extend.colors.bg, 'var(--cg-bg)');
  assert.equal(tw.theme.extend.borderRadius.card, 'var(--cg-radius-card)');
  assert.ok(fs.existsSync(path.join(root, 'dist/react/index.js')));
  assert.ok(fs.existsSync(path.join(root, 'dist/react/index.d.ts')));
});

test('dist: inline.css is a minified subset under 12 KB, with inline.js / inline.mjs exporting it', () => {
  const css = fs.readFileSync(path.join(root, 'dist/inline.css'), 'utf8');
  const bytes = Buffer.byteLength(css);
  console.log(`inline.css: ${bytes} bytes`);
  assert.ok(bytes < 12 * 1024, `inline.css is ${bytes} bytes, limit 12288`);
  assert.ok(bytes < 12000, `inline.css is ${bytes} bytes, kept under 12000 for headroom`);
  for (const must of ['--cg-bg:#F3F5F7', '@media (prefers-color-scheme:dark)', '[data-theme="dark"]', '.cg-btn--primary', '.cg-input', '.cg-card', '.cg-statusbar--ok', '.cg-field__label', ':focus-visible']) {
    assert.ok(css.includes(must), `inline.css has ${must}`);
  }
  for (const not of ['.cg-swipe', '.cg-sheet', '.cg-tabbar', '.cg-datepicker', '/*']) assert.ok(!css.includes(not), `inline.css has no ${not}`);
  const { INLINE_CSS } = require(path.join(root, 'dist/inline.js'));
  assert.equal(INLINE_CSS, css.trim());
  const mjs = fs.readFileSync(path.join(root, 'dist/inline.mjs'), 'utf8');
  assert.match(mjs, /^export const INLINE_CSS = "/m);
  assert.match(fs.readFileSync(path.join(root, 'dist/inline.d.ts'), 'utf8'), /export declare const INLINE_CSS: string/);
});
