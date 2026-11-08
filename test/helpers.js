'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');

function readTokens() {
  return JSON.parse(fs.readFileSync(path.join(root, 'tokens/tokens.json'), 'utf8'));
}

function runNode(args, opts = {}) {
  const r = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8', ...opts });
  return { code: r.status, stdout: r.stdout || '', stderr: r.stderr || '' };
}

function listFiles(dir) {
  const out = [];
  (function walk(d) {
    for (const name of fs.readdirSync(d).sort()) {
      const p = path.join(d, name);
      if (fs.statSync(p).isDirectory()) walk(p);
      else out.push(p);
    }
  })(dir);
  return out;
}

module.exports = { root, readTokens, runNode, listFiles };
