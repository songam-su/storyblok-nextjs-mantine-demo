'use client';

import { useEffect, useState } from 'react';
import type { ISbStoryData } from '@storyblok/react';
import type { StoryblokBridgeConfigV2 } from '@storyblok/react';

export function useStoryblokBridge(initialStory: ISbStoryData, options: StoryblokBridgeConfigV2 = {}): ISbStoryData {
  const [story, setStory] = useState<ISbStoryData>(initialStory);

  useEffect(() => {
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
      const sbBridge = new window.StoryblokBridge(options);
      sbBridge.on(['input', 'published', 'change'], (event: any) => {
        if (event?.story) {
          setStory(event.story);
        }
      });
    }

    if (typeof window !== 'undefined' && window.StoryblokBridge) {
      initBridge();
    }
  }, [options]);

  return story;
}
