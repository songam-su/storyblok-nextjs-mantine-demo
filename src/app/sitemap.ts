import type { MetadataRoute } from 'next';

import 'server-only';

import { canonicalizePathname } from '@/lib/site/canonicalPath';
import { getCmsNotFoundStorySlug } from '@/lib/site/cmsNotFound';
import { SITE_URL } from '@/lib/site/siteUrl';
import { getLinks } from '@/lib/storyblok/api/storyblokServer';

export const revalidate = 600;
export const dynamic = 'force-static';

const EXCLUDED_SLUGS = new Set(['site-config', getCmsNotFoundStorySlug()]);

function toPathnameFromStoryblokLink(link: any): string | null {
  if (!link || typeof link !== 'object') return null;
  if (link.is_folder) return null;

  // Storyblok returns either `real_path` (often) or `slug`.
  const raw =
    (typeof link.real_path === 'string' && link.real_path.trim()) ||
    (typeof link.slug === 'string' && link.slug.trim()) ||
    (typeof link.full_slug === 'string' && link.full_slug.trim()) ||
    null;

  if (!raw) return null;

  const cleaned = raw.replace(/^\/+/, '').replace(/\/+$/, '').toLowerCase();
  if (!cleaned) return '/';

  if (EXCLUDED_SLUGS.has(cleaned)) return null;
  if (cleaned.startsWith('sb-preview')) return null;
  if (cleaned === 'api' || cleaned.startsWith('api/')) return null;

  // Storyblok convention: "home" story is the site root.
  if (cleaned === 'home') return '/';

  return canonicalizePathname(`/${cleaned}`);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: new URL('/', SITE_URL).toString(),
    },
  ];

  const seen = new Set<string>(entries.map((entry) => entry.url));

  let links: any[] = [];
  try {
    links = await getLinks({ version: 'published', perPage: 100 });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const isConfigError = typeof message === 'string' && message.includes('Missing Storyblok');
    if (!isConfigError) throw error;
    // If Storyblok tokens aren't configured (e.g. local dev), don't fail builds.
  }
  for (const link of links) {
    // If Storyblok exposes published flag, respect it.
    if (typeof link?.published === 'boolean' && !link.published) continue;

    const pathname = toPathnameFromStoryblokLink(link);
    if (!pathname) continue;

    const url = new URL(pathname, SITE_URL).toString();
    if (seen.has(url)) continue;
    seen.add(url);

    const publishedAtRaw =
      (typeof link?.published_at === 'string' && link.published_at) ||
      (typeof link?.first_published_at === 'string' && link.first_published_at) ||
      null;

    const lastModified = publishedAtRaw ? new Date(publishedAtRaw) : undefined;

    entries.push({
      url,
      ...(lastModified && !Number.isNaN(lastModified.getTime()) ? { lastModified } : null),
    });
  }

  // Deterministic output helps caching/debugging.
  entries.sort((a, b) => a.url.localeCompare(b.url));

  return entries;
}
