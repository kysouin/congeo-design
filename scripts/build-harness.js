#!/usr/bin/env node
'use strict';
// Bundles test/harness/main.tsx with esbuild for the real-browser tests. Can build deliberately broken
// variants (the source files on disk are never changed): breakSwipeGuard, breakSheetThreshold.
const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'test/harness/dist');

function patchPlugin(patches) {
  return {
    name: 'cg-patch',
    setup(build) {
      build.onLoad({ filter: /src[\\/]react[\\/](SwipeRow|Sheet|focus)\.tsx?$/ }, (args) => {
        let text = fs.readFileSync(args.path, 'utf8');
        for (const [file, from, to] of patches) {
          if (!args.path.endsWith(file)) continue;
          if (!text.includes(from)) throw new Error(`patch anchor not found in ${file}: ${from}`);
          text = text.split(from).join(to);
        }
        return { contents: text, loader: args.path.endsWith('.tsx') ? 'tsx' : 'ts' };
      });
    },
  };
}

const PATCHES = {
  // the vertical-scroll guard: the direction check and touch-action: pan-y
  breakSwipeGuard: [
    ['SwipeRow.tsx', "if (Math.abs(dy) > Math.abs(dx)) {", 'if (false) {'],
    ['SwipeRow.tsx', "style={{ ['--cg-swipe-x' as any]: `${offset}px` }}", "style={{ touchAction: 'none', ['--cg-swipe-x' as any]: `${offset}px` }}"],
  ],
  // the close threshold: any drag closes
  breakSheetThreshold: [['Sheet.tsx', 'dist > h * threshold ||', 'dist > 0 ||']],
  // Dialog ignores the 900 px breakpoint: always the modal
  breakDialogBreakpoint: [['focus.ts', "export const DESKTOP_QUERY = '(min-width: 900px)';", "export const DESKTOP_QUERY = '(min-width: 0px)';"]],
};

async function buildHarness({ name = 'harness', breakSwipeGuard = false, breakSheetThreshold = false, breakDialogBreakpoint = false } = {}) {
  const patches = [...(breakSwipeGuard ? PATCHES.breakSwipeGuard : []), ...(breakSheetThreshold ? PATCHES.breakSheetThreshold : []), ...(breakDialogBreakpoint ? PATCHES.breakDialogBreakpoint : [])];
  fs.mkdirSync(outDir, { recursive: true });
  const outfile = path.join(outDir, `${name}.js`);
  await esbuild.build({
    entryPoints: [path.join(root, 'test/harness/main.tsx')],
    bundle: true,
    format: 'iife',
    target: 'es2019',
    jsx: 'automatic',
    sourcemap: 'inline',
    define: { 'process.env.NODE_ENV': '"development"' },
    outfile,
    logLevel: 'silent',
    plugins: patches.length ? [patchPlugin(patches)] : [],
  });
  return outfile;
}

module.exports = { buildHarness, outDir };

if (require.main === module) {
  buildHarness().then((f) => console.log(`harness bundle: ${path.relative(root, f)}`));
}
