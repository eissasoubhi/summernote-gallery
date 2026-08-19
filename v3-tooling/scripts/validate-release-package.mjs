import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const toolingDir = resolve(import.meta.dirname, '..');
const repoDir = resolve(toolingDir, '..');
const stageDir = join(tmpdir(), `summernote-gallery-v3-package-${process.pid}`);

rmSync(stageDir, { recursive: true, force: true });
mkdirSync(stageDir, { recursive: true });

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

  console.log(`Validated staged public Gallery v3 tarball (${files.size} files).`);
} finally {
  rmSync(stageDir, { recursive: true, force: true });
}
