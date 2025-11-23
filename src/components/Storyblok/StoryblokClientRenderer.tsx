'use client';

import { storyblokComponents } from '@/lib/storyblok/component-registry/storyblok-components';
import { storyblokInit, apiPlugin } from '@storyblok/react';
import { ReactNode } from 'react';

storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN,
  use: [apiPlugin],
  bridge: true,
  components: storyblokComponents, // ✅ Static map
});

export default function StoryblokClientRenderer({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
