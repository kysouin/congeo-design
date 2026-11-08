#!/usr/bin/env node
'use strict';
// After tsc: marks dist/i18n/esm as ES modules and writes the inline boot snippet as a file.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const { LANG_BOOT_SCRIPT } = require(path.join(root, 'dist/i18n/core.js'));
fs.writeFileSync(path.join(root, 'dist/i18n/esm/package.json'), JSON.stringify({ type: 'module', sideEffects: true }, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'dist/i18n/boot.inline.js'), '// Inline this in <head>, before any stylesheet. Sets <html lang> before the first paint.\n' + LANG_BOOT_SCRIPT + '\n');
console.log('dist/i18n ready (CJS, ESM, boot.inline.js)');
