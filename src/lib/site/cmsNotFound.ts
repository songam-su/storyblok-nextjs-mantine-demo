import { getCanonicalUrl } from '@/lib/site/canonicalUrl';
import { fetchStory } from '@/lib/storyblok/api/client';
import type { Metadata } from 'next';

export function getCmsNotFoundStorySlug(): string {
  const raw = process.env.STORYBLOK_404_SLUG;
  const trimmed = typeof raw === 'string' ? raw.trim() : '';
  return trimmed || 'error-404';
}

export async function fetchCmsNotFoundStory(version: 'published' | 'draft' = 'published') {
  try {
    return await fetchStory(getCmsNotFoundStorySlug(), version);
  } catch {
    return null;
  }
}

export async function generateCmsNotFoundMetadata(options?: { pathname?: string }): Promise<Metadata> {
  const story = await fetchCmsNotFoundStory();
  const content = story?.content as any;

  // For unknown routes, callers should pass the requested pathname so the
  // canonical is self-referential (e.g. /asdf -> canonical /asdf).
  // For the generic App Router not-found boundary we intentionally omit
  // canonical to avoid canonicalizing all 404s to a single URL.
  const pathname = options?.pathname;

  return {
    title: content?.meta_title || story?.name || '404',
    description: content?.meta_description,
    ...(pathname
      ? {
          alternates: {
            canonical: getCanonicalUrl(pathname).toString(),
          },
        }
      : null),
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },
  };
}
