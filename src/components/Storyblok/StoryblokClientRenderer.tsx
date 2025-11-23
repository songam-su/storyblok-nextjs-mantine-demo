'use client';

import { storyblokInit, apiPlugin } from '@storyblok/react';
import SbBanner from '@/components/Storyblok/SbBanner/SbBanner';
import SbButton from '@/components/Storyblok/SbButton/SbButton';
import { ReactNode } from 'react';

// Initialize Storyblok for client-side rendering
storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN,
  use: [apiPlugin],
  components: {
    banner: SbBanner,
    button: SbButton,
  },
});

export default function StoryblokClientRenderer({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
