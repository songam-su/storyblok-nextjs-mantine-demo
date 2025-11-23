'use client';

import { renderStoryblokComponent } from '@/lib/storyblok/component-registry/renderStoryblokComponent';
import { useStoryblokBridge } from '@/lib/storyblok/hooks/use-storyblok-bridge';
import React from 'react';

export default function StoryblokRenderer({ story }: { story: any }) {
  console.log('Initial story:', story);

  const liveStory = useStoryblokBridge(story, {
    resolveRelations: undefined, // ['featured-articles.articles'],
    language: 'en',
    version: 'draft',
    onBridgeEvent: (event) => console.log('Bridge event:', event),
  });

  console.log('Live story after Bridge:', liveStory);

  if (!liveStory?.content?.body) {
    return <p>No content available</p>;
  }

  return <>{liveStory.content.body.map((blok: any) => renderStoryblokComponent(blok))}</>;
}
