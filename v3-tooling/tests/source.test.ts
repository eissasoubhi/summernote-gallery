import { describe, expect, it } from 'vitest';
import { createStaticGallerySource } from '../../src/v3/source';

describe('Gallery v3 source contract', () => {
  const source = createStaticGallerySource([
    {
      id: 'mountain',
      src: '/mountain.jpg',
      alt: 'Mountain',
      title: 'Alpine view',
      createdAt: '2026-01-15T10:00:00Z',
      mediaType: 'image/jpeg',
    },
    {
      id: 'city',
      src: '/city.png',
      alt: 'City skyline',
      caption: 'Night lights',
      createdAt: '2026-03-20T12:00:00Z',
      mediaType: 'image/png',
    },
    {
      id: 'undated',
      src: '/archive.webp',
      alt: 'Archive',
      mediaType: 'image/webp',
    },
  ]);

  it('keeps the existing text search contract', async () => {
    const page = await source.list({ query: 'night' });
    expect(page.items.map((image) => image.id)).toEqual(['city']);
  });

  it('filters by normalized media type', async () => {
    const page = await source.list({ filters: { mediaType: ' IMAGE/PNG ' } });
    expect(page.items.map((image) => image.id)).toEqual(['city']);
    expect(page.items[0]?.mediaType).toBe('image/png');
  });

  it('filters inclusively by creation date range', async () => {
    const page = await source.list({
      filters: {
        createdFrom: '2026-01-15T10:00:00Z',
        createdTo: '2026-02-01T00:00:00Z',
      },
    });

    expect(page.items.map((image) => image.id)).toEqual(['mountain']);
  });

  it('excludes undated items only when a date filter is requested', async () => {
    expect((await source.list({})).items.map((image) => image.id)).toContain('undated');
    expect((await source.list({ filters: { createdFrom: '2026-01-01' } })).items.map((image) => image.id)).not.toContain('undated');
  });

  it('composes query and structured filters', async () => {
    const page = await source.list({
      query: 'city',
      filters: { mediaType: 'image/png', createdFrom: '2026-03-01' },
    });

    expect(page.items.map((image) => image.id)).toEqual(['city']);
  });
});
