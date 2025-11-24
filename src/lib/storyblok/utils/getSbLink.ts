import { StoryblokMultilink } from '@/lib/storyblok/resources/types/storyblok';

export function getSbLink(link?: StoryblokMultilink | null): string {
  if (!link) return '#';

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
