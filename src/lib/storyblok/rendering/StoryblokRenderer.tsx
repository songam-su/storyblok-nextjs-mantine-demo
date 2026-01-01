'use client';

import { useStoryblokBridge } from '../hooks/useStoryblokBridge';
import { StoryblokComponentRenderer } from './StoryblokComponentRenderer';
import { lazyRegistry } from '../registry/lazy';
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

  const rootBlok = liveStory?.content as StoryblokBlok | undefined;

  if (!rootBlok?.component) {
    return null;
  }

  // Preload a small set of likely-used components up front (root + first few body items)
  const preloadKeys = new Set<string>();
  preloadKeys.add(rootBlok.component);

  const body = (rootBlok as any)?.body;
  if (Array.isArray(body)) {
    body.slice(0, 3).forEach((child) => {
      if (child?.component) preloadKeys.add(child.component as string);
    });
  }

  preloadKeys.forEach((key) => lazyRegistry.preload(key));

  const key = rootBlok._uid ?? rootBlok.component;

  return <StoryblokComponentRenderer blok={rootBlok} key={key} isPreview={isPreview} />;
};

export default StoryblokRenderer;
