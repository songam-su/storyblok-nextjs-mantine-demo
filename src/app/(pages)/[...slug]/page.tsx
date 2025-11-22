import { getStoryblokApi, storyblokInit, apiPlugin } from '@storyblok/react/rsc';
import StoryblokRenderer from '@/components/Storyblok/StoryblokRenderer';

type PageProps = {
  params: { slug?: string[] };
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  console.log('resolvedParams:', resolvedParams);
  // Ensure storyblokInit is called for this request in case module init didn't run.
  try {
    storyblokInit({
      accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
      use: [apiPlugin],
    });
    console.log('storyblokInit called in Page');
  } catch (e) {
    console.error('storyblokInit failed in Page', e);
  }
  const slug = resolvedParams?.slug ? resolvedParams.slug.join('/') : 'home';
  const storyblokApi = getStoryblokApi();
  const { data } = await storyblokApi.get(`cdn/stories/${slug}`, { version: 'draft' });
  const story = data?.story;

  if (!story) return <h1>Not found</h1>;
  if (!story.content) return <h1>No content</h1>;

  return (
    <>
      {story.content.body?.map((blok: any) => (
        <StoryblokRenderer blok={blok} key={blok._uid} /> //Render each blok in the body
      ))}
    </>
  );
}
