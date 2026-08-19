import {
    GalleryData,
    GalleryImage,
    galleryImageKey,
    parseGallery,
    renderGallery,
} from './gallery';
import { GallerySourceAdapter } from './source';

const PLUGIN_NAME = 'summernoteGallery';
const EVENT_NAMESPACE = '.snbGalleryV3';

interface GalleryV3Options {
    buttonLabel: string;
    tooltip: string;
    dialogTitle: string;
    saveText: string;
    searchLabel: string;
    searchText: string;
    loadingText: string;
    emptyText: string;
    errorText: string;
    source: GallerySourceAdapter | null;
}

const defaultOptions: GalleryV3Options = {
    buttonLabel: 'Gallery',
    tooltip: 'Insert gallery',
    dialogTitle: 'Image gallery',
    saveText: 'Insert',
    searchLabel: 'Search images',
    searchText: 'Search',
    loadingText: 'Loading images…',
    emptyText: 'No images found.',
    errorText: 'Unable to load images.',
    source: null,
};

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function fieldId(context: any, suffix: string): string {
    const editorId = context.options && context.options.id ? String(context.options.id) : 'editor';
    return `snb-gallery-${editorId}-${suffix}`;
}

function renderDialogBody(context: any, options: GalleryV3Options): string {
    const searchId = fieldId(context, 'search');

    return [
        '<div class="snb-gallery-v3-form">',
        '<div class="snb-gallery-v3-form__search">',
        `<label for="${searchId}">${escapeHtml(options.searchLabel)}</label>`,
        `<input id="${searchId}" class="snb-gallery-v3-form__query" type="search" autocomplete="off">`,
        `<button type="button" class="note-btn snb-gallery-v3-form__search-button">${escapeHtml(options.searchText)}</button>`,
        '</div>',
        '<p class="snb-gallery-v3-form__status" role="status" aria-live="polite"></p>',
        '<p class="snb-gallery-v3-form__error" role="alert" aria-live="assertive"></p>',
        '<div class="snb-gallery-v3-form__results" role="listbox" aria-multiselectable="true"></div>',
        '</div>',
    ].join('');
}

function renderResultItem(image: GalleryImage, index: number, selected: boolean): string {
    const label = image.title || image.alt || image.caption || image.src;

    return [
        `<button type="button" class="snb-gallery-v3-form__item" data-index="${index}" role="option" aria-selected="${selected ? 'true' : 'false'}">`,
        `<img src="${escapeHtml(image.src)}" alt="">`,
        `<span>${escapeHtml(label)}</span>`,
        '</button>',
    ].join('');
}

export default function SummernoteGalleryV3(this: any, context: any): void {
    const ui = ($ as any).summernote.ui;
    const configured = context.options[PLUGIN_NAME] || {};
    const pluginOptions = { ...defaultOptions, ...configured } as GalleryV3Options;
    const $editable = context.layoutInfo.editable as JQuery;
    const $editor = context.layoutInfo.editor as JQuery;
    let $dialog: JQuery | null = null;
    let editingTarget: HTMLElement | null = null;
    let availableImages: GalleryImage[] = [];
    let selectedImages = new Map<string, GalleryImage>();
    let activeRequest: AbortController | null = null;

    context.memo(`button.${PLUGIN_NAME}`, () => {
        return ui.button({
            contents: pluginOptions.buttonLabel,
            tooltip: pluginOptions.tooltip,
            click: () => this.show(),
        }).render();
    });

    const renderResults = () => {
        if (!$dialog) return;

        const markup = availableImages.map((image, index) => {
            return renderResultItem(image, index, selectedImages.has(galleryImageKey(image)));
        }).join('');

        $dialog.find('.snb-gallery-v3-form__results').html(markup);
        $dialog.find('.snb-gallery-v3-form__status').text(
            availableImages.length ? '' : pluginOptions.emptyText,
        );
    };

    const loadImages = async (query = '') => {
        if (!$dialog) return;

        if (!pluginOptions.source || typeof pluginOptions.source.list !== 'function') {
            $dialog.find('.snb-gallery-v3-form__error').text(
                'Configure summernoteGallery.source with a GallerySourceAdapter.',
            );
            return;
        }

        activeRequest?.abort();
        activeRequest = new AbortController();
        $dialog.find('.snb-gallery-v3-form__error').text('');
        $dialog.find('.snb-gallery-v3-form__status').text(pluginOptions.loadingText);
        $dialog.find('.snb-gallery-v3-form__results').empty();

        try {
            const page = await pluginOptions.source.list({
                query,
                signal: activeRequest.signal,
            });

            if (activeRequest.signal.aborted) return;
            availableImages = Array.isArray(page.items) ? page.items : [];
            renderResults();
        } catch (error) {
            if (activeRequest.signal.aborted) return;
            const message = error instanceof Error && error.message ? error.message : pluginOptions.errorText;
            $dialog.find('.snb-gallery-v3-form__status').text('');
            $dialog.find('.snb-gallery-v3-form__error').text(message);
        }
    };

    const save = () => {
        if (!$dialog || selectedImages.size === 0) {
            $dialog?.find('.snb-gallery-v3-form__error').text('Select at least one image.');
            return;
        }

        const data: GalleryData = { images: Array.from(selectedImages.values()) };
        const nextElement = renderGallery(data);

        if (editingTarget) {
            context.invoke('editor.beforeCommand');
            try {
                editingTarget.replaceWith(nextElement);
            } finally {
                context.invoke('editor.afterCommand');
            }
        } else {
            context.invoke('editor.insertNode', nextElement);
        }

        ui.hideDialog($dialog);
    };

    this.initialize = () => {
        const $container = context.options.dialogsInBody ? $(document.body) : $editor;
        const dialog = ui.dialog({
            title: pluginOptions.dialogTitle,
            body: renderDialogBody(context, pluginOptions),
            footer: `<button type="button" class="note-btn snb-gallery-v3-form__save">${escapeHtml(pluginOptions.saveText)}</button>`,
        }).render().appendTo($container) as JQuery;

        $dialog = dialog;

        $editable.on(`dblclick${EVENT_NAMESPACE}`, '[data-snb-brick="gallery"]', (event) => {
            const target = event.currentTarget;
            if (target instanceof HTMLElement) this.show(target);
        });

        dialog.on(`click${EVENT_NAMESPACE}`, '.snb-gallery-v3-form__item', (event) => {
            const index = Number($(event.currentTarget).attr('data-index'));
            const image = availableImages[index];
            if (!image) return;

            const key = galleryImageKey(image);
            if (selectedImages.has(key)) selectedImages.delete(key);
            else selectedImages.set(key, image);

            renderResults();
        });

        dialog.on(`click${EVENT_NAMESPACE}`, '.snb-gallery-v3-form__search-button', () => {
            const query = String(dialog.find('.snb-gallery-v3-form__query').val() || '');
            void loadImages(query);
        });

        dialog.on(`keydown${EVENT_NAMESPACE}`, '.snb-gallery-v3-form__query', (event: JQuery.KeyDownEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const query = String($(event.currentTarget).val() || '');
                void loadImages(query);
            }
        });
    };

    this.destroy = () => {
        activeRequest?.abort();
        activeRequest = null;
        $editable.off(EVENT_NAMESPACE);

        if ($dialog) {
            $dialog.off(EVENT_NAMESPACE);
            ui.hideDialog($dialog);
            $dialog.remove();
            $dialog = null;
        }

        availableImages = [];
        selectedImages.clear();
        editingTarget = null;
    };

    this.show = (target?: HTMLElement) => {
        if (!$dialog) return;

        editingTarget = target || null;
        availableImages = [];
        selectedImages = new Map<string, GalleryImage>();

        if (editingTarget) {
            const existing = parseGallery(editingTarget);
            existing?.images.forEach((image) => selectedImages.set(galleryImageKey(image), image));
        }

        $dialog.find('.snb-gallery-v3-form__query').val('');
        $dialog.find('.snb-gallery-v3-form__error').text('');
        $dialog.find('.snb-gallery-v3-form__results').empty();

        const $save = $dialog.find('.snb-gallery-v3-form__save');
        $save.off(`click${EVENT_NAMESPACE}`).on(`click${EVENT_NAMESPACE}`, (event: JQuery.ClickEvent) => {
            event.preventDefault();
            save();
        });

        ui.onDialogShown($dialog, () => {
            $dialog?.find('.snb-gallery-v3-form__query').trigger('focus');
            void loadImages();
        });

        ui.onDialogHidden($dialog, () => {
            activeRequest?.abort();
            activeRequest = null;
            $save.off(`click${EVENT_NAMESPACE}`);
            editingTarget = null;
        });

        ui.showDialog($dialog);
    };
}
