'use client';

import React, { useEffect, useState } from 'react';
import { StoryblokComponent } from '@storyblok/react';

export default function StoryblokRenderer({ blok }: { blok: any }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    // Dynamically import the client init so it only runs in the browser
    import('@/lib/storyblok/storyblok.client-side')
      .then(() => {
        if (mounted) setReady(true);
      })
      .catch((err) => {
        console.error('Failed to load storyblok.client', err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) return null;

  return <StoryblokComponent blok={blok} />;
}
