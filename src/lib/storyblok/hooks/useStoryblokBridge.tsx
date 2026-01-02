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

const BRIDGE_HANDLER_REGISTRY_KEY = '__sbBridgeHandlerRegistry';

function getBridgeHandlerRegistry(): Set<string> | null {
  if (typeof window === 'undefined') return null;
  const win = window as typeof window & { [BRIDGE_HANDLER_REGISTRY_KEY]?: Set<string> };
  if (!win[BRIDGE_HANDLER_REGISTRY_KEY]) {
    win[BRIDGE_HANDLER_REGISTRY_KEY] = new Set<string>();
  }
  return win[BRIDGE_HANDLER_REGISTRY_KEY] as Set<string>;
}

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
  const handlerKey = useMemo(() => {
    return JSON.stringify({
      resolveRelations: bridgeOptions.resolveRelations ?? DEFAULT_RESOLVE_RELATIONS,
      resolveLinks: bridgeOptions.resolveLinks ?? DEFAULT_RESOLVE_LINKS,
      events: ['input', 'published', 'change'],
    });
  }, [bridgeOptions]);

  useEffect(() => {
    let sbBridge: any = null;
    let handler: ((event: any) => void) | null = null;
    const registry = getBridgeHandlerRegistry();

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
      if (registry?.has(handlerKey)) return; // prevent duplicate handlers during HMR/remounts

      sbBridge = new window.StoryblokBridge(bridgeOptions);
      handler = (event: any) => {
        if (event?.story) setStory(event.story);
      };
      sbBridge.on(['input', 'published', 'change'], handler);
      registry?.add(handlerKey);
    }

    if (typeof window !== 'undefined' && window.StoryblokBridge) {
      initBridge();
    }

    return () => {
      if (sbBridge && handler) {
        // StoryblokBridgeV2 does not provide an off() or removeListener method,
        // so we cannot remove the handler directly. If Storyblok adds this in the future, add it here.
        // For now, this is a no-op. Keep the registry entry to avoid double-registration during HMR.
      }
    };
  }, [bridgeOptions, handlerKey]);

  return story;
};
