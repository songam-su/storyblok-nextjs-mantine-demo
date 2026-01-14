'use client';

import { storyblokEditable } from '@storyblok/react';
import { Suspense } from 'react';
import { lazyRegistry } from '../registry/lazy';
import type { StoryblokBlok } from '../registry/StoryblokBlok';
import { ErrorBoundary } from './ErrorBoundary';

interface StoryblokComponentRendererProps {
  blok: StoryblokBlok;
  isPreview?: boolean;
}

export function StoryblokComponentRenderer({ blok, isPreview }: StoryblokComponentRendererProps) {
  if (!blok?.component) return null;

  const key = blok.component as keyof typeof lazyRegistry.components;
  const Component = lazyRegistry.components[key];

  if (!Component) {
    console.warn(`[Render] No component found for: ${key}`);
    return null;
  }

  const editableAttributes = isPreview && blok?._editable ? storyblokEditable(blok as any) : undefined;

  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        {isPreview ? (
          <div {...editableAttributes} style={{ display: 'contents' }} suppressHydrationWarning>
            <Component blok={blok} />
          </div>
        ) : (
          <Component blok={blok} />
        )}
      </Suspense>
    </ErrorBoundary>
  );
}
