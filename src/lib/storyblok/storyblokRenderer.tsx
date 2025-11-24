'use client';

import { StoryblokComponentRenderer } from './rendering/storyblok-component-renderer';
import { useStoryblokBridge } from './hooks/use-storyblok-bridge';

export default function StoryblokRenderer({ story }: { story: any }) {
  const isPreview = typeof window !== 'undefined' && !!window.StoryblokBridge;

  // ✅ Use bridge only in preview mode
  const liveStory = isPreview
    ? useStoryblokBridge(story, {
        resolveRelations: undefined,
        language: 'en',
        version: 'draft',
        onBridgeEvent: undefined,
      })
    : story;

  if (!liveStory?.content?.body) {
    return <p>No content available</p>;
  }

  return (
    <>
      {liveStory.content.body.map((blok: any) => (
        <StoryblokComponentRenderer blok={blok} key={blok._uid} isPreview={isPreview} />
      ))}
    </>
  );
}
