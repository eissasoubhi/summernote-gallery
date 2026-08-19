import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const toolingDir = resolve(import.meta.dirname, '..');
const repoDir = resolve(toolingDir, '..');
const stageDir = join(tmpdir(), `summernote-gallery-v3-package-${process.pid}`);

rmSync(stageDir, { recursive: true, force: true });
mkdirSync(stageDir, { recursive: true });

const installSummernoteStub = () => {
  const summernote = { plugins: {} };
  globalThis.$ = { summernote };
  return summernote;
};

try {
  cpSync(join(toolingDir, 'dist'), join(stageDir, 'dist'), { recursive: true });
  cpSync(join(repoDir, 'README.md'), join(stageDir, 'README.md'));
  cpSync(join(repoDir, 'LICENSE'), join(stageDir, 'LICENSE'));
  writeFileSync(
    join(stageDir, 'package.json'),
    readFileSync(join(repoDir, 'package.v3.json'), 'utf8'),
  );

  const output = execFileSync('npm', ['pack', '--json', '--ignore-scripts'], {
    cwd: stageDir,
    encoding: 'utf8',
  });
  const [pack] = JSON.parse(output);
  const files = new Set(pack.files.map(({ path }) => path));
  const required = [
    'package.json',
    'README.md',
    'LICENSE',
    'dist/index.js',
    'dist/index.js.map',
    'dist/index.umd.cjs',
    'dist/index.umd.cjs.map',
    'dist/types/index.d.ts',
  ];
  const missing = required.filter((path) => !files.has(path));
  if (missing.length > 0) {
    throw new Error(`Staged Gallery v3 package is missing: ${missing.join(', ')}`);
  }

  const forbidden = [...files].filter((path) =>
    path.startsWith('src/') ||
    path.startsWith('tests/') ||
    path.startsWith('v3-tooling/') ||
    path === 'package.v3.json'
  );
  if (forbidden.length > 0) {
    throw new Error(`Staged Gallery v3 package leaks internal files: ${forbidden.join(', ')}`);
  }

  const manifest = JSON.parse(readFileSync(join(stageDir, 'package.json'), 'utf8'));
  if (manifest.version !== '3.0.0-rc.0') {
    throw new Error(`Unexpected staged version: ${manifest.version}`);
  }
  if (!manifest.peerDependencies?.jquery || !manifest.peerDependencies?.summernote) {
    throw new Error('Staged Gallery v3 package must declare jQuery and Summernote as peers.');
  }

  const esmSummernote = installSummernoteStub();
  const esm = await import(pathToFileURL(join(stageDir, 'dist/index.js')).href);
  if (typeof esm.SummernoteGalleryV3 !== 'function') {
    throw new Error('Gallery v3 ESM entrypoint does not export SummernoteGalleryV3.');
  }
  if (esmSummernote.plugins.summernoteGallery !== esm.SummernoteGalleryV3) {
    throw new Error('Gallery v3 ESM entrypoint did not register its Summernote plugin.');
  }

  const cjsSummernote = installSummernoteStub();
  const require = createRequire(import.meta.url);
  const cjs = require(join(stageDir, 'dist/index.umd.cjs'));
  if (typeof cjs.SummernoteGalleryV3 !== 'function') {
    throw new Error('Gallery v3 CommonJS entrypoint does not export SummernoteGalleryV3.');
  }
  if (cjsSummernote.plugins.summernoteGallery !== cjs.SummernoteGalleryV3) {
    throw new Error('Gallery v3 CommonJS entrypoint did not register its Summernote plugin.');
  }

  console.log(`Validated staged public Gallery v3 tarball (${files.size} files), ESM import and CommonJS require.`);
} finally {
  delete globalThis.$;
  rmSync(stageDir, { recursive: true, force: true });
}
