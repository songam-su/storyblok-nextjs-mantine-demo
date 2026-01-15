import NotFoundPage from '@/components/chrome/NotFoundPage/NotFoundPage';
import { fetchStory } from '@/lib/storyblok/api/client';
import StoryblokRenderer from '@/lib/storyblok/rendering/StoryblokRenderer';

export default async function CmsPreviewNotFoundPage() {
  const story = await fetchStory('error-404', 'draft');

  if (!story) {
    return <NotFoundPage />;
  }

  return <StoryblokRenderer story={story} isPreview={true} />;
}
