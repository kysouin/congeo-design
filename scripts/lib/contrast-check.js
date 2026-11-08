'use strict';
const { contrast } = require('./color');

const LEVELS = { text: 4.5, large: 3.0 };

/**
 * Evaluates every declared pair in tokens.contrast.pairs for both schemes.
 * Returns { rows, failures }.
 */
function checkContrast(tokens) {
  const rows = [];
  for (const scheme of ['light', 'dark']) {
    const colors = tokens.color[scheme];
    for (const pair of tokens.contrast.pairs) {
      if (pair.only && !pair.only.includes(scheme)) continue;
      const bgs = Array.isArray(pair.bg) ? pair.bg : [pair.bg];
      for (const bgName of bgs) {
        const fg = colors[pair.fg];
        const bg = colors[bgName];
        if (!fg) throw new Error(`Unknown token "${pair.fg}" in ${scheme}`);
        if (!bg) throw new Error(`Unknown token "${bgName}" in ${scheme}`);
        if (/^rgba/.test(fg) || /^rgba/.test(bg)) continue; // translucent tokens (scrim) are not text pairs
        const ratio = contrast(fg, bg);
        const min = LEVELS[pair.level];
        rows.push({ scheme, fg: pair.fg, fgValue: fg, bg: bgName, bgValue: bg, level: pair.level, min, ratio, pass: ratio >= min });
      }
    }
  }
  return { rows, failures: rows.filter((r) => !r.pass) };
}

function formatTable(rows) {
  const head = ['scheme', 'fg', 'bg', 'level', 'min', 'ratio', 'result'];
  const data = rows.map((r) => [r.scheme, `${r.fg} ${r.fgValue}`, `${r.bg} ${r.bgValue}`, r.level, r.min.toFixed(1), r.ratio.toFixed(2), r.pass ? 'PASS' : 'FAIL']);
  const widths = head.map((h, i) => Math.max(h.length, ...data.map((d) => d[i].length)));
  const line = (cells) => cells.map((c, i) => c.padEnd(widths[i])).join('  ');
  return [line(head), line(widths.map((w) => '-'.repeat(w))), ...data.map(line)].join('\n');
}

function formatMarkdown(rows) {
  const out = ['| scheme | fg | bg | level | min | ratio | result |', '|---|---|---|---|---|---|---|'];
  for (const r of rows) {
    out.push(`| ${r.scheme} | ${r.fg} \`${r.fgValue}\` | ${r.bg} \`${r.bgValue}\` | ${r.level} | ${r.min.toFixed(1)} | ${r.ratio.toFixed(2)} | ${r.pass ? 'PASS' : '**FAIL**'} |`);
  }
  return out.join('\n');
}

module.exports = { checkContrast, formatTable, formatMarkdown, LEVELS };
