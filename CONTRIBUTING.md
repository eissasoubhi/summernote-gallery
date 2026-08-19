# Contributing to Summernote Gallery

Thanks for helping improve Summernote Gallery.

## Development setup

Use an active Node.js LTS release (Node 22 or 24).

```bash
npm ci
npm run typecheck
npm run build
npm test
```

Run the demo locally with:

```bash
npm run start
```

For watch mode while editing TypeScript:

```bash
npm run dev
```

## Pull requests

Keep each pull request focused on one behavior or maintenance concern. Before opening a PR, run `npm run check` and make sure the generated browser/module bundles still build.

Changes that alter the public configuration shape, generated HTML, supported Summernote versions, or package entrypoints should be called out explicitly because they may require a major release.

## Architecture boundaries

- `src/Module` owns Gallery-specific behavior.
- Reusable Summernote Bricks runtime behavior belongs in `snb-components` rather than being copied into Gallery.
- The package must remain usable standalone; `summernote-bricks` is an optional aggregator, not a runtime requirement.
- Avoid adding a dependency on another concrete brick.

## Tests

The current baseline includes type checking, build verification, package smoke tests, and npm package validation. New pure logic should receive unit tests. Browser-facing changes should eventually be covered by the ecosystem integration suite before release.

## Security

Do not report security issues in a public issue. See `SECURITY.md`.
