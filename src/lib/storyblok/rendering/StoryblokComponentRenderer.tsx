'use client';

import { Suspense } from 'react';
import { lazyRegistry } from '../registry/lazy';
import { Loader } from '@mantine/core';
import { ErrorBoundary } from './ErrorBoundary';

export function StoryblokComponentRenderer({ blok, isPreview }: { blok: any; isPreview?: boolean }) {
  if (!blok?.component) return null;

  const key = blok.component as keyof typeof lazyRegistry.components;
  const Component = lazyRegistry.components[key];

  if (!Component) {
    console.warn(`[Render] No component found for: ${key}`);
    return null;
  }

  lazyRegistry.preload('banner');
  lazyRegistry.preload(key);

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
