import 'server-only';

const STORYBLOK_API = 'https://api.storyblok.com/v2/cdn';
const REVALIDATE_SECONDS = 600; // 10 min

import { getStory, type StoryblokVersion } from '@/lib/storyblok/api/storyblokServer';

export async function fetchStory(slug: string, version: StoryblokVersion) {
  // Note: App Router route segment caching is controlled by `export const revalidate` in the route.
  // We still force `no-store` for draft to avoid stale preview data.
  const fetchOptions: any =
    version === 'draft'
      ? { cache: 'no-store' }
      : {
          cache: 'force-cache',
          next: { revalidate: REVALIDATE_SECONDS },
        };
  return await getStory(slug, { version, fetchOptions });
}

export async function fetchTheme(version: 'published' | 'draft' = 'published') {
  const token =
    version === 'draft'
      ? process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN // safe for client-side preview
      : process.env.STORYBLOK_THEME_TOKEN; // private token for published

  const cache = version === 'published' ? 'force-cache' : 'no-store';
  const next = version === 'published' ? { revalidate: REVALIDATE_SECONDS } : undefined;

  const url = `${STORYBLOK_API}/themes?token=${token}&version=${version}`;
  const res = await fetch(url, {
    cache,
    next,
  });
  if (!res.ok) return null;
  return await res.json();
}
