const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pkg = require(path.join(root, 'package.json'));

function packagePath(relativePath) {
  return path.join(root, relativePath);
}

test('published entrypoints exist after build', () => {
  assert.equal(typeof pkg.main, 'string');
  assert.equal(typeof pkg.browser, 'string');
  assert.ok(fs.existsSync(packagePath(pkg.main)), `missing main entrypoint: ${pkg.main}`);
  assert.ok(fs.existsSync(packagePath(pkg.browser)), `missing browser entrypoint: ${pkg.browser}`);
});

test('package allow-list keeps the distributable focused', () => {
  assert.ok(Array.isArray(pkg.files));
  assert.ok(pkg.files.includes('dist'));
  assert.ok(pkg.files.includes('README.md'));
  assert.ok(pkg.files.includes('LICENSE'));
});

test('module bundle exposes a loadable package entry', () => {
  global.self = globalThis;
  const loaded = require(packagePath(pkg.main));
  const exported = loaded && (loaded.default || loaded);
  assert.ok(exported, 'module entrypoint should export the Summernote plugin module');
});
