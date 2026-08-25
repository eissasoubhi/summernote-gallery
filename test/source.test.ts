import { describe, expect, it } from 'vitest';
import {
  buildGalleryFolderTree,
  createStaticGallerySource,
  filterGalleryImagesByFolder,
  findGalleryFolderNode,
  galleryFolderPath,
  normalizeGalleryPath,
} from '../src/source';

describe('Gallery source contract', () => {
  const source = createStaticGallerySource([
    { id: 'mountain', src: '/mountain.jpg', alt: 'Mountain', title: 'Alpine view', createdAt: '2026-01-15T10:00:00Z', mediaType: 'image/jpeg' },
    { id: 'city', src: '/city.png', alt: 'City skyline', caption: 'Night lights', createdAt: '2026-03-20T12:00:00Z', mediaType: 'image/png' },
    { id: 'undated', src: '/archive.webp', alt: 'Archive', mediaType: 'image/webp' },
  ]);

  it('keeps the text search contract', async () => {
    expect((await source.list({ query: 'night' })).items.map((image) => image.id)).toEqual(['city']);
  });

  it('filters by normalized media type', async () => {
    const page = await source.list({ filters: { mediaType: ' IMAGE/PNG ' } });
    expect(page.items.map((image) => image.id)).toEqual(['city']);
    expect(page.items[0]?.mediaType).toBe('image/png');
  });

  it('filters inclusively by creation date range', async () => {
    const page = await source.list({ filters: { createdFrom: '2026-01-15T10:00:00Z', createdTo: '2026-02-01T00:00:00Z' } });
    expect(page.items.map((image) => image.id)).toEqual(['mountain']);
  });

  it('excludes undated items only when a date filter is requested', async () => {
    expect((await source.list({})).items.map((image) => image.id)).toContain('undated');
    expect((await source.list({ filters: { createdFrom: '2026-01-01' } })).items.map((image) => image.id)).not.toContain('undated');
  });

  it('composes query and structured filters', async () => {
    const page = await source.list({ query: 'city', filters: { mediaType: 'image/png', createdFrom: '2026-03-01' } });
    expect(page.items.map((image) => image.id)).toEqual(['city']);
  });

  it('normalizes folder paths without leaking filesystem syntax', () => {
    expect(normalizeGalleryPath(' /products\\summer//hero.jpg ')).toBe('products/summer/hero.jpg');
    expect(normalizeGalleryPath('./archive/./old.png')).toBe('archive/old.png');
  });

  it('builds a deterministic nested folder tree', () => {
    const tree = buildGalleryFolderTree([
      { id: 'hero', src: '/cdn/hero.jpg', alt: 'Hero', path: 'products/summer/hero.jpg' },
      { id: 'detail', src: '/cdn/detail.jpg', alt: 'Detail', path: 'products/summer/details/detail.jpg' },
      { id: 'root', src: '/cdn/root.jpg', alt: 'Root' },
      { id: 'winter', src: '/cdn/winter.jpg', alt: 'Winter', path: 'products/winter/winter.jpg' },
    ]);
    expect(tree.images.map((image) => image.id)).toEqual(['root']);
    expect(tree.children.map((folder) => folder.path)).toEqual(['products']);
    expect(tree.children[0]?.children.map((folder) => folder.path)).toEqual(['products/summer', 'products/winter']);
    expect(tree.children[0]?.children[0]?.images.map((image) => image.id)).toEqual(['hero']);
    expect(tree.children[0]?.children[0]?.children[0]?.path).toBe('products/summer/details');
  });

  it('resolves folders and exact-folder images', () => {
    const images = [
      { id: 'hero', src: '/hero.jpg', alt: 'Hero', path: 'products/summer/hero.jpg' },
      { id: 'detail', src: '/detail.jpg', alt: 'Detail', path: 'products/summer/details/detail.jpg' },
      { id: 'winter', src: '/winter.jpg', alt: 'Winter', path: 'products/winter/winter.jpg' },
      { id: 'root', src: '/root.jpg', alt: 'Root' },
    ];
    const tree = buildGalleryFolderTree(images);
    expect(galleryFolderPath(images[0]!)).toBe('products/summer');
    expect(findGalleryFolderNode(tree, 'products/summer')?.children.map((folder) => folder.name)).toEqual(['details']);
    expect(filterGalleryImagesByFolder(images, 'products/summer').map((image) => image.id)).toEqual(['hero']);
    expect(filterGalleryImagesByFolder(images, '').map((image) => image.id)).toEqual(['root']);
    expect(findGalleryFolderNode(tree, 'missing')).toBeNull();
  });

  it('keeps folder metadata source-only', () => {
    const tree = buildGalleryFolderTree([{ id: 'hero', src: '/cdn/hero.jpg', alt: 'Hero', path: 'products/hero.jpg' }]);
    expect(tree.children[0]?.images[0]?.path).toBe('products/hero.jpg');
  });
});
