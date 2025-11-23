'use client';

import { StoryblokComponentRenderer } from './storyblok-component-renderer';
import { useStoryblokBridge } from '../hooks/use-storyblok-bridge';

export default function StoryblokRenderer({ story }: { story: any }) {
  console.log('Initial story:', story);

  const liveStory = useStoryblokBridge(story, {
    resolveRelations: undefined, // ['featured-articles.articles'],
    language: 'en',
    version: 'draft',
    onBridgeEvent: undefined, //(event) => console.log('Bridge event:', event),
  });

  console.log('Live story after Bridge:', liveStory);

  if (!liveStory?.content?.body) {
    return <p>No content available</p>;
  }

  return <>{liveStory.content.body.map((blok: any) => StoryblokComponentRenderer(blok))}</>;
}
