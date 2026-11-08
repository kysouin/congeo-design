#!/usr/bin/env node
'use strict';
// Generates dist/ from tokens/tokens.json. Deterministic: no timestamps, sorted keys where order is not meaningful.
const fs = require('fs');
const path = require('path');
const { parseHex } = require('./lib/color');

const root = path.resolve(__dirname, '..');
const tokens = JSON.parse(fs.readFileSync(path.join(root, 'tokens/tokens.json'), 'utf8'));
const outDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, 'dist');

const HEADER = '/* Generated from tokens/tokens.json by scripts/build.js. Do not edit. */\n';

const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const px = (n) => `${n}px`;

function write(rel, content) {
  const file = path.join(outDir, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

// ---------- CSS ----------
function colorVars(scheme) {
  return Object.entries(tokens.color[scheme])
    .map(([k, v]) => `  --cg-${k}: ${v};`)
    .join('\n');
}
function shadowVars(scheme) {
  return Object.entries(tokens.shadow[scheme])
    .map(([k, v]) => `  --cg-shadow-${k}: ${v};`)
    .join('\n');
}
function staticVars() {
  const f = tokens.font;
  const lines = [];
  lines.push(`  --cg-font-sans: "${f.family.sans}", ${f.family.sansFallback};`);
  lines.push(`  --cg-font-mono: "${f.family.mono}", ${f.family.monoFallback};`);
  lines.push(`  --cg-mono-features: ${f.monoFeatures};`);
  for (const [k, v] of Object.entries(f.size)) {
    lines.push(`  --cg-size-${k}: ${px(v.px)};`);
    lines.push(`  --cg-line-${k}: ${px(v.line)};`);
  }
  lines.push(`  --cg-caps-tracking: ${f.caps.tracking};`);
  lines.push(`  --cg-title-tracking: ${f.title.tracking};`);
  for (const [k, v] of Object.entries(tokens.space)) lines.push(`  --cg-space-${k}: ${px(v)};`);
  for (const [k, v] of Object.entries(tokens.radius)) lines.push(`  --cg-radius-${k}: ${px(v)};`);
  lines.push(`  --cg-touch: ${px(tokens.touch)};`);
  for (const [k, v] of Object.entries(tokens.motion.duration)) lines.push(`  --cg-dur-${k}: ${v}ms;`);
  lines.push(`  --cg-ease: ${tokens.motion.easing};`);
  lines.push(`  --cg-icon-stroke: ${tokens.icon.stroke};`);
  for (const s of tokens.icon.sizes) lines.push(`  --cg-icon-${s}: ${px(s)};`);
  return lines.join('\n');
}

function buildCss() {
  const base = fs.readFileSync(path.join(root, 'src/css/base.css'), 'utf8');
  const components = fs.readFileSync(path.join(root, 'src/css/components.css'), 'utf8');
  return [
    HEADER,
    '/* 1. Tokens */',
    ':root {',
    '  color-scheme: light dark;',
    staticVars(),
    '}',
    '',
    ':root, [data-theme="light"] {',
    '  color-scheme: light;',
    colorVars('light'),
    shadowVars('light'),
    '}',
    '',
    '@media (prefers-color-scheme: dark) {',
    '  :root:not([data-theme="light"]) {',
    '    color-scheme: dark;',
    colorVars('dark').replace(/^/gm, '  '),
    shadowVars('dark').replace(/^/gm, '  '),
    '  }',
    '}',
    '',
    '[data-theme="dark"] {',
    '  color-scheme: dark;',
    colorVars('dark'),
    shadowVars('dark'),
    '}',
    '',
    '/* 2. Base */',
    base.trim(),
    '',
    '/* 3. Components */',
    components.trim(),
    '',
  ].join('\n');
}

// ---------- fonts.css ----------
function buildFontsCss() {
  const lines = [HEADER];
  for (const w of tokens.font.sansWeights) lines.push(`@import "@fontsource/inter/${w}.css";`);
  for (const w of tokens.font.monoWeights) lines.push(`@import "@fontsource/jetbrains-mono/${w}.css";`);
  return lines.join('\n') + '\n';
}

// ---------- tokens.js / tokens.d.ts ----------
function schemeObject(scheme) {
  const colors = {};
  for (const [k, v] of Object.entries(tokens.color[scheme])) colors[camel(k)] = v;
  return colors;
}
function toolsObject(scheme) {
  const out = {};
  for (const [id, meta] of Object.entries(tokens.tools)) {
    const c = tokens.color[scheme];
    out[id] = { label: meta.label, color: c[`tool-${id}`], tint: c[`tool-${id}-tint`], onTint: c[`tool-${id}-on-tint`] };
  }
  return out;
}
function rnShadow(value) {
  // "0 6px 16px rgba(10,22,34,.12)" -> RN shadow props + elevation
  const m = /^(-?\d+)(?:px)? (-?\d+)(?:px)? (-?\d+)(?:px)? rgba\((\d+),(\d+),(\d+),([.\d]+)\)$/.exec(value);
  if (!m) throw new Error(`Cannot parse shadow: ${value}`);
  const [, x, y, blur, r, g, b, a] = m;
  const hex = '#' + [r, g, b].map((n) => Number(n).toString(16).padStart(2, '0')).join('').toUpperCase();
  return {
    shadowColor: hex,
    shadowOffset: { width: Number(x), height: Number(y) },
    shadowRadius: Number(blur) / 2,
    shadowOpacity: Number(a),
    elevation: Math.max(1, Math.round(Number(blur) / 4)),
  };
}
function shadowsObject(scheme) {
  const out = {};
  for (const [k, v] of Object.entries(tokens.shadow[scheme])) out[k] = rnShadow(v);
  return out;
}
function fontObject() {
  const f = tokens.font;
  const size = {};
  const lineHeight = {};
  for (const [k, v] of Object.entries(f.size)) {
    size[`s${k}`] = v.px;
    lineHeight[`s${k}`] = v.line;
  }
  return {
    sans: f.family.sans,
    mono: f.family.mono,
    weight: f.weight,
    size,
    lineHeight,
    caps: { fontSize: f.caps.size, fontWeight: String(f.caps.weight), letterSpacing: f.caps.size * parseFloat(f.caps.tracking), textTransform: f.caps.transform },
    title: { fontSize: f.title.size, fontWeight: String(f.title.weight), letterSpacing: f.title.size * parseFloat(f.title.tracking) },
    monoFeatures: ['tnum'],
  };
}
function spaceObject() {
  const out = {};
  for (const [k, v] of Object.entries(tokens.space)) out[`s${k}`] = v;
  return out;
}
function radiusObject() {
  const out = {};
  for (const [k, v] of Object.entries(tokens.radius)) out[camel(k)] = v;
  return out;
}

function buildTokensJs() {
  const obj = {
    light: { color: schemeObject('light'), shadow: shadowsObject('light'), tools: toolsObject('light') },
    dark: { color: schemeObject('dark'), shadow: shadowsObject('dark'), tools: toolsObject('dark') },
    font: fontObject(),
    space: spaceObject(),
    radius: radiusObject(),
    touch: tokens.touch,
    motion: {
      duration: tokens.motion.duration,
      easing: tokens.motion.easing,
      easingPoints: tokens.motion.easing.replace(/^cubic-bezier\(|\)$/g, '').split(',').map(Number),
      spring: tokens.motion.spring,
    },
    icon: { stroke: tokens.icon.stroke, sizes: tokens.icon.sizes },
  };
  const json = JSON.stringify(obj, null, 2);
  const js = [
    HEADER.replace('/*', '//').replace('*/', '').trimEnd(),
    '// CommonJS so it loads in Metro (Expo), Node and bundlers alike.',
    `const tokens = ${json};`,
    '',
    'const light = tokens.light;',
    'const dark = tokens.dark;',
    'function scheme(name) { return name === "dark" ? dark : light; }',
    '',
    'module.exports = Object.assign({}, tokens, { tokens, light, dark, scheme });',
    'module.exports.default = module.exports;',
    '',
  ].join('\n');

  const colorKeys = Object.keys(schemeObject('light'));
  const dts = [
    HEADER,
    `export type ColorName = ${colorKeys.map((k) => JSON.stringify(k)).join(' | ')};`,
    `export type ToolId = ${Object.keys(tokens.tools).map((k) => JSON.stringify(k)).join(' | ')};`,
    `export type SizeKey = ${Object.keys(tokens.font.size).map((k) => JSON.stringify('s' + k)).join(' | ')};`,
    `export type SpaceKey = ${Object.keys(tokens.space).map((k) => JSON.stringify('s' + k)).join(' | ')};`,
    `export type RadiusKey = ${Object.keys(tokens.radius).map((k) => JSON.stringify(camel(k))).join(' | ')};`,
    `export type ShadowKey = ${Object.keys(tokens.shadow.light).map((k) => JSON.stringify(k)).join(' | ')};`,
    '',
    'export interface Shadow {',
    '  shadowColor: string;',
    '  shadowOffset: { width: number; height: number };',
    '  shadowRadius: number;',
    '  shadowOpacity: number;',
    '  elevation: number;',
    '}',
    'export interface Tool { label: string; color: string; tint: string; onTint: string; }',
    'export interface Scheme {',
    '  color: Record<ColorName, string>;',
    '  shadow: Record<ShadowKey, Shadow>;',
    '  tools: Record<ToolId, Tool>;',
    '}',
    'export interface Font {',
    '  sans: string;',
    '  mono: string;',
    '  weight: { regular: 400; medium: 500; semibold: 600; bold: 700 };',
    '  size: Record<SizeKey, number>;',
    '  lineHeight: Record<SizeKey, number>;',
    '  caps: { fontSize: number; fontWeight: string; letterSpacing: number; textTransform: "uppercase" };',
    '  title: { fontSize: number; fontWeight: string; letterSpacing: number };',
    '  monoFeatures: string[];',
    '}',
    'export interface Motion {',
    '  duration: { fast: number; base: number; slow: number };',
    '  easing: string;',
    '  easingPoints: [number, number, number, number];',
    '  spring: { damping: number; stiffness: number };',
    '}',
    'export interface Tokens {',
    '  light: Scheme;',
    '  dark: Scheme;',
    '  font: Font;',
    '  space: Record<SpaceKey, number>;',
    '  radius: Record<RadiusKey, number>;',
    '  touch: number;',
    '  motion: Motion;',
    '  icon: { stroke: number; sizes: number[] };',
    '}',
    'export declare const tokens: Tokens;',
    'export declare const light: Scheme;',
    'export declare const dark: Scheme;',
    'export declare function scheme(name: "light" | "dark"): Scheme;',
    'declare const _default: Tokens & { tokens: Tokens; light: Scheme; dark: Scheme; scheme: typeof scheme };',
    'export default _default;',
    '',
  ].join('\n');
  return { js, dts };
}

// ---------- Tokens.swift ----------
function swiftColorLiteral(value) {
  // Supports #RRGGBB and rgba(r,g,b,a)
  const m = /^rgba\((\d+),(\d+),(\d+),([.\d]+)\)$/.exec(value);
  if (m) return `CGTokenColor(r: ${m[1]}, g: ${m[2]}, b: ${m[3]}, a: ${m[4]})`;
  const { r, g, b } = parseHex(value);
  return `CGTokenColor(r: ${r}, g: ${g}, b: ${b}, a: 1)`;
}
function swiftName(k) {
  const c = camel(k);
  return /^\d/.test(c) ? `s${c}` : c;
}
function buildSwift() {
  const L = tokens.color.light;
  const D = tokens.color.dark;
  const lines = [];
  lines.push('// Generated from tokens/tokens.json by scripts/build.js. Do not edit.');
  lines.push('// CONGEO design tokens for the native Swift parts. Colours resolve to the dark variant automatically.');
  lines.push('');
  lines.push('import Foundation');
  lines.push('#if canImport(UIKit)');
  lines.push('import UIKit');
  lines.push('#endif');
  lines.push('#if canImport(SwiftUI)');
  lines.push('import SwiftUI');
  lines.push('#endif');
  lines.push('');
  lines.push('public struct CGTokenColor: Equatable {');
  lines.push('  public let r: Int; public let g: Int; public let b: Int; public let a: Double');
  lines.push('  public var hex: String { String(format: "#%02X%02X%02X", r, g, b) }');
  lines.push('}');
  lines.push('');
  lines.push('public struct CGDynamicColor {');
  lines.push('  public let light: CGTokenColor');
  lines.push('  public let dark: CGTokenColor');
  lines.push('  #if canImport(UIKit)');
  lines.push('  public var uiColor: UIColor {');
  lines.push('    UIColor { traits in');
  lines.push('      let c = traits.userInterfaceStyle == .dark ? self.dark : self.light');
  lines.push('      return UIColor(red: CGFloat(c.r) / 255, green: CGFloat(c.g) / 255, blue: CGFloat(c.b) / 255, alpha: CGFloat(c.a))');
  lines.push('    }');
  lines.push('  }');
  lines.push('  #endif');
  lines.push('  #if canImport(SwiftUI) && canImport(UIKit)');
  lines.push('  public var color: Color { Color(uiColor) }');
  lines.push('  #endif');
  lines.push('}');
  lines.push('');
  lines.push('public enum CongeoTokens {');
  lines.push('  public enum Colors {');
  for (const k of Object.keys(L)) {
    lines.push(`    public static let ${swiftName(k)} = CGDynamicColor(light: ${swiftColorLiteral(L[k])}, dark: ${swiftColorLiteral(D[k])})`);
  }
  lines.push('  }');
  lines.push('  public enum FontSize {');
  for (const [k, v] of Object.entries(tokens.font.size)) lines.push(`    public static let s${k}: CGFloat = ${v.px}`);
  lines.push('  }');
  lines.push('  public enum LineHeight {');
  for (const [k, v] of Object.entries(tokens.font.size)) lines.push(`    public static let s${k}: CGFloat = ${v.line}`);
  lines.push('  }');
  lines.push('  public enum Fonts {');
  lines.push(`    public static let sans = "${tokens.font.family.sans}"`);
  lines.push(`    public static let mono = "${tokens.font.family.mono}"`);
  lines.push(`    public static let capsTracking: CGFloat = ${parseFloat(tokens.font.caps.tracking)} // em`);
  lines.push(`    public static let titleTracking: CGFloat = ${parseFloat(tokens.font.title.tracking)} // em`);
  lines.push('  }');
  lines.push('  public enum Radius {');
  for (const [k, v] of Object.entries(tokens.radius)) lines.push(`    public static let ${camel(k)}: CGFloat = ${v}`);
  lines.push('  }');
  lines.push('  public enum Space {');
  for (const [k, v] of Object.entries(tokens.space)) lines.push(`    public static let s${k}: CGFloat = ${v}`);
  lines.push('  }');
  lines.push(`  public static let touch: CGFloat = ${tokens.touch}`);
  lines.push('  public enum Motion {');
  for (const [k, v] of Object.entries(tokens.motion.duration)) lines.push(`    public static let ${k}: TimeInterval = ${v / 1000}`);
  lines.push(`    public static let springDamping: Double = ${tokens.motion.spring.damping}`);
  lines.push(`    public static let springStiffness: Double = ${tokens.motion.spring.stiffness}`);
  lines.push('  }');
  lines.push('}');
  lines.push('');
  return lines.join('\n');
}

// ---------- tailwind.preset.js ----------
function buildTailwindPreset() {
  const colors = {};
  for (const k of Object.keys(tokens.color.light)) colors[k] = `var(--cg-${k})`;
  const fontSize = {};
  for (const [k, v] of Object.entries(tokens.font.size)) fontSize[`cg-${k}`] = [`var(--cg-size-${k})`, { lineHeight: `var(--cg-line-${k})` }];
  const spacing = {};
  for (const [k] of Object.entries(tokens.space)) spacing[`cg-${k}`] = `var(--cg-space-${k})`;
  const borderRadius = {};
  for (const k of Object.keys(tokens.radius)) borderRadius[k] = `var(--cg-radius-${k})`;
  const boxShadow = {};
  for (const k of Object.keys(tokens.shadow.light)) boxShadow[k] = `var(--cg-shadow-${k})`;
  const transitionDuration = {};
  for (const k of Object.keys(tokens.motion.duration)) transitionDuration[k] = `var(--cg-dur-${k})`;
  const preset = {
    darkMode: ['selector', '[data-theme="dark"]'],
    theme: {
      extend: {
        colors,
        fontFamily: { sans: ['var(--cg-font-sans)'], mono: ['var(--cg-font-mono)'] },
        fontSize,
        spacing,
        borderRadius,
        boxShadow,
        transitionDuration,
        transitionTimingFunction: { cg: 'var(--cg-ease)' },
        minHeight: { touch: 'var(--cg-touch)' },
        minWidth: { touch: 'var(--cg-touch)' },
      },
    },
  };
  return [
    HEADER.replace('/*', '//').replace('*/', '').trimEnd(),
    '// Tailwind preset. Every colour is a CSS variable from congeo.css, so dark mode and [data-theme] work without a second palette.',
    '// Usage: module.exports = { presets: [require("@congeo/design/tailwind")], content: [...] }',
    `module.exports = ${JSON.stringify(preset, null, 2)};`,
    '',
  ].join('\n');
}

// ---------- inline.css: a minified subset for pages served before any bundle ----------
const INLINE_SECTIONS = ['Button', 'Card', 'StatusBar', 'Input / Textarea'];
function section(css, name) {
  const marker = `/* ---------- ${name} ---------- */`;
  const i = css.indexOf(marker);
  if (i < 0) throw new Error(`No section ${name} in components.css`);
  const j = css.indexOf('/* ---------- ', i + marker.length);
  return css.slice(i + marker.length, j < 0 ? css.length : j);
}
function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}
function buildInlineCss() {
  const base = fs.readFileSync(path.join(root, 'src/css/base.css'), 'utf8');
  const components = fs.readFileSync(path.join(root, 'src/css/components.css'), 'utf8');
  const vars = [
    ':root{color-scheme:light dark;' + minifyCss(staticVars()) + '}',
    ':root,[data-theme="light"]{color-scheme:light;' + minifyCss(colorVars('light') + shadowVars('light')) + '}',
    '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){color-scheme:dark;' + minifyCss(colorVars('dark') + shadowVars('dark')) + '}}',
    '[data-theme="dark"]{color-scheme:dark;' + minifyCss(colorVars('dark') + shadowVars('dark')) + '}',
  ].join('');
  // base without the tool/status contexts (a sign-in page has no accents)
  const baseSlim = base.split('\n').filter((l) => !/^\[data-(tool|status)=/.test(l)).join('\n');
  const parts = INLINE_SECTIONS.map((n) => minifyCss(section(components, n)));
  return vars + minifyCss(baseSlim) + parts.join('');
}

// ---------- run ----------
write('congeo.css', buildCss());
write('fonts.css', buildFontsCss());
const { js, dts } = buildTokensJs();
write('tokens.js', js);
write('tokens.d.ts', dts);
write('Tokens.swift', buildSwift());
write('tailwind.preset.js', buildTailwindPreset());
const inlineCss = buildInlineCss();
write('inline.css', inlineCss + '\n');
write('inline.js', HEADER.replace('/*', '//').replace('*/', '').trimEnd() + '\n// The minified subset of congeo.css (variables, base, Button, Input, Card, StatusBar) for pages served before any bundle.\nconst INLINE_CSS = ' + JSON.stringify(inlineCss) + ';\nmodule.exports = { INLINE_CSS };\n');
write('inline.mjs', HEADER.replace('/*', '//').replace('*/', '').trimEnd() + '\nexport const INLINE_CSS = ' + JSON.stringify(inlineCss) + ';\nexport default INLINE_CSS;\n');
write('inline.d.ts', HEADER + 'export declare const INLINE_CSS: string;\nexport default INLINE_CSS;\n');
console.log(`inline.css ${Buffer.byteLength(inlineCss)} bytes`);
console.log(`dist written to ${path.relative(root, outDir) || '.'}`);
