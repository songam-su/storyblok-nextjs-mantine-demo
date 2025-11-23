'use client';
import { useEffect, useState } from 'react';
import { StoryblokClient, apiPlugin } from '@storyblok/react';

declare global {
  interface Window {
    // @ts-ignore
    StoryblokBridge?: any;
  }
}

export interface BridgeOptions {
  resolveRelations?: string[];
  language?: string;
  version?: 'draft' | 'published';
  apiClient?: StoryblokClient;
  onBridgeEvent?: (event: any) => void;
  disableBridge?: boolean;
}

export interface StoryblokStory {
  id: number;
  name: string;
  slug: string;
  full_slug: string;
  content: {
    _uid: string;
    body?: any[];
    component: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export function useStoryblokBridge(initialStory: StoryblokStory, options?: BridgeOptions): StoryblokStory {
  const [story, setStory] = useState<StoryblokStory>(initialStory);

  useEffect(() => {
    const isPreview = typeof window !== 'undefined' && !!window.StoryblokBridge;
    if (!isPreview || options?.disableBridge) return;

    if (window.StoryblokBridge) {
      const sbBridge = new window.StoryblokBridge();
      const client = options?.apiClient || apiPlugin({ accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN });

      sbBridge.on(['input', 'published', 'change'], async (event: any) => {
        options?.onBridgeEvent?.(event);

        if (event.story) {
          if (options?.resolveRelations?.length) {
            const response = await client.get(`cdn/stories/${event.story.slug}`, {
              version: options.version || 'draft',
              resolve_relations: options.resolveRelations.join(','),
              language: options.language || 'default',
            });
            setStory(response.data.story);
          } else {
            setStory(event.story);
          }
        }
      });
    }
  }, [initialStory, options]);

  return story;
}
