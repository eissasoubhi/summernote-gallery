export interface GalleryImage {
    id?: string;
    src: string;
    alt: string;
    title?: string;
    caption?: string;
    width?: number;
    height?: number;
}

export interface GalleryData {
    images: GalleryImage[];
}

function nonEmpty(value: string, label: string): string {
    const normalized = value.trim();

    if (!normalized) {
        throw new TypeError(`${label} must be a non-empty string.`);
    }

    return normalized;
}

function optionalText(value: string | undefined): string | undefined {
    if (typeof value !== 'string') {
        return undefined;
    }

    const normalized = value.trim();
    return normalized || undefined;
}

export function galleryImageKey(image: GalleryImage): string {
    return optionalText(image.id) || nonEmpty(image.src, 'Image src');
}

export function normalizeGalleryImage(image: GalleryImage): GalleryImage {
    const normalized: GalleryImage = {
        src: nonEmpty(image.src, 'Image src'),
        alt: typeof image.alt === 'string' ? image.alt : '',
    };

    const id = optionalText(image.id);
    const title = optionalText(image.title);
    const caption = optionalText(image.caption);

    if (id) normalized.id = id;
    if (title) normalized.title = title;
    if (caption) normalized.caption = caption;
    if (Number.isFinite(image.width) && Number(image.width) > 0) normalized.width = Number(image.width);
    if (Number.isFinite(image.height) && Number(image.height) > 0) normalized.height = Number(image.height);

    return normalized;
}

export function renderGallery(data: GalleryData): HTMLElement {
    if (!Array.isArray(data.images) || data.images.length === 0) {
        throw new TypeError('Select at least one image.');
    }

    const root = document.createElement('div');
    root.className = 'snb-brick snb-gallery';
    root.setAttribute('data-snb-brick', 'gallery');
    root.setAttribute('data-snb-version', '3');
    root.setAttribute('role', 'group');
    root.setAttribute('aria-label', 'Image gallery');

    data.images.map(normalizeGalleryImage).forEach((image) => {
        const figure = document.createElement('figure');
        figure.className = 'snb-gallery__item';

        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.alt;
        img.loading = 'lazy';
        img.decoding = 'async';

        if (image.id) img.setAttribute('data-snb-image-id', image.id);
        if (image.title) img.title = image.title;
        if (image.width) img.width = image.width;
        if (image.height) img.height = image.height;

        figure.appendChild(img);

        if (image.caption) {
            const caption = document.createElement('figcaption');
            caption.className = 'snb-gallery__caption';
            caption.textContent = image.caption;
            figure.appendChild(caption);
        }

        root.appendChild(figure);
    });

    return root;
}

export function parseGallery(element: Element): GalleryData | null {
    if (element.getAttribute('data-snb-brick') !== 'gallery') {
        return null;
    }

    const images = Array.from(element.querySelectorAll('.snb-gallery__item img')).map((img) => {
        const image: GalleryImage = {
            src: img.getAttribute('src') || '',
            alt: img.getAttribute('alt') || '',
        };

        const id = img.getAttribute('data-snb-image-id');
        const title = img.getAttribute('title');
        const caption = img.closest('.snb-gallery__item')?.querySelector('.snb-gallery__caption')?.textContent || undefined;
        const width = img.getAttribute('width');
        const height = img.getAttribute('height');

        if (id) image.id = id;
        if (title) image.title = title;
        if (caption) image.caption = caption;
        if (width && Number(width) > 0) image.width = Number(width);
        if (height && Number(height) > 0) image.height = Number(height);

        return normalizeGalleryImage(image);
    });

    return images.length ? { images } : null;
}
