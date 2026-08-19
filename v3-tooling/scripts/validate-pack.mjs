import { execFileSync } from 'node:child_process';

const output = execFileSync('npm', ['pack', '--dry-run', '--json'], {
  cwd: new URL('..', import.meta.url),
  encoding: 'utf8',
});

const [pack] = JSON.parse(output);
const files = new Set(pack.files.map(({ path }) => path));
const required = [
  'package.json',
  'dist/index.js',
  'dist/index.js.map',
  'dist/index.umd.cjs',
  'dist/index.umd.cjs.map',
  'dist/types/index.d.ts',
];

const missing = required.filter((path) => !files.has(path));

if (missing.length > 0) {
  throw new Error(`Packed Gallery v3 artifact is missing: ${missing.join(', ')}`);
}

const unexpectedSource = [...files].filter((path) => path.startsWith('../src/') || path.startsWith('src/') || path.startsWith('tests/'));

if (unexpectedSource.length > 0) {
  throw new Error(`Packed Gallery v3 artifact leaks source/test files: ${unexpectedSource.join(', ')}`);
}

console.log(`Validated Gallery v3 package contents (${files.size} files).`);
