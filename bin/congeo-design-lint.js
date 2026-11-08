#!/usr/bin/env node
'use strict';
/**
 * congeo-design-lint
 *
 * Scans folders for hard-coded colours (hex, rgb()/hsl(), CSS named colours,
 * Tailwind palette classes) and font-family literals outside the files the
 * app allows. Exits 1 with file:line:col for each finding.
 *
 * Usage:
 *   congeo-design-lint <dir|file>... [--allow <glob>]... [--ignore <glob>]... [--ext js,ts,...] [--i18n] [--quiet]
 *
 * --i18n also flags user-visible text with Greek letters outside L(...) / LL(...) / plural(...) / verb(...):
 *   JSX text, aria-label / title / placeholder / alt attributes, and string literals passed to toast- or
 *   alert-like calls or given as title/label/placeholder/message properties. Data contracts («Έργο: 0637»),
 *   Drive folder names and other plain strings are not flagged: only text the user reads on screen.
 *
 * Config (optional) in the app's package.json:
 *   "congeoDesignLint": { "allow": ["src/legacy/**"], "ignore": ["**\/*.test.*"], "ext": ["css","tsx"] }
 *
 * A line that ends with the comment `cg-lint-ignore` is skipped.
 */
const fs = require('fs');
const path = require('path');

const DEFAULT_EXT = ['css', 'scss', 'sass', 'less', 'pcss', 'js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs', 'html', 'htm', 'vue', 'svelte', 'astro', 'json'];
const DEFAULT_IGNORE = ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**', '**/.expo/**', '**/coverage/**', '**/*.min.*', '**/package.json', '**/package-lock.json', '**/*.lock', '**/tsconfig*.json'];

const NAMED_COLORS = [
  'aliceblue','antiquewhite','aqua','aquamarine','azure','beige','bisque','black','blanchedalmond','blue','blueviolet','brown','burlywood','cadetblue','chartreuse','chocolate','coral','cornflowerblue','cornsilk','crimson','cyan','darkblue','darkcyan','darkgoldenrod','darkgray','darkgreen','darkgrey','darkkhaki','darkmagenta','darkolivegreen','darkorange','darkorchid','darkred','darksalmon','darkseagreen','darkslateblue','darkslategray','darkslategrey','darkturquoise','darkviolet','deeppink','deepskyblue','dimgray','dimgrey','dodgerblue','firebrick','floralwhite','forestgreen','fuchsia','gainsboro','ghostwhite','gold','goldenrod','gray','green','greenyellow','grey','honeydew','hotpink','indianred','indigo','ivory','khaki','lavender','lavenderblush','lawngreen','lemonchiffon','lightblue','lightcoral','lightcyan','lightgoldenrodyellow','lightgray','lightgreen','lightgrey','lightpink','lightsalmon','lightseagreen','lightskyblue','lightslategray','lightslategrey','lightsteelblue','lightyellow','lime','limegreen','linen','magenta','maroon','mediumaquamarine','mediumblue','mediumorchid','mediumpurple','mediumseagreen','mediumslateblue','mediumspringgreen','mediumturquoise','mediumvioletred','midnightblue','mintcream','mistyrose','moccasin','navajowhite','navy','oldlace','olive','olivedrab','orange','orangered','orchid','palegoldenrod','palegreen','paleturquoise','palevioletred','papayawhip','peachpuff','peru','pink','plum','powderblue','purple','rebeccapurple','red','rosybrown','royalblue','saddlebrown','salmon','sandybrown','seagreen','seashell','sienna','silver','skyblue','slateblue','slategray','slategrey','snow','springgreen','steelblue','tan','teal','thistle','tomato','turquoise','violet','wheat','white','whitesmoke','yellow','yellowgreen',
];
const TW_PALETTE = ['slate','gray','zinc','neutral','stone','red','orange','amber','yellow','lime','green','emerald','teal','cyan','sky','blue','indigo','violet','purple','fuchsia','pink','rose','white','black'];
const TW_PREFIX = ['bg','text','border','ring','ring-offset','fill','stroke','from','via','to','outline','decoration','accent','caret','shadow','divide','placeholder'];

// Colour value position: after ':' '=' ',' '(' or a quote, with optional spaces. This skips CSS id selectors (#header { ... }).
const VALUE_POS = String.raw`(?<=[:=,(\s'"\x60]\s*)`;
const RULES = [
  { id: 'hex', re: new RegExp(VALUE_POS + String.raw`#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![0-9a-zA-Z_-])`, 'g'), message: 'hard-coded hex colour' },
  { id: 'rgb', re: /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(\s*(?!var\()[^)]*\)/g, message: 'hard-coded colour function' },
  { id: 'named', re: new RegExp(String.raw`(?<=(?:color|background|background-color|border(?:-\w+)?-color|fill|stroke|outline(?:-color)?|caret-color|text-decoration-color|column-rule-color|accent-color)\s*:\s*(?:[\w-]+\s+)*)(${NAMED_COLORS.join('|')})\b|(?<=(?:color|backgroundColor|borderColor|fill|stroke|tintColor|shadowColor|textColor|placeholderTextColor)\s*[:=]\s*['"\x60])(${NAMED_COLORS.join('|')})(?=['"\x60])`, 'gi'), message: 'named colour' },
  { id: 'tailwind', re: new RegExp(String.raw`(?<![\w-])(?:${TW_PREFIX.join('|')})-(?:${TW_PALETTE.join('|')})(?:-\d{2,3})?(?=[\s'"\x60/:\]]|$)`, 'g'), message: 'Tailwind palette class' },
  { id: 'font-family', re: /(?<=font-family\s*:\s*)(?!var\(|inherit\b|initial\b|unset\b|revert\b)[^;}\n]+|(?<=fontFamily\s*[:=]\s*)['"\x60][^'"\x60]+['"\x60]|(?<=\bfont\s*:\s*)(?!var\(|inherit\b)[^;}\n]*(?:serif|monospace|system-ui|Inter|Roboto|Arial|Helvetica|Georgia|Menlo|Consolas|"[^"]+"|'[^']+')[^;}\n]*/g, message: 'font-family literal' },
  { id: 'google-fonts', re: /fonts\.googleapis\.com|fonts\.gstatic\.com/g, message: 'Google Fonts link (fonts are self-hosted through @congeo/design/fonts.css)' },
];

// ---------- i18n (--i18n) ----------
const GREEK = /[Ͱ-Ͽἀ-῿]/;
const I18N_EXT = ['js', 'jsx', 'ts', 'tsx', 'mjs', 'vue', 'svelte', 'astro', 'html', 'htm'];
const WRAPPERS = /\b(?:L|LL|plural|verb|inLang|t)\s*\(/g;
const VISIBLE_ATTRS = /(?:aria-label|aria-description|aria-placeholder|aria-roledescription|title|placeholder|alt|label)\s*=\s*$/;
const VISIBLE_CALLS = /(?:toast|alert|confirm|prompt|notify|notice|snack(?:bar)?|banner|message|flash|announce|setError|setStatus|setMessage|setTitle|setToast|showToast|showMessage|showError|showBanner|Alert\.alert)\s*\(\s*(?:\{\s*(?:title|message|text|description)\s*:\s*)?$/;
const VISIBLE_PROPS = /\b(?:title|label|placeholder|message|text|description|heading|caption|hint|tooltip|ariaLabel|emptyText|confirmText|cancelText|okText|successMessage|errorMessage|helperText)\s*:\s*$/;
const NEUTRAL_PROPS = /\b(?:name|key|id|path|folder|tag|section|href|src|value|appProperties|extendedProperties|contract|drive|prefix|marker|source|property)\s*[:=]\s*$/i;

// Masks the arguments of L(...) and friends with spaces, across lines. Returns the masked lines.
function maskWrappers(lines) {
  let depth = 0;
  return lines.map((line) => {
    let out = '';
    let i = 0;
    while (i < line.length) {
      if (depth === 0) {
        WRAPPERS.lastIndex = i;
        const m = WRAPPERS.exec(line);
        if (!m || m.index !== i) {
          // copy until the next wrapper start
          const next = m ? m.index : line.length;
          out += line.slice(i, next);
          i = next;
          continue;
        }
        out += m[0];
        i = m.index + m[0].length;
        depth = 1;
        continue;
      }
      const c = line[i];
      if (c === '(') depth++;
      else if (c === ')') depth--;
      out += depth > 0 || c === ')' ? (c === '(' || c === ')' ? c : ' ') : c;
      i++;
    }
    return out;
  });
}

function scanI18n(file, rel, ext) {
  if (!I18N_EXT.includes(ext)) return [];
  const raw = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const lines = maskWrappers(raw.map((l) => (/cg-lint-ignore/.test(l) ? '' : stripComments(l, ext))));
  const findings = [];
  const push = (i, col, rule, text) => findings.push({ file: rel, line: i + 1, col: col + 1, rule, message: rule === 'i18n-text' ? 'Greek text outside L(): JSX text' : rule === 'i18n-attr' ? 'Greek text outside L(): visible attribute' : 'Greek text outside L(): string shown to the user', text: text.trim().slice(0, 80) });
  lines.forEach((line, i) => {
    if (!GREEK.test(line)) return;
    // string literals
    const strRe = /(['"`])((?:\\.|(?!\1)[^\\\n])*)\1/g;
    const covered = [];
    let m;
    while ((m = strRe.exec(line))) {
      const [whole, , body] = m;
      covered.push([m.index, m.index + whole.length]);
      if (!GREEK.test(body)) continue;
      const before = line.slice(0, m.index).replace(/\{?\s*$/, '');
      if (VISIBLE_ATTRS.test(before)) push(i, m.index, 'i18n-attr', whole);
      else if (VISIBLE_CALLS.test(before)) push(i, m.index, 'i18n-call', whole);
      else if (VISIBLE_PROPS.test(before) && !NEUTRAL_PROPS.test(before)) push(i, m.index, 'i18n-call', whole);
    }
    // JSX / HTML text: Greek between a closing '>' and the next '<' or '{', not inside a string literal
    const textRe = />([^<>{}]*)(?=<|\{|$)/g;
    while ((m = textRe.exec(line))) {
      const body = m[1];
      if (!GREEK.test(body)) continue;
      const start = m.index + 1;
      if (covered.some(([a, b]) => start >= a && start < b)) continue;
      // only a '>' that closes a tag counts; `a > 0 ? \`σε\`` or `=>` do not
      if (!/<\/?[a-zA-Z][^<>]*>$/.test(line.slice(0, m.index + 1))) continue;
      push(i, start, 'i18n-text', body);
    }
    // JSX text on a line of its own (no tag on the line): Greek left after strings and {expressions} are removed
    if (['jsx', 'tsx', 'vue', 'svelte', 'astro', 'html', 'htm'].includes(ext) && !findings.some((f) => f.line === i + 1)) {
      const rest = line.replace(strRe, '').replace(/\{[^{}]*\}/g, '').replace(/<[^<>]*>/g, '');
      const g = GREEK.exec(rest);
      if (g && !/^\s*(?:import|export|const|let|var|return|case|if|for|while|function|type|interface)\b/.test(line) && !/[=:(]\s*[^'"`]*$/.test(line.slice(0, line.search(GREEK)))) {
        push(i, line.search(GREEK), 'i18n-text', rest);
      }
    }
  });
  return findings;
}

// ---------- tiny glob ----------
function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        i++;
        if (glob[i + 1] === '/') { i++; re += '(?:.*/)?'; } else re += '.*';
      } else re += '[^/]*';
    } else if (c === '?') re += '[^/]';
    else if (c === '.') re += '\\.';
    else if ('()+^$|{}[]\\'.includes(c)) re += '\\' + c;
    else re += c;
  }
  return new RegExp('^' + re + '$');
}
function matchesAny(rel, globs) {
  return globs.some((g) => g.test(rel) || g.test('./' + rel));
}

// ---------- args ----------
function parseArgs(argv) {
  const opts = { paths: [], allow: [], ignore: [], ext: null, quiet: false, json: false, i18n: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--allow') opts.allow.push(argv[++i]);
    else if (a === '--ignore') opts.ignore.push(argv[++i]);
    else if (a === '--ext') opts.ext = argv[++i].split(',').map((s) => s.trim().replace(/^\./, ''));
    else if (a === '--quiet') opts.quiet = true;
    else if (a === '--json') opts.json = true;
    else if (a === '--i18n') opts.i18n = true;
    else if (a === '--help' || a === '-h') { printHelp(); process.exit(0); }
    else if (a.startsWith('--')) { console.error(`Unknown option ${a}`); process.exit(2); }
    else opts.paths.push(a);
  }
  return opts;
}
function printHelp() {
  console.log(fs.readFileSync(__filename, 'utf8').split('\n').filter((l) => l.startsWith(' *')).map((l) => l.replace(/^ \*\s?/, '')).join('\n'));
}
function loadConfig(cwd) {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
    return pkg.congeoDesignLint || {};
  } catch {
    return {};
  }
}

// ---------- scan ----------
function* walk(p) {
  const st = fs.statSync(p);
  if (st.isFile()) { yield p; return; }
  for (const name of fs.readdirSync(p).sort()) {
    if (name === 'node_modules' || name === '.git') continue;
    yield* walk(path.join(p, name));
  }
}

function stripComments(line, ext) {
  // Keep it simple: ignore content after `//` in JS-like files when it is clearly a comment, and strip /* ... */ on one line.
  let s = line.replace(/\/\*.*?\*\//g, (m) => ' '.repeat(m.length));
  if (['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs', 'vue', 'svelte', 'astro'].includes(ext)) {
    const idx = s.search(/(?<![:'"\x60\w])\/\/(?!.*['"\x60].*['"\x60])/);
    if (idx >= 0) s = s.slice(0, idx);
  }
  return s;
}

function scanFile(file, rel, ext) {
  const text = fs.readFileSync(file, 'utf8');
  const findings = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((raw, i) => {
    if (/cg-lint-ignore/.test(raw)) return;
    const line = stripComments(raw, ext);
    for (const rule of RULES) {
      rule.re.lastIndex = 0;
      let m;
      while ((m = rule.re.exec(line))) {
        const matched = m[0];
        if (rule.id === 'hex' && /^#[0-9a-fA-F]{3,4}$/.test(matched) && ext !== 'css' && ext !== 'scss' && ext !== 'less' && !/(color|background|fill|stroke|border|shadow|tint)/i.test(line)) {
          // 3/4-digit hex outside CSS is often an id or a hash fragment; only flag it next to a colour-ish word
          continue;
        }
        if (rule.id === 'rgb' && /var\(/.test(matched)) continue;
        if (rule.id === 'font-family' && /var\(--/.test(matched)) continue;
        findings.push({ file: rel, line: i + 1, col: m.index + 1, rule: rule.id, message: rule.message, text: matched.trim().slice(0, 80) });
        if (m.index === rule.re.lastIndex) rule.re.lastIndex++;
      }
    }
  });
  return findings;
}

function run(argv, cwd = process.cwd()) {
  const opts = parseArgs(argv);
  const cfg = loadConfig(cwd);
  const allow = [...(cfg.allow || []), ...opts.allow].map(globToRegExp);
  const ignore = [...DEFAULT_IGNORE, ...(cfg.ignore || []), ...opts.ignore].map(globToRegExp);
  const exts = opts.ext || cfg.ext || DEFAULT_EXT;
  if (!opts.paths.length) { printHelp(); return 2; }

  const findings = [];
  let scanned = 0;
  for (const p of opts.paths) {
    const abs = path.resolve(cwd, p);
    if (!fs.existsSync(abs)) { console.error(`congeo-design-lint: no such path ${p}`); return 2; }
    for (const file of walk(abs)) {
      const rel = path.relative(cwd, file).split(path.sep).join('/');
      const ext = path.extname(file).slice(1).toLowerCase();
      if (!exts.includes(ext)) continue;
      if (matchesAny(rel, ignore)) continue;
      if (matchesAny(rel, allow)) continue;
      scanned++;
      findings.push(...scanFile(file, rel, ext));
      if (opts.i18n) findings.push(...scanI18n(file, rel, ext));
    }
  }
  if (opts.json) {
    console.log(JSON.stringify({ scanned, findings }, null, 2));
  } else {
    for (const f of findings) console.log(`${f.file}:${f.line}:${f.col}  ${f.message}: ${f.text}`);
    if (!opts.quiet) {
      console.log(findings.length ? `\ncongeo-design-lint: ${findings.length} finding(s) in ${scanned} file(s). Use tokens${opts.i18n ? ' and L()' : ''} from @congeo/design instead.` : `congeo-design-lint: ${scanned} file(s) clean.`);
    }
  }
  return findings.length ? 1 : 0;
}

if (require.main === module) process.exit(run(process.argv.slice(2)));
module.exports = { run, scanFile, scanI18n, RULES };
