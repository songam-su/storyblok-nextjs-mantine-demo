import { fetchStory } from '@/lib/storyblok/api/client';
import StoryblokRenderer from '@/lib/storyblok/rendering/StoryblokRenderer';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 600;
export const dynamic = 'force-static';

type Awaitable<T> = T | Promise<T>;

type PageProps = {
  params: Awaitable<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug ? resolvedParams.slug.join('/') : 'home';

  const story = await fetchStory(slug, 'published');
  const content = story?.content as any;

  if (!story) return {};

  return {
    title: content?.meta_title || story.name,
    description: content?.meta_description,
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug ? resolvedParams.slug.join('/') : 'home';

  // Published pages only. Preview is handled via the dedicated /sb-preview route.
  const story = await fetchStory(slug, 'published');

  if (!story) notFound();

  return <StoryblokRenderer story={story} isPreview={false} />;
}
