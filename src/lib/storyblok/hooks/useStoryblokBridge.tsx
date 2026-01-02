'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ISbStoryData } from '@storyblok/react';
import type { StoryblokBridgeConfigV2 } from '@storyblok/react';

export interface UseStoryblokBridgeProps {
  initialStory: ISbStoryData;
  options?: StoryblokBridgeConfigV2;
}

const DEFAULT_RESOLVE_RELATIONS = [
  'featured-articles-section.articles',
  'banner-reference.banners',
  'article-page.call_to_action',
  'article-page.categories',
  'testimonials-section.testimonials',
];

const DEFAULT_RESOLVE_LINKS: StoryblokBridgeConfigV2['resolveLinks'] = 'story';

export const useStoryblokBridge = (props: UseStoryblokBridgeProps): ISbStoryData => {
  const { initialStory, options = {} } = props;

  // Ensure the bridge resolves relations/links just like the initial fetch
  const bridgeOptions = useMemo<StoryblokBridgeConfigV2>(() => {
    return {
      resolveRelations: DEFAULT_RESOLVE_RELATIONS,
      resolveLinks: DEFAULT_RESOLVE_LINKS,
      ...options,
    };
  }, [options]);

  const [story, setStory] = useState<ISbStoryData>(initialStory);

  useEffect(() => {
    let sbBridge: any = null;
    let handler: ((event: any) => void) | null = null;

    // Load the bridge script if not present
    if (typeof window !== 'undefined' && !window.StoryblokBridge) {
      const script = document.createElement('script');
      script.src = 'https://app.storyblok.com/f/storyblok-v2-latest.js';
      script.async = true;
      script.onload = initBridge;
      document.body.appendChild(script);
      return;
    }

    function initBridge() {
      if (!window.StoryblokBridge) return;
      sbBridge = new window.StoryblokBridge(bridgeOptions);
      handler = (event: any) => {
        if (event?.story) setStory(event.story);
      };
      sbBridge.on(['input', 'published', 'change'], handler);
    }

    if (typeof window !== 'undefined' && window.StoryblokBridge) {
      initBridge();
    }

    return () => {
      if (sbBridge && handler) {
        // StoryblokBridgeV2 does not provide an off() or removeListener method,
        // so we cannot remove the handler directly. If Storyblok adds this in the future, add it here.
        // For now, this is a no-op.
      }
    };
  }, [bridgeOptions]);

  return story;
};
