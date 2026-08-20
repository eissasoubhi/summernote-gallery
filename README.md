# Summernote Gallery

Summernote Gallery is a standalone Summernote 0.9.x plugin for selecting images from a backend-agnostic source adapter and inserting semantic gallery markup into the editor. It can be composed by Summernote Bricks, but **Summernote Bricks is not required**.

## v3 source status

The public `master` branch contains the **3.0.0-rc.0 source/package contract**. Gallery v3 no longer depends on the historical URL/pagination configuration model or the old shared SNB runtime described by earlier documentation.

The maintained ecosystem compatibility matrix validates Gallery with Summernote 0.9.1 across BS3, BS4, BS5 and Lite builds under Chromium, Firefox and WebKit.

Package publication is separate from source readiness. Verify the registry version you intend to consume instead of assuming the v3 RC has been published.

## Features

- standalone `summernoteGallery` toolbar plugin;
- backend-agnostic `GallerySourceAdapter` contract;
- asynchronous search with abort support;
- multi-select image insertion;
- create and edit through a Summernote-native dialog;
- undo-aware edits through Summernote commands;
- accessible search/status/error/listbox semantics;
- clean semantic persisted HTML marked with `data-snb-brick="gallery"` and `data-snb-version="3"`;
- explicit, opt-in helpers for migrating legacy Gallery markup;
- ESM, CommonJS/browser bundle and TypeScript declarations.

## Package contract

The v3 root manifest exposes:

```text
dist/index.js          ESM
dist/index.umd.cjs     CommonJS / browser bundle
dist/types/index.d.ts  TypeScript declarations
```

Host peer dependencies:

```json
{
  "jquery": ">=3.6.0 <4",
  "summernote": ">=0.9.1 <0.10"
}
```

## Browser usage

Load jQuery, the Summernote build matching your Bootstrap/Lite setup, then the Gallery bundle before initializing the editor:

```html
<script src="path/to/jquery.js"></script>
<script src="path/to/summernote.js"></script>
<script src="path/to/summernote-gallery/dist/index.umd.cjs"></script>
```

Configure a source adapter and add `summernoteGallery` to the toolbar:

```js
const source = {
  async list({ query, signal }) {
    const response = await fetch(`/api/images?q=${encodeURIComponent(query || '')}`, { signal });
    const data = await response.json();

    return {
      items: data.items.map((image) => ({
        src: image.url,
        alt: image.alt,
        title: image.title,
        caption: image.caption
      })),
      nextCursor: data.nextCursor
    };
  }
};

$('#summernote').summernote({
  toolbar: [
    ['extensions', ['summernoteGallery']]
  ],
  summernoteGallery: {
    buttonLabel: 'Gallery',
    tooltip: 'Insert gallery',
    dialogTitle: 'Image gallery',
    saveText: 'Insert',
    searchLabel: 'Search images',
    searchText: 'Search',
    source
  }
});
```

For static data, the module API also exposes `createStaticGallerySource(images)`.

## Source adapter contract

A source adapter implements:

```ts
interface GallerySourceAdapter {
  list(request: {
    query?: string;
    cursor?: string;
    signal?: AbortSignal;
  }): Promise<{
    items: GalleryImage[];
    nextCursor?: string;
  }>;
}
```

This keeps Gallery independent from a specific REST shape, CMS, storage provider or backend framework. Hosts normalize their own API into the Gallery model.

The source module also defines a `GalleryUploadAdapter` contract for future/host-provided upload integration; the current dialog remains source-selection focused.

## Persisted content

Gallery v3 stores semantic HTML rather than opaque runtime JSON, remote-response configuration or editor controls. Content helpers normalize image data and render/parse the persisted gallery structure.

Legacy conversion remains explicit and opt-in so loading an editor does not silently rewrite stored content.

## Module usage

The module entry exports the Summernote plugin, gallery content helpers and source-adapter helpers. Typical integrations can import the adapter types or `createStaticGallerySource` and then configure the normal Summernote plugin lifecycle.

The browser bundle self-registers `summernoteGallery` when loaded after Summernote.

## Development

```bash
npm ci
npm run check
```

`npm run check` performs strict TypeScript checking, Vitest tests, Vite/TypeScript builds and package-shape validation. The cross-repository Bricks compatibility harness additionally tests the packed Gallery artifact against the supported Summernote/browser matrix.

## Compatibility

The maintained reference is Summernote **0.9.1** with:

- Bootstrap 3 build;
- Bootstrap 4 build;
- Bootstrap 5 build;
- Summernote Lite;
- Chromium, Firefox and WebKit.

The historical 0.8.18 demos, old `dist/snb-gallery-brick.min.js` path and URL/pagination options are legacy references, not the v3 contract.

## Ecosystem

- `summernote-gallery` — this standalone backend-agnostic Gallery plugin;
- `summernote-heading` — standalone semantic Heading plugin;
- `summernote-bricks` — optional composer of registered plugin buttons and central browser compatibility harness;
- `SNB-components` — independent optional shared core; Gallery does not currently depend on it.

See the Summernote Bricks roadmap issue #3 for ecosystem release-readiness status.

## Feature requests

Upload UI, folder grouping and richer filtering/view modes remain separate feature requests. They are not required for the current v3 release-readiness contract.

## Contributing, security and release

See `CONTRIBUTING.md`, `SECURITY.md` and `RELEASING.md`.

## License

MIT — see `LICENSE`.
