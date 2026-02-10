import { getCanonicalUrl } from '@/lib/site/canonicalUrl';
import { getCmsNotFoundStorySlug } from '@/lib/site/cmsNotFound';
import { isPreviewAllowed } from '@/lib/site/previewAccess';
import { fetchStory } from '@/lib/storyblok/api/client';
import StoryblokRenderer from '@/lib/storyblok/rendering/StoryblokRenderer';
import type { Metadata } from 'next';
import { draftMode, headers } from 'next/headers';
import { redirect } from 'next/navigation';

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
  const rawSegments = params?.slug ?? [];
  const slug = rawSegments.length ? rawSegments.map((s) => s.toLowerCase()).join('/') : 'home';
  const publishedPathname = slug === 'home' ? '/' : `/${slug}`;

  const story = await fetchStory(slug, 'draft');
  const content = story?.content as any;

  if (!story) return {};

  return {
    title: content?.meta_title || story.name,
    description: content?.meta_description,
    // Defense-in-depth: discourage indexing even if headers are misconfigured.
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },
    // Canonicalize preview pages to their published URL to avoid duplicate-content signals.
    alternates: {
      canonical: getCanonicalUrl(publishedPathname).toString(),
    },
  };
}

export default async function PreviewPage(props: PreviewPageProps) {
  const h = await headers();
  const host = h.get('host');
  const draft = await draftMode();

  const params = await props.params;
  const rawSegments = params?.slug ?? [];
  const normalizedSegments = rawSegments.map((s) => s.toLowerCase());
  const slug = normalizedSegments.length ? normalizedSegments.join('/') : 'home';

  // Build an absolute URL so preview gating can detect Storyblok query params.
  const sp = await props.searchParams;
  const qs = new URLSearchParams();
  Object.entries(sp ?? {}).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((v) => typeof v === 'string' && qs.append(key, v));
    else if (typeof value === 'string') qs.set(key, value);
  });

  const url = host ? `https://${host}/sb-preview/${slug}?${qs.toString()}` : null;
  if (!isPreviewAllowed({ host, headers: h, url, isDraftModeEnabled: draft.isEnabled })) {
    const nextPath = `/sb-preview/${slug}`;
    const nextQuery = qs.toString();
    const nextWithQuery = `${nextPath}${nextQuery ? `?${nextQuery}` : ''}`;
    redirect(`/sb-preview/login?next=${encodeURIComponent(nextWithQuery)}`);
  }

  // Canonicalize mixed-case vanity URLs (e.g. /sb-preview/HoMe -> /sb-preview/home).
  if (rawSegments.length && rawSegments.some((s, i) => s !== normalizedSegments[i])) {
    const canonical = `/sb-preview/${slug}${qs.toString() ? `?${qs.toString()}` : ''}`;
    redirect(canonical);
  }

  const story = await fetchStory(slug, 'draft');

  if (!story) {
    const notFoundSlug = getCmsNotFoundStorySlug();
    // For missing preview stories, always route to the CMS-driven 404 in preview.
    // Avoid redirect loops if the CMS 404 story itself is missing.
    if (slug !== notFoundSlug) {
      const canonical404 = `/sb-preview/${notFoundSlug}${qs.toString() ? `?${qs.toString()}` : ''}`;
      redirect(canonical404);
    }

    const { default: CmsPreviewNotFoundPage } = await import(
      '@/components/chrome/CmsPreviewNotFoundPage/CmsPreviewNotFoundPage'
    );
    return <CmsPreviewNotFoundPage />;
  }

  return <StoryblokRenderer story={story} isPreview={true} />;
}
