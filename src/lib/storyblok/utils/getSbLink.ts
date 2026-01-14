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

  const normalizeInternalPath = (rawPath: string) => {
    const [pathPart, suffix = ''] = rawPath.split(/(?=[?#])/);
    const trimmed = (pathPart ?? '').trim();

    if (!trimmed) return '/';

    let normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    normalized = normalized.replace(/\/{2,}/g, '/');
    normalized = normalized.length > 1 ? normalized.replace(/\/+$/, '') : '/';

    // Treat Storyblok's conventional home slug as the site root.
    if (normalized === '/home') normalized = '/';

    return `${normalized}${suffix}`;
  };

  switch (type) {
    case 'story':
      return normalizeInternalPath(link.cached_url || '');
    case 'url':
      if (!link.url) return '#';
      if (/^(https?:|mailto:|tel:)/i.test(link.url)) {
        return sanitizeUrl(link.url);
      }
      if (link.url.startsWith('/')) {
        return normalizeInternalPath(sanitizeUrl(link.url));
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
