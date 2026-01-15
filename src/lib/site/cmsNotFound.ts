import { getCanonicalUrl } from '@/lib/site/canonicalUrl';
import { fetchStory } from '@/lib/storyblok/api/client';
import type { Metadata } from 'next';

export async function fetchCmsNotFoundStory() {
  return fetchStory('error-404', 'published');
}

export async function generateCmsNotFoundMetadata(options?: { pathname?: string }): Promise<Metadata> {
  const story = await fetchCmsNotFoundStory();
  const content = story?.content as any;

  const pathname = options?.pathname ?? '/error-404';

  return {
    title: content?.meta_title || story?.name || '404',
    description: content?.meta_description,
    alternates: {
      canonical: getCanonicalUrl(pathname),
    },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}
