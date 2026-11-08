import { defineConfig } from 'vite';
// No alias, no dedupe tricks: the package must work as published.
export default defineConfig({ base: './', build: { outDir: 'dist', emptyOutDir: true, minify: false }, logLevel: 'warn' });
