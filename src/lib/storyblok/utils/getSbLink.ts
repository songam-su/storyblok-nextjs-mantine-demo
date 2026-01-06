import { StoryblokMultilink } from '@/lib/storyblok/resources/types/storyblok';

export function getSbLink(link?: StoryblokMultilink | null): string {
  if (!link) return '#';

  const type = link.linktype ?? 'story';

  const sanitizeUrl = (url?: string) => {
    if (!url) return '#';
    const trimmed = url.trim();
    if (!trimmed || trimmed === '#' || trimmed === 'https://#' || trimmed === 'http://#') return '#';
    if (trimmed.startsWith('#')) return '#';
    return trimmed;
  };

  switch (type) {
    case 'story':
      return `/${link.cached_url || ''}`.replace(/\/+$/, '');
    case 'url':
      if (!link.url) return '#';
      if (/^(https?:|mailto:|tel:)/i.test(link.url)) {
        return sanitizeUrl(link.url);
      }
      if (link.url.startsWith('/')) {
        return sanitizeUrl(link.url);
      }
      return sanitizeUrl(`https://${link.url}`);
    case 'email':
      return link.email ? `mailto:${link.email}` : '#';
    case 'asset':
      return link.url || '#';
    default:
      return '#';
  }
}
