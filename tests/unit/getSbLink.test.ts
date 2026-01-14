import type { StoryblokMultilink } from '@/lib/storyblok/resources/types/storyblok';
import { getSbLink } from '@/lib/storyblok/utils/getSbLink';
import { describe, expect, it } from 'vitest';

const storyLink = (cached_url: string): StoryblokMultilink =>
  ({
    linktype: 'story',
    cached_url,
  }) as any;

const urlLink = (url: string): StoryblokMultilink =>
  ({
    linktype: 'url',
    url,
  }) as any;

describe('getSbLink', () => {
  it('maps story "home" to root', () => {
    expect(getSbLink(storyLink('home'))).toBe('/');
  });

  it('returns root for empty story slug', () => {
    expect(getSbLink(storyLink(''))).toBe('/');
  });

  it('normalizes story slugs to absolute paths', () => {
    expect(getSbLink(storyLink('about'))).toBe('/about');
  });

  it('maps internal url "/home" to root', () => {
    expect(getSbLink(urlLink('/home'))).toBe('/');
  });

  it('maps internal url "/home/" to root', () => {
    expect(getSbLink(urlLink('/home/'))).toBe('/');
  });

  it('preserves query/hash while mapping /home to /', () => {
    expect(getSbLink(urlLink('/home?x=1'))).toBe('/?x=1');
    expect(getSbLink(urlLink('/home#top'))).toBe('/#top');
  });
});
