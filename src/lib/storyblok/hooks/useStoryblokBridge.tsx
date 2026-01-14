'use client';

import type { ISbStoryData, StoryblokBridgeConfigV2 } from '@storyblok/react';
import { useEffect, useMemo, useState } from 'react';

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
const BRIDGE_LOADER_PROMISE_KEY = '__sbBridgeLoaderPromise';
const BRIDGE_SCRIPT_ID = 'storyblok-bridge-v2-script';

function getBridgeHandlerRegistry(): Set<string> | null {
  if (typeof window === 'undefined') return null;
  const win = window as typeof window & { [BRIDGE_HANDLER_REGISTRY_KEY]?: Set<string> };
  if (!win[BRIDGE_HANDLER_REGISTRY_KEY]) {
    win[BRIDGE_HANDLER_REGISTRY_KEY] = new Set<string>();
  }
  return win[BRIDGE_HANDLER_REGISTRY_KEY] as Set<string>;
}

function loadStoryblokBridgeScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if ((window as any).StoryblokBridge) return Promise.resolve();

  const win = window as typeof window & {
    [BRIDGE_LOADER_PROMISE_KEY]?: Promise<void>;
  };

  if (win[BRIDGE_LOADER_PROMISE_KEY]) return win[BRIDGE_LOADER_PROMISE_KEY]!;

  win[BRIDGE_LOADER_PROMISE_KEY] = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(BRIDGE_SCRIPT_ID) as HTMLScriptElement | null;

    const done = () => resolve();
    const fail = () => reject(new Error('Failed to load Storyblok Bridge script'));

    if (existing) {
      if ((window as any).StoryblokBridge) {
        done();
        return;
      }

      existing.addEventListener('load', done, { once: true });
      existing.addEventListener('error', fail, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = BRIDGE_SCRIPT_ID;
    script.src = 'https://app.storyblok.com/f/storyblok-v2-latest.js';
    script.async = true;
    script.addEventListener('load', done, { once: true });
    script.addEventListener('error', fail, { once: true });

    // Use <head> to reduce timing issues with body insertion in iframes.
    document.head.appendChild(script);
  });

  return win[BRIDGE_LOADER_PROMISE_KEY]!;
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

    let cancelled = false;

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

    loadStoryblokBridgeScript()
      .then(() => {
        if (cancelled) return;
        initBridge();
      })
      .catch(() => {
        // If the bridge fails to load, preview still renders using the initial draft fetch.
      });

    return () => {
      cancelled = true;
      if (sbBridge && handler) {
        // StoryblokBridgeV2 does not provide an off() or removeListener method,
        // so we cannot remove the handler directly. If Storyblok adds this in the future, add it here.
        // For now, this is a no-op. Keep the registry entry to avoid double-registration during HMR.
      }
    };
  }, [bridgeOptions, handlerKey]);

  return story;
};
