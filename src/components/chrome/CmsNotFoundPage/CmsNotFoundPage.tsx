import NotFoundPage from '@/components/chrome/NotFoundPage/NotFoundPage';
import { fetchCmsNotFoundStory } from '@/lib/site/cmsNotFound';
import StoryblokRenderer from '@/lib/storyblok/rendering/StoryblokRenderer';

export default async function CmsNotFoundPage() {
  const story = await fetchCmsNotFoundStory('published');

  if (!story) {
    return <NotFoundPage />;
  }

  return <StoryblokRenderer story={story} isPreview={false} />;
}
