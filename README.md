# Summernote Gallery

Summernote Gallery is a standalone Summernote 0.9.x plugin for selecting images from a backend-agnostic source adapter and inserting semantic gallery markup into the editor. It can be composed by Summernote Bricks, but **Summernote Bricks is not required**.

## v3 source status

The public `master` branch contains the **3.0.0-rc.0 source/package contract**. Gallery v3 no longer depends on the historical URL/pagination configuration model or the old shared SNB runtime described by earlier documentation.

The maintained ecosystem compatibility matrix validates Gallery with Summernote 0.9.1 across BS3, BS4, BS5 and Lite builds under Chromium, Firefox and WebKit.

Package publication is separate from source readiness. Verify the registry version you intend to consume instead of assuming the v3 RC has been published.

## Features

- standalone `summernoteGallery` toolbar plugin;
- backend-agnostic `GallerySourceAdapter` contract;
- optional host-provided `GalleryUploadAdapter` for multi-file uploads;
- asynchronous search with abort support;
- source-only media type and creation-date filters;
- accessible Grid/Gallery view modes;
- multi-select image insertion;
- create and edit through a Summernote-native dialog;
- undo-aware edits through Summernote commands;
- accessible search/status/error/listbox semantics;
- source-only folder metadata and deterministic folder-tree helpers;
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
  async list({ query, filters, signal }) {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters?.mediaType) params.set('mediaType', filters.mediaType);
    if (filters?.createdFrom) params.set('createdFrom', filters.createdFrom);
    if (filters?.createdTo) params.set('createdTo', filters.createdTo);

    const response = await fetch(`/api/images?${params}`, { signal });
    const data = await response.json();

    return {
      items: data.items.map((image) => ({
        id: image.id,
        src: image.url,
        alt: image.alt,
        title: image.title,
        caption: image.caption,
        createdAt: image.createdAt,
        mediaType: image.mediaType,
        path: image.path
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
    defaultView: 'grid',
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
    filters?: {
      mediaType?: string;
      createdFrom?: string;
      createdTo?: string;
    };
    cursor?: string;
    signal?: AbortSignal;
  }): Promise<{
    items: GallerySourceImage[];
    nextCursor?: string;
  }>;
}
```

`GallerySourceImage` extends the persisted image model with optional source-only metadata such as `createdAt`, `mediaType` and `path`. These fields are available to search/filter/folder helpers but are not written into persisted Gallery HTML.

This keeps Gallery independent from a specific REST shape, CMS, storage provider or backend framework. Hosts normalize their own API into the Gallery model.

## Optional upload adapter

Upload controls appear only when the host supplies `summernoteGallery.upload`. Gallery does not know or require an endpoint, storage provider, authentication scheme or server framework.

```js
const upload = {
  async upload(files, signal) {
    const body = new FormData();
    files.forEach((file) => body.append('images', file));

    const response = await fetch('/api/images', {
      method: 'POST',
      body,
      signal
    });
    const data = await response.json();

    return data.items.map((image) => ({
      id: image.id,
      src: image.url,
      alt: image.alt,
      title: image.title,
      caption: image.caption
    }));
  }
};

$('#summernote').summernote({
  toolbar: [['extensions', ['summernoteGallery']]],
  summernoteGallery: { source, upload }
});
```

The adapter receives the selected `File[]` and an `AbortSignal`. Returned images are normalized, added to the current dialog results and selected for insertion. Closing/destroying the dialog aborts in-flight uploads. File objects, credentials, transport state and source-only metadata are never persisted by Gallery.

## Persisted content

Gallery v3 stores semantic HTML rather than opaque runtime JSON, remote-response configuration or editor controls. Content helpers normalize image data and render/parse the persisted gallery structure.

Legacy conversion remains explicit and opt-in so loading an editor does not silently rewrite stored content.

## Module usage

The module entry exports the Summernote plugin, gallery content helpers and source-adapter helpers. Typical integrations can import adapter types or `createStaticGallerySource` and then configure the normal Summernote plugin lifecycle.

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

Dialog-level folder navigation remains active follow-up work. Upload, text search, media/date filtering and Grid/Gallery view modes are already implemented on the v3 source line.

## Contributing, security and release

See `CONTRIBUTING.md`, `SECURITY.md` and `RELEASING.md`.

## License

MIT — see `LICENSE`.
