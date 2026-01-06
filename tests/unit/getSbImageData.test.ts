import { describe, expect, it } from 'vitest';
import getSbImageData from '@/lib/storyblok/utils/image';
import type { StoryblokAsset } from '@/lib/storyblok/resources/types/storyblok';

const baseAsset = (overrides: Partial<StoryblokAsset> = {}): StoryblokAsset => ({
  alt: null,
  copyright: null,
  fieldtype: 'asset',
  id: 1,
  filename: 'https://assets.example/image.jpg',
  name: 'image',
  title: null,
  focus: null,
  meta_data: {},
  source: null,
  is_external_url: false,
  is_private: false,
  src: 'https://assets.example/image.jpg',
  updated_at: '',
  width: 1000,
  height: 800,
  aspect_ratio: null,
  public_id: null,
  content_type: 'image/jpeg',
  ...overrides,
});

describe('getSbImageData', () => {
  it('normalizes "50x50" focus to center without crop', () => {
    const asset = baseAsset({ focus: '50x50' });
    const data = getSbImageData(asset);
    expect(data?.objectPosition).toBe('50% 50%');
  });

  it('clamps out-of-range focus to bounds', () => {
    const asset = baseAsset({ focus: '120 30' });
    const data = getSbImageData(asset);
    // 120 treated as percent -> 1.2 -> clamped to 1.0
    expect(data?.objectPosition).toBe('100% 30%');
  });

  it('adjusts focal point when cropping horizontally (wider image to 16:9)', () => {
    const asset = baseAsset({ width: 4000, height: 2000, focus: '75 25' });
    const data = getSbImageData(asset, { x: 16, y: 9 });
    expect(data?.objectPosition).toBe('72% 25%');
  });

  it('returns null when no asset provided', () => {
    const data = getSbImageData(null as any);
    expect(data).toBeNull();
  });
});
