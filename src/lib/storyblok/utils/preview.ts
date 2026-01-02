import { cookies, draftMode } from 'next/headers';

export type StoryblokSearchParams = Record<string, string | string[] | undefined> | undefined;

// Centralized preview detection used by Storyblok routes
export async function resolveStoryblokPreview(searchParams?: StoryblokSearchParams): Promise<boolean> {
  const { isEnabled } = await draftMode();

  const cookieStore = await cookies();
  const hasPreviewData = Boolean(cookieStore.get('__next_preview_data'));
  const hasBypass = Boolean(cookieStore.get('__prerender_bypass'));
  const hasPreviewCookies = hasPreviewData && hasBypass;

  const hasStoryblokParams = Boolean(searchParams?._storyblok || searchParams?.['_storyblok_tk']);

  return isEnabled || hasPreviewCookies || hasStoryblokParams;
}
