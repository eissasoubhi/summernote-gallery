import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export function expectedReleaseTag(version) {
  if (typeof version !== 'string' || version.trim() === '') {
    throw new Error('package version must be a non-empty string');
  }

  return `v${version}`;
}

export function validateReleaseTag(tag, version) {
  const expected = expectedReleaseTag(version);

  if (tag !== expected) {
    throw new Error(`Tag ${tag || '<missing>'} does not match package.json version ${version}; expected ${expected}`);
  }

  return expected;
}

export async function validateReleaseTagFromEnvironment({
  tag = process.env.GITHUB_REF_NAME,
  packagePath = new URL('../../package.json', import.meta.url),
} = {}) {
  const packageJson = JSON.parse(await readFile(packagePath, 'utf8'));
  return validateReleaseTag(tag, packageJson.version);
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;

if (invokedPath === import.meta.url) {
  try {
    const tag = await validateReleaseTagFromEnvironment();
    console.log(`Validated release tag ${tag}`);
  } catch (error) {
    console.error(`::error::${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}
