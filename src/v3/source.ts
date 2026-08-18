import { GalleryImage, normalizeGalleryImage } from './gallery';

export interface GallerySourceRequest {
    query?: string;
    cursor?: string;
    signal?: AbortSignal;
}

export interface GallerySourcePage {
    items: GalleryImage[];
    nextCursor?: string;
}

export interface GallerySourceAdapter {
    list(request: GallerySourceRequest): Promise<GallerySourcePage>;
}

export interface GalleryUploadAdapter {
    upload(files: File[], signal?: AbortSignal): Promise<GalleryImage[]>;
}

export function createStaticGallerySource(images: GalleryImage[]): GallerySourceAdapter {
    const normalized = images.map(normalizeGalleryImage);

    return {
        async list(request: GallerySourceRequest): Promise<GallerySourcePage> {
            if (request.signal?.aborted) {
                throw new DOMException('The operation was aborted.', 'AbortError');
            }

            const query = (request.query || '').trim().toLocaleLowerCase();
            const items = query
                ? normalized.filter((image) => [image.alt, image.title, image.caption, image.src]
                    .filter(Boolean)
                    .some((value) => String(value).toLocaleLowerCase().includes(query)))
                : normalized;

            return { items };
        },
    };
}
