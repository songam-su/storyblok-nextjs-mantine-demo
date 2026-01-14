import { getCanonicalUrl } from '@/lib/site/canonicalUrl';
import { fetchStory } from '@/lib/storyblok/api/client';
import StoryblokRenderer from '@/lib/storyblok/rendering/StoryblokRenderer';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 600;
export const dynamic = 'force-static';

export async function generateMetadata(): Promise<Metadata> {
  const story = await fetchStory('home', 'published');
  const content = story?.content as any;

  if (!story) return {};

  return {
    title: content?.meta_title || story.name,
    description: content?.meta_description,
    alternates: {
      canonical: getCanonicalUrl('/'),
    },
  };
}

export default async function HomePage() {
  // Published home page. Preview is handled via the dedicated /sb-preview route.
  const story = await fetchStory('home', 'published');

  if (!story) notFound();

  return <StoryblokRenderer story={story} isPreview={false} />;
}
