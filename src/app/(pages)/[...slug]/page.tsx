import { fetchStory } from '@/lib/storyblok/api/client';
import StoryblokRenderer from '@/lib/storyblok/rendering/StoryblokRenderer';
import { resolveStoryblokPreview } from '@/lib/storyblok/utils/preview';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 600;

type Awaitable<T> = T | Promise<T>;

type PageProps = {
  params: Awaitable<{ slug?: string[] }>;
  searchParams?: Awaitable<Record<string, string | string[] | undefined>>;
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

export default async function Page({ params, searchParams }: PageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams ?? Promise.resolve(undefined),
  ]);

  const slug = resolvedParams?.slug ? resolvedParams.slug.join('/') : 'home';

  const isPreview = await resolveStoryblokPreview(resolvedSearchParams);

  const story = await fetchStory(slug, isPreview ? 'draft' : 'published');

  if (!story) notFound();

  return <StoryblokRenderer story={story} isPreview={isPreview} />;
}
