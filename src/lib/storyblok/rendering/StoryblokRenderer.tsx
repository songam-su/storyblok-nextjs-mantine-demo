'use client';

import { useStoryblokBridge } from '../hooks/useStoryblokBridge';
import { StoryblokComponentRenderer } from './StoryblokComponentRenderer';
import type { ISbStoryData, StoryblokBridgeConfigV2 } from '@storyblok/react';
import type { StoryblokBlok } from '../registry/StoryblokBlok';

interface StoryblokRendererProps {
  story: ISbStoryData;
  isPreview?: boolean;
  bridgeOptions?: StoryblokBridgeConfigV2;
}

const StoryblokRenderer: React.FC<StoryblokRendererProps> = (props) => {
  const { story: initialStory, isPreview, bridgeOptions: options = {} } = props;

  // Only enable the bridge in preview mode
  const liveStory = isPreview ? useStoryblokBridge({ initialStory, options }) : initialStory;

  const body = (liveStory?.content?.body ?? []) as StoryblokBlok[];

  if (!body.length) {
    return null;
  }

  return (
    <>
      {body.map((blok) => (
        <StoryblokComponentRenderer blok={blok} key={blok._uid} isPreview={isPreview} />
      ))}
    </>
  );
};

export default StoryblokRenderer;
