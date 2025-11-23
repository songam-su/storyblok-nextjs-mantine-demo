'use client';

import { storyblokInit, apiPlugin } from '@storyblok/react';
import { ReactNode } from 'react';
import { lazyRegistry } from '@/lib/storyblok/component-registry/lazy-registry';
import { components } from '@/lib/storyblok/component-registry/component-map';

// Initialize Storyblok for client-side rendering
storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN,
  use: [apiPlugin],
  bridge: true,
  components: lazyRegistry.components,
});

export default function StoryblokClientRenderer({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
