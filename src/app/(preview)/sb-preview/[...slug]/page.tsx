import { isPreviewAllowed } from '@/lib/site/previewAccess';
import { fetchStory } from '@/lib/storyblok/api/client';
import StoryblokRenderer from '@/lib/storyblok/rendering/StoryblokRenderer';
import type { Metadata } from 'next';
import { draftMode, headers } from 'next/headers';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Awaitable<T> = T | Promise<T>;

type PreviewPageProps = {
  params: Awaitable<{ slug?: string[] }>;
  searchParams: Awaitable<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(props: PreviewPageProps): Promise<Metadata> {
  const h = await headers();
  const host = h.get('host');
  const draft = await draftMode();
  if (!isPreviewAllowed({ host, headers: h, isDraftModeEnabled: draft.isEnabled })) return {};

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
  const h = await headers();
  const host = h.get('host');
  const draft = await draftMode();

  const params = await props.params;
  const slug = params?.slug ? params.slug.join('/') : 'home';

  // Build an absolute URL so preview gating can detect Storyblok query params.
  const sp = await props.searchParams;
  const qs = new URLSearchParams();
  Object.entries(sp ?? {}).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((v) => typeof v === 'string' && qs.append(key, v));
    else if (typeof value === 'string') qs.set(key, value);
  });

  const url = host ? `https://${host}/sb-preview/${slug}?${qs.toString()}` : null;
  if (!isPreviewAllowed({ host, headers: h, url, isDraftModeEnabled: draft.isEnabled })) notFound();

  const story = await fetchStory(slug, 'draft');

  if (!story) notFound();

  return <StoryblokRenderer story={story} isPreview={true} />;
}
