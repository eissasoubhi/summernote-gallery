import { describe, expect, it } from 'vitest';
import { applyGalleryViewMode, normalizeGalleryViewMode } from '../../src/v3/plugin';

describe('Gallery v3 view modes', () => {
  it('normalizes unknown modes to grid', () => {
    expect(normalizeGalleryViewMode('gallery')).toBe('gallery');
    expect(normalizeGalleryViewMode('grid')).toBe('grid');
    expect(normalizeGalleryViewMode('other')).toBe('grid');
    expect(normalizeGalleryViewMode(undefined)).toBe('grid');
  });

  it('applies a responsive grid layout without touching persisted content', () => {
    const results = document.createElement('div');
    applyGalleryViewMode(results, 'grid');

    expect(results.dataset.view).toBe('grid');
    expect(results.style.display).toBe('grid');
    expect(results.style.gridTemplateColumns).toContain('minmax(120px, 1fr)');
    expect(results.style.gap).toBe('0.5rem');
  });

  it('switches the editor-only results container to gallery layout', () => {
    const results = document.createElement('div');
    applyGalleryViewMode(results, 'grid');
    applyGalleryViewMode(results, 'gallery');

    expect(results.dataset.view).toBe('gallery');
    expect(results.style.display).toBe('flex');
    expect(results.style.flexDirection).toBe('column');
    expect(results.style.gridTemplateColumns).toBe('');
  });
});
