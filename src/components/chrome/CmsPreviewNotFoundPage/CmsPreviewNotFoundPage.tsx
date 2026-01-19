import NotFoundPage from '@/components/chrome/NotFoundPage/NotFoundPage';
import { fetchCmsNotFoundStory } from '@/lib/site/cmsNotFound';
import StoryblokRenderer from '@/lib/storyblok/rendering/StoryblokRenderer';

export default async function CmsPreviewNotFoundPage() {
  const story = await fetchCmsNotFoundStory('draft');

  if (!story) {
    return <NotFoundPage />;
  }

  return <StoryblokRenderer story={story} isPreview={true} />;
}
