export async function fetchStory(slug: string, version: 'published' | 'draft') {
  const token =
    version === 'draft'
      ? process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN // safe for client-side preview
      : process.env.STORYBLOK_PREVIEW_TOKEN; // private token for published

  const url = `https://api.storyblok.com/v2/cdn/stories/${slug}?token=${token}&version=${version}`;

  const res = await fetch(url, {
    cache: version === 'published' ? 'force-cache' : 'no-store',
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.story;
}

export async function fetchTheme() {
  const token = process.env.STORYBLOK_THEME_TOKEN;
  const url = `https://api.storyblok.com/v2/cdn/themes?token=${token}`;
  const res = await fetch(url, { cache: 'force-cache' });
  if (!res.ok) return null;
  return await res.json();
}
