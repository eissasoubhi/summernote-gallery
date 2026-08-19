# Releasing Summernote Gallery

Summernote Gallery follows semantic versioning.

Before publishing a release:

1. run `npm run typecheck`, `npm run build` and `npm test`;
2. verify `npm pack --dry-run` contains only the intended distributable files;
3. run the supported Summernote/Bootstrap browser compatibility suite;
4. verify the standalone plugin and the Summernote Bricks integration;
5. document any option, generated HTML or compatibility changes.

Breaking changes to public options, package entrypoints, persisted Gallery markup/data or supported host versions require a major release.

When a Gallery release depends on a new `snb-components` API, publish and validate the shared runtime first. `summernote-bricks` should only be released afterward if it needs a dependency/range update.

The target publishing model is a version tag + GitHub Release + npm trusted publishing from GitHub Actions with provenance. Trusted publishing must be configured on npm before enabling an automated publish job; CI should validate packages without storing a long-lived npm token in the repository.
