import { fetchStory } from '@/lib/storyblok/api';
import StoryblokRenderer from '@/components/Storyblok/StoryblokRenderer';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';

type PreviewPageProps = {
  params: { slug?: string[] };
};

export default async function PreviewPage({ params }: PreviewPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug ? resolvedParams.slug.join('/') : 'home';

  const isDraft = (await draftMode()).isEnabled;

  const story = await fetchStory(slug, isDraft ? 'draft' : 'published');

  if (!story) notFound();

  return <StoryblokRenderer story={story} />;
}
