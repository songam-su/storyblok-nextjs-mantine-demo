const STORYBLOK_API = 'https://api.storyblok.com/v2/cdn';
const REVALIDATE_SECONDS = 600; // 10 min

export async function fetchStory(slug: string, version: 'published' | 'draft') {
  const token =
    version === 'draft'
      ? process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN // safe for client-side preview
      : process.env.STORYBLOK_PREVIEW_TOKEN; // private token for published

  const cache = version === 'published' ? 'force-cache' : 'no-store';
  const next = version === 'published' ? { revalidate: REVALIDATE_SECONDS } : undefined;

  const res = await fetch(`${STORYBLOK_API}/stories/${slug}?token=${token}&version=${version}`, {
    cache,
    next,
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.story;
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
