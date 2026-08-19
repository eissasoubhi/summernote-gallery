import { describe, expect, it } from 'vitest';
import {
  migrateLegacyGallery,
  parseGallery,
  parseLegacyGallery,
  renderGallery,
} from '../../src/v3/gallery';

describe('Gallery v3 content contract', () => {
  it('round-trips semantic gallery content', () => {
    const node = renderGallery({ images: [{ id: 'mountain', src: '/mountain.jpg', alt: 'Mountain', title: 'Mountain', caption: 'Alpine view', width: 640, height: 480 }] });

    expect(node.getAttribute('data-snb-brick')).toBe('gallery');
    expect(node.getAttribute('data-snb-version')).toBe('3');
    expect(node.querySelector('figure img')?.getAttribute('data-snb-image-id')).toBe('mountain');
    expect(parseGallery(node)).toEqual({ images: [{ id: 'mountain', src: '/mountain.jpg', alt: 'Mountain', title: 'Mountain', caption: 'Alpine view', width: 640, height: 480 }] });
  });

  it('migrates legacy selectedImages only when explicitly requested', () => {
    const legacy = document.createElement('div');
    legacy.setAttribute('data-brickdata', JSON.stringify({ selectedImages: [{ id: 'legacy-1', url: '/legacy.jpg', title: 'Legacy image' }] }));
    legacy.innerHTML = '<img src="/legacy.jpg" title="Legacy image" alt="Legacy alt">';

    expect(parseLegacyGallery(legacy)).toEqual({ images: [{ id: 'legacy-1', src: '/legacy.jpg', alt: 'Legacy alt', title: 'Legacy image' }] });

    const migrated = migrateLegacyGallery(legacy);
    expect(migrated).not.toBeNull();
    expect(migrated?.getAttribute('data-snb-version')).toBe('3');
    expect(migrated?.hasAttribute('data-brickdata')).toBe(false);
    expect(migrated?.querySelector('figure img')?.getAttribute('data-snb-image-id')).toBe('legacy-1');
    expect(legacy.hasAttribute('data-brickdata')).toBe(true);
  });

  it('rejects malformed legacy payloads without mutating source content', () => {
    const legacy = document.createElement('div');
    legacy.setAttribute('data-brickdata', '{bad-json');
    legacy.innerHTML = '<img src="/legacy.jpg" alt="Legacy">';

    expect(parseLegacyGallery(legacy)).toBeNull();
    expect(migrateLegacyGallery(legacy)).toBeNull();
    expect(legacy.getAttribute('data-brickdata')).toBe('{bad-json');
  });
});
