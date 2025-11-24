import { fetchStory } from '@/lib/storyblok/api';
import StoryblokRenderer from '@/lib/storyblok/storyblokRenderer';
import { notFound } from 'next/navigation';
import { draftMode, headers } from 'next/headers';

type PreviewPageProps = {
  params: { slug?: string[] };
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function PreviewPage({ params, searchParams }: PreviewPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug ? resolvedParams.slug.join('/') : 'home';

  // SSR: Next.js draft mode
  let isPreview = (await draftMode()).isEnabled;

  // SSR: Fallbacks for Storyblok Visual Editor
  if (!isPreview) {
    const hdrs = headers();
    const referer = (await hdrs).get('referer') || '';
    const userAgent = (await hdrs).get('user-agent') || '';
    if (
      referer.includes('app.storyblok.com') ||
      userAgent.toLowerCase().includes('storyblok') ||
      slug.startsWith('sb-preview/')
    ) {
      isPreview = true;
    }
  }

  const story = await fetchStory(slug, isPreview ? 'draft' : 'published');

  if (!story) notFound();

  return <StoryblokRenderer story={story} isPreview={isPreview} />;
}
