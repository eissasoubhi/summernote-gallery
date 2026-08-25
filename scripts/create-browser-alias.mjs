import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const distDir = resolve(import.meta.dirname, '..', 'dist');
const sourceName = 'index.umd.cjs';
const sourceMapName = `${sourceName}.map`;
const browserName = 'summernote-gallery.browser.js';
const browserMapName = `${browserName}.map`;

const code = readFileSync(resolve(distDir, sourceName), 'utf8')
  .replace(`//# sourceMappingURL=${sourceMapName}`, `//# sourceMappingURL=${browserMapName}`);
writeFileSync(resolve(distDir, browserName), code);

const sourceMap = JSON.parse(readFileSync(resolve(distDir, sourceMapName), 'utf8'));
sourceMap.file = browserName;
writeFileSync(resolve(distDir, browserMapName), JSON.stringify(sourceMap));

console.log(`Created dist/${browserName}`);
