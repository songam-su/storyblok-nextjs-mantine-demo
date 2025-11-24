'use client';

import { ReactNode } from 'react';
import { StoryblokComponentsInitializer } from './StoryblokComponentInitializer';

export default function StoryblokClientRenderer({ children }: { children: ReactNode }) {
  return (
    <>
      <StoryblokComponentsInitializer />
      {children}
    </>
  );
}
