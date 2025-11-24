import { StoryblokMultilink } from '@/lib/storyblok/generated/types/storyblok';

const STORYBLOK_PREVIEW_QUERY = '_storyblok';
const STORYBLOK_PREVIEW_HOST = 'app.storyblok.com';

const isStoryblokEditor = (): boolean => {
  if (typeof window === 'undefined') return false;

  const params = new URLSearchParams(window.location.search);
  if (params.has(STORYBLOK_PREVIEW_QUERY)) return true;

  const referrer = document?.referrer || '';
  return referrer.includes(STORYBLOK_PREVIEW_HOST);
};

/**
 * Convert a Storyblok multilink field into a usable href for Next.js links.
 * Falls back to '#'
 */
export function getSbLink(link?: StoryblokMultilink | null): string {
  if (!link) return '#';
  if (isStoryblokEditor()) return '#';

  const type = link.linktype ?? 'story';

  switch (type) {
    case 'story':
      return `/${link.cached_url || ''}`.replace(/\/+$/, '');
    case 'url':
      if (!link.url) return '#';
      if (/^(https?:|mailto:|tel:)/i.test(link.url)) {
        return link.url;
      }
      if (link.url.startsWith('/')) {
        return link.url;
      }
      return `https://${link.url}`;
    case 'email':
      return link.email ? `mailto:${link.email}` : '#';
    case 'asset':
      return link.url || '#';
    default:
      return '#';
  }
}
