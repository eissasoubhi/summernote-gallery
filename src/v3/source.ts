import { GalleryImage, normalizeGalleryImage } from './gallery';

export interface GallerySourceImage extends GalleryImage {
    createdAt?: string;
    mediaType?: string;
}

export interface GallerySourceFilters {
    mediaType?: string;
    createdFrom?: string;
    createdTo?: string;
}

export interface GallerySourceRequest {
    query?: string;
    filters?: GallerySourceFilters;
    cursor?: string;
    signal?: AbortSignal;
}

export interface GallerySourcePage {
    items: GallerySourceImage[];
    nextCursor?: string;
}

export interface GallerySourceAdapter {
    list(request: GallerySourceRequest): Promise<GallerySourcePage>;
}

export interface GalleryUploadAdapter {
    upload(files: File[], signal?: AbortSignal): Promise<GalleryImage[]>;
}

function normalizeSourceImage(image: GallerySourceImage): GallerySourceImage {
    const normalized: GallerySourceImage = normalizeGalleryImage(image);
    const createdAt = typeof image.createdAt === 'string' ? image.createdAt.trim() : '';
    const mediaType = typeof image.mediaType === 'string' ? image.mediaType.trim().toLocaleLowerCase() : '';

    if (createdAt) normalized.createdAt = createdAt;
    if (mediaType) normalized.mediaType = mediaType;

    return normalized;
}

function timestamp(value: string | undefined): number | undefined {
    if (!value) return undefined;
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}

export function createStaticGallerySource(images: GallerySourceImage[]): GallerySourceAdapter {
    const normalized = images.map(normalizeSourceImage);

    return {
        async list(request: GallerySourceRequest): Promise<GallerySourcePage> {
            if (request.signal?.aborted) {
                throw new DOMException('The operation was aborted.', 'AbortError');
            }

            const query = (request.query || '').trim().toLocaleLowerCase();
            const mediaType = (request.filters?.mediaType || '').trim().toLocaleLowerCase();
            const createdFrom = timestamp(request.filters?.createdFrom);
            const createdTo = timestamp(request.filters?.createdTo);

            const items = normalized.filter((image) => {
                if (query && ![image.alt, image.title, image.caption, image.src]
                    .filter(Boolean)
                    .some((value) => String(value).toLocaleLowerCase().includes(query))) {
                    return false;
                }

                if (mediaType && image.mediaType !== mediaType) {
                    return false;
                }

                if (createdFrom !== undefined || createdTo !== undefined) {
                    const imageCreatedAt = timestamp(image.createdAt);
                    if (imageCreatedAt === undefined) return false;
                    if (createdFrom !== undefined && imageCreatedAt < createdFrom) return false;
                    if (createdTo !== undefined && imageCreatedAt > createdTo) return false;
                }

                return true;
            });

            return { items };
        },
    };
}
