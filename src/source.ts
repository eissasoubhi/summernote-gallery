import { GalleryImage, normalizeGalleryImage } from './gallery';

export interface GallerySourceImage extends GalleryImage {
    createdAt?: string;
    mediaType?: string;
    path?: string;
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

export interface GalleryFolderNode {
    name: string;
    path: string;
    children: GalleryFolderNode[];
    images: GallerySourceImage[];
}

function normalizeSourceImage(image: GallerySourceImage): GallerySourceImage {
    const normalized: GallerySourceImage = normalizeGalleryImage(image);
    const createdAt = typeof image.createdAt === 'string' ? image.createdAt.trim() : '';
    const mediaType = typeof image.mediaType === 'string' ? image.mediaType.trim().toLocaleLowerCase() : '';
    const path = normalizeGalleryPath(image.path);

    if (createdAt) normalized.createdAt = createdAt;
    if (mediaType) normalized.mediaType = mediaType;
    if (path) normalized.path = path;

    return normalized;
}

export function normalizeGalleryPath(value: string | undefined): string {
    if (typeof value !== 'string') return '';

    return value
        .trim()
        .replace(/\\/g, '/')
        .split('/')
        .map((segment) => segment.trim())
        .filter((segment) => Boolean(segment) && segment !== '.')
        .join('/');
}

export function galleryFolderPath(image: GallerySourceImage): string {
    const path = normalizeGalleryPath(image.path);
    if (!path) return '';
    const segments = path.split('/');
    return segments.length > 1 ? segments.slice(0, -1).join('/') : '';
}

export function filterGalleryImagesByFolder(images: GallerySourceImage[], folderPath: string): GallerySourceImage[] {
    const normalizedFolder = normalizeGalleryPath(folderPath);
    return images.filter((image) => galleryFolderPath(image) === normalizedFolder);
}

export function findGalleryFolderNode(root: GalleryFolderNode, folderPath: string): GalleryFolderNode | null {
    const normalizedFolder = normalizeGalleryPath(folderPath);
    if (!normalizedFolder) return root;

    const segments = normalizedFolder.split('/');
    let current = root;

    for (const segment of segments) {
        const next = current.children.find((child) => child.name === segment);
        if (!next) return null;
        current = next;
    }

    return current;
}

export function buildGalleryFolderTree(images: GallerySourceImage[]): GalleryFolderNode {
    const root: GalleryFolderNode = { name: '', path: '', children: [], images: [] };
    const nodes = new Map<string, GalleryFolderNode>([['', root]]);

    for (const input of images) {
        const image = normalizeSourceImage(input);
        const path = image.path || '';
        const segments = path.split('/').filter(Boolean);
        const folderSegments = segments.slice(0, -1);
        let parent = root;
        let currentPath = '';

        for (const segment of folderSegments) {
            currentPath = currentPath ? `${currentPath}/${segment}` : segment;
            let node = nodes.get(currentPath);

            if (!node) {
                node = { name: segment, path: currentPath, children: [], images: [] };
                nodes.set(currentPath, node);
                parent.children.push(node);
            }

            parent = node;
        }

        parent.images.push(image);
    }

    const sortNode = (node: GalleryFolderNode): void => {
        node.children.sort((a, b) => a.name.localeCompare(b.name));
        node.images.sort((a, b) => (a.path || a.src).localeCompare(b.path || b.src));
        node.children.forEach(sortNode);
    };

    sortNode(root);
    return root;
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
                if (query && ![image.alt, image.title, image.caption, image.src, image.path]
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
