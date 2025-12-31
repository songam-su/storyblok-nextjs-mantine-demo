import { fetchStory } from '@/lib/storyblok/api/client';
import StoryblokRenderer from '@/lib/storyblok/rendering/StoryblokRenderer';
import { notFound } from 'next/navigation';
import { cookies, draftMode } from 'next/headers';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Awaitable<T> = T | Promise<T>;

type PreviewPageProps = {
  params: Awaitable<{ slug?: string[] }>;
  searchParams: Awaitable<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(props: PreviewPageProps): Promise<Metadata> {
  const params = await props.params;
  const slug = params?.slug ? params.slug.join('/') : 'home';

  const story = await fetchStory(slug, 'draft');
  const content = story?.content as any;

  if (!story) return {};

  return {
    title: content?.meta_title || story.name,
    description: content?.meta_description,
  };
}

export default async function PreviewPage(props: PreviewPageProps) {
  const params = await props.params;
  const slug = params?.slug ? params.slug.join('/') : 'home';

  const { isEnabled } = await draftMode();

  const cookieStore = await cookies();
  const hasPreviewData = Boolean(cookieStore.get('__next_preview_data'));
  const hasBypass = Boolean(cookieStore.get('__prerender_bypass'));
  const hasPreviewCookies = hasPreviewData && hasBypass;

  const isPreview = isEnabled || hasPreviewCookies;

  // Debugging logs
  // console.log('Server isPreview:', isPreview, '| draftMode:', isEnabled, '| cookies:', {
  //   __next_preview_data: hasPreviewData,
  //   __prerender_bypass: hasBypass,
  // });

  const story = await fetchStory(slug, isPreview ? 'draft' : 'published');

  if (!story) notFound();

  return <StoryblokRenderer story={story} isPreview={isPreview} />;
}
