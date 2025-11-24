'use client';

import { ReactNode } from 'react';
import { StoryblokComponentsInitializer } from './rendering/storyblok-component-initializer';

export default function StoryblokClientRenderer({ children }: { children: ReactNode }) {
  return (
    <>
      <StoryblokComponentsInitializer />
      {children}
    </>
  );
}
