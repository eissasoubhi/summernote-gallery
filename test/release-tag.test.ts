import { describe, expect, it } from 'vitest';

import {
  expectedReleaseTag,
  validateReleaseTag,
} from '../scripts/validate-release-tag.mjs';

describe('release tag validation', () => {
  it('derives the exact v-prefixed tag from the package version', () => {
    expect(expectedReleaseTag('3.0.0-rc.0')).toBe('v3.0.0-rc.0');
  });

  it('accepts the exact package tag', () => {
    expect(validateReleaseTag('v3.0.0-rc.0', '3.0.0-rc.0')).toBe('v3.0.0-rc.0');
  });

  it('rejects a tag for a different package version', () => {
    expect(() => validateReleaseTag('v3.0.0-rc.1', '3.0.0-rc.0')).toThrow(
      'Tag v3.0.0-rc.1 does not match package.json version 3.0.0-rc.0; expected v3.0.0-rc.0',
    );
  });

  it('rejects a missing tag instead of silently accepting it', () => {
    expect(() => validateReleaseTag(undefined, '3.0.0-rc.0')).toThrow(
      'Tag <missing> does not match package.json version 3.0.0-rc.0; expected v3.0.0-rc.0',
    );
  });

  it('rejects an empty package version', () => {
    expect(() => expectedReleaseTag('')).toThrow('package version must be a non-empty string');
  });
});
