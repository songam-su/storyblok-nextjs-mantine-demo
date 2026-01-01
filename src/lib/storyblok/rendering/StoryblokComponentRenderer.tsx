'use client';

import { Suspense } from 'react';
import { lazyRegistry } from '../registry/lazy';
import { Loader } from '@mantine/core';
import { ErrorBoundary } from './ErrorBoundary';
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

  return (
    <ErrorBoundary>
      <Suspense fallback={spinner}>
        {isPreview ? (
          <div data-blok-c={blok._editable} data-blok-uid={blok._uid} style={{ display: 'contents' }}>
            <Component blok={blok} />
          </div>
        ) : (
          <Component blok={blok} />
        )}
      </Suspense>
    </ErrorBoundary>
  );
}
