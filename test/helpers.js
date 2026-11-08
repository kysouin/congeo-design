'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const http = require('http');

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

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png', '.md': 'text/markdown' };

/** A static server for the repo root on 127.0.0.1 (ES modules do not load from file://). Resolves to { server, port }. */
function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(root, url);
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404);
      res.end();
      return;
    }
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port })));
}

module.exports = { root, readTokens, runNode, listFiles, serve };
