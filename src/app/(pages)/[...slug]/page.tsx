import { fetchStory } from '@/lib/storyblok/api';
import StoryblokRenderer from '@/lib/storyblok/rendering/storyblok-renderer';
import { notFound } from 'next/navigation';

type PageProps = {
  params: { slug?: string[] };
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug ? resolvedParams.slug.join('/') : 'home';

  const story = await fetchStory(slug, 'published');

  if (!story) notFound();

  return <StoryblokRenderer story={story} />;
}
