import NotFoundPage from '@/components/chrome/NotFoundPage/NotFoundPage';
import { fetchStory } from '@/lib/storyblok/api/client';
import StoryblokRenderer from '@/lib/storyblok/rendering/StoryblokRenderer';

export default async function CmsNotFoundPage() {
  const story = await fetchStory('error-404', 'published');

  if (!story) {
    return <NotFoundPage />;
  }

  return <StoryblokRenderer story={story} isPreview={false} />;
}
