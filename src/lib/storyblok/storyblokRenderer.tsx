'use client';

import { useStoryblokBridge } from './hooks/use-storyblok-bridge';
import { StoryblokComponentRenderer } from './rendering/storyblok-component-renderer';
import type { ISbStoryData, StoryblokBridgeConfigV2 } from '@storyblok/react';

interface StoryblokRendererProps {
  story: ISbStoryData;
  isPreview?: boolean;
  bridgeOptions?: StoryblokBridgeConfigV2;
}

const StoryblokRenderer: React.FC<StoryblokRendererProps> = (props) => {
  const { story, isPreview, bridgeOptions = {} } = props;

  // Only enable the bridge in preview mode
  const liveStory = isPreview ? useStoryblokBridge(story, bridgeOptions) : story;

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
};

export default StoryblokRenderer;
