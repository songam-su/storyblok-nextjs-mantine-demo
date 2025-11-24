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
  const { story: initialStory, isPreview, bridgeOptions: options = {} } = props;

  // Only enable the bridge in preview mode
  const liveStory = isPreview ? useStoryblokBridge({ initialStory, options }) : initialStory;

  if (!liveStory?.content?.body) {
    return null;
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
