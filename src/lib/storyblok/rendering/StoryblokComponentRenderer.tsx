'use client';

import { Suspense } from 'react';
import { lazyRegistry } from '../registry/lazy';
import { Loader } from '@mantine/core';
import { ErrorBoundary } from './ErrorBoundary';
import { storyblokEditable } from '@storyblok/react';
import type { StoryblokBlok } from '../registry/StoryblokBlok';

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

  const spinner = <Loader size="lg" type="dots" />;
  const editableAttributes = isPreview && blok?._editable ? storyblokEditable(blok as any) : undefined;

  return (
    <ErrorBoundary>
      <Suspense fallback={spinner}>
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
