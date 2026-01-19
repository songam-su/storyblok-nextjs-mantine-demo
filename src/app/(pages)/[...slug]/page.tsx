import { getCanonicalUrl } from '@/lib/site/canonicalUrl';
import { generateCmsNotFoundMetadata } from '@/lib/site/cmsNotFound';
import { fetchStory } from '@/lib/storyblok/api/client';
import StoryblokRenderer from '@/lib/storyblok/rendering/StoryblokRenderer';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 600;
export const dynamic = 'force-static';

type Awaitable<T> = T | Promise<T>;

type PageProps = {
  params: Awaitable<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug ? resolvedParams.slug.join('/') : 'home';

  const pathname = resolvedParams?.slug?.length ? `/${resolvedParams.slug.join('/')}` : '/';

  const story = await fetchStory(slug, 'published');
  const content = story?.content as any;

  if (!story) {
    return generateCmsNotFoundMetadata({ pathname });
  }

  return {
    title: content?.meta_title || story.name,
    description: content?.meta_description,
    alternates: {
      canonical: getCanonicalUrl(pathname).toString(),
    },
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug ? resolvedParams.slug.join('/') : 'home';

  // Published pages only. Preview is handled via the dedicated /sb-preview route.
  const story = await fetchStory(slug, 'published');

  if (!story) {
    // Ensure a true 404 response while rendering the CMS-driven 404 content.
    // (The route-group not-found boundary renders the CMS 404 story with a safe fallback.)
    notFound();
  }

  return <StoryblokRenderer story={story} isPreview={false} />;
}
