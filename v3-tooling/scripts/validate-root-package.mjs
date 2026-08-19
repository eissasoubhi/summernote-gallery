import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const repoDir = resolve(import.meta.dirname, '../..');
const output = execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
  cwd: repoDir,
  encoding: 'utf8',
});
const [pack] = JSON.parse(output);
const files = new Set(pack.files.map(({ path }) => path));
const required = [
  'package.json', 'README.md', 'LICENSE',
  'dist/index.js', 'dist/index.js.map',
  'dist/index.umd.cjs', 'dist/index.umd.cjs.map',
  'dist/types/index.d.ts',
];
const missing = required.filter((path) => !files.has(path));
if (missing.length) throw new Error(`Root Gallery package is missing: ${missing.join(', ')}`);
const forbidden = [...files].filter((path) => path.startsWith('src/') || path.startsWith('v3-tooling/') || path.startsWith('test/'));
if (forbidden.length) throw new Error(`Root Gallery package leaks internal files: ${forbidden.join(', ')}`);

const manifest = JSON.parse(readFileSync(resolve(repoDir, 'package.json'), 'utf8'));
if (manifest.version !== '3.0.0-rc.0') throw new Error(`Unexpected root version: ${manifest.version}`);

const installSummernoteStub = () => {
  const summernote = { plugins: {} };
  globalThis.$ = { summernote, extend(target, source) { Object.assign(target, source); return target; } };
  return summernote;
};

const esmSummernote = installSummernoteStub();
const esm = await import(pathToFileURL(resolve(repoDir, 'dist/index.js')).href);
if (esmSummernote.plugins.summernoteGallery !== esm.SummernoteGalleryV3) throw new Error('Root ESM entrypoint did not register Gallery.');

const cjsSummernote = installSummernoteStub();
const require = createRequire(import.meta.url);
const cjs = require(resolve(repoDir, 'dist/index.umd.cjs'));
if (cjsSummernote.plugins.summernoteGallery !== cjs.SummernoteGalleryV3) throw new Error('Root CommonJS entrypoint did not register Gallery.');

delete globalThis.$;
console.log(`Validated promoted root Gallery package (${files.size} files).`);
