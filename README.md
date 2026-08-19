# Summernote Gallery

Summernote Gallery is a standalone [Summernote](https://github.com/summernote/summernote) plugin for selecting **server-hosted images** and inserting their real URLs into the editor instead of embedding base64 image data.

It is also one of the official plugins that can be composed by [Summernote Bricks](https://github.com/eissasoubhi/summernote-bricks), but **Summernote Bricks is not required** to use Gallery.

## Features

- select one or more images from a remote/data source;
- keep server URLs instead of base64 payloads;
- paginated/infinite-scroll data loading;
- configurable API response paths;
- custom source formatting;
- select-all/deselect-all controls;
- editable Gallery brick behavior through the shared SNB runtime;
- works as a standalone Summernote toolbar plugin.

## Demo

The historical demo is available at:

https://eissasoubhi.github.io/summernote-gallery

![Summernote Gallery demo](demo.gif?raw=true "Summernote Gallery demo")

## Install

```bash
npm install summernote-gallery
```

The package exposes two intended consumption paths:

- module entry: `dist/module/index.js`;
- browser bundle: `dist/snb-gallery-brick.min.js`.

### Browser usage

Load jQuery, Bootstrap and Summernote before the Gallery bundle:

```html
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css">

<div id="summernote"></div>

<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js"></script>
<script src="node_modules/summernote-gallery/dist/snb-gallery-brick.min.js"></script>
```

Then add `summernoteGallery` to the toolbar:

```js
$('#summernote').summernote({
  toolbar: [
    ['extensions', ['summernoteGallery']]
  ],
  summernoteGallery: {
    source: {
      url: '/api/images',
      responseDataKey: 'data',
      nextPageKey: 'links.next'
    },
    modal: {
      loadOnScroll: true,
      maxHeight: 300,
      title: 'Image gallery'
    },
    buttonLabel: '<i class="fa fa-file-image-o"></i> Gallery'
  }
});
```

## Data source

Gallery can consume local data:

```js
summernoteGallery: {
  source: {
    data: [
      {
        id: '1',
        url: 'https://example.com/images/one.jpg',
        title: 'Image one'
      }
    ]
  }
}
```

Or an API:

```json
{
  "data": [
    {
      "id": "1",
      "url": "https://example.com/images/one.jpg",
      "title": "Image one"
    }
  ],
  "links": {
    "next": "https://example.com/api/images?page=2"
  }
}
```

Use `source.responseDataKey` and `source.nextPageKey` with dot notation when your API has a different shape.

A formatter can normalize an existing API without changing the server response:

```js
source: {
  url: '/api/media',
  responseDataKey: 'items',
  formater(data) {
    return data.map(item => ({
      id: item.uuid,
      url: item.publicUrl,
      title: item.name
    }));
  }
}
```

## Main options

| Option | Purpose | Default |
| --- | --- | --- |
| `source.data` | Inline image records | `[]` |
| `source.url` | Remote image endpoint | `null` |
| `source.responseDataKey` | Response path containing images | `data` |
| `source.nextPageKey` | Response path containing next-page URL | `links.next` |
| `source.formater` | Normalize source records | identity function |
| `modal.loadOnScroll` | Load next page near scroll bottom | `false` |
| `modal.height` | Modal body height | `500` |
| `modal.title` | Modal title | `summernote image gallery` |
| `modal.closeText` | Close button label | `Close` |
| `modal.saveText` | Add/save button label | `Add` |
| `modal.selectAllText` | Select-all label | `Select all` |
| `modal.deselectAllText` | Deselect-all label | `Deselect all` |
| `buttonLabel` | Toolbar button HTML/text | `SN Gallery` |

The source TypeScript interfaces under `src/Module/Interfaces` are the canonical reference while the documentation and compatibility matrix are being modernized.

## Compatibility

The existing browser demo is based on Summernote 0.8.18 + Bootstrap 3. That is the **known historical integration**, not a claim that newer combinations are unsupported.

The modernization roadmap is adding an explicit browser matrix. Bootstrap 5 must not be advertised as supported until the shared SNB modal runtime no longer relies exclusively on Bootstrap's jQuery modal API.

See the ecosystem roadmap in [summernote-bricks#3](https://github.com/eissasoubhi/summernote-bricks/issues/3).

## Architecture

Gallery owns Gallery-specific concerns: image source loading, selection state, Gallery modal behavior and Gallery templates.

Reusable editing, validation, modal and extension infrastructure is provided by `snb-components`. Gallery must stay independently usable and must not depend on another concrete brick.

## Development

Use an active Node LTS release. CI currently validates Node 22 and 24.

```bash
npm ci
npm run typecheck
npm run build
npm test
npm pack --dry-run
```

Run the demo locally:

```bash
npm run start
```

Watch TypeScript changes:

```bash
npm run dev
```

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for contribution rules and [`SECURITY.md`](SECURITY.md) for vulnerability reporting.

## Roadmap ideas

The existing issues already point to useful product improvements after the platform baseline is stable:

- Bootstrap 5 adapter support;
- image upload through an application-provided adapter;
- folder/navigation support;
- search, filters and view modes;
- accessibility and keyboard navigation;
- browser integration coverage.

These should be implemented as small capabilities/adapters instead of coupling Gallery to a particular backend framework.

## License

MIT — see [`LICENSE`](LICENSE).
