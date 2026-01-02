import { fetchStory } from '@/lib/storyblok/api/client';
import StoryblokRenderer from '@/lib/storyblok/rendering/StoryblokRenderer';
import { notFound } from 'next/navigation';
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

  const story = await fetchStory(slug, 'draft');

  if (!story) notFound();

  return <StoryblokRenderer story={story} isPreview={true} />;
}
