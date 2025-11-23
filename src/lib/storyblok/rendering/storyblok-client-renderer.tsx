'use client';

import { ReactNode } from 'react';
import { StoryblokComponentsInitializer } from './storyblok-component-initializer';

export default function StoryblokClientRenderer({ children }: { children: ReactNode }) {
  return (
    <>
      <StoryblokComponentsInitializer />
      {children}
    </>
  );
}
