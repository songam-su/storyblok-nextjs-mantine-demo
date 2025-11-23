'use client';

// import React, { Suspense } from 'react';
import { lazyRegistry } from '../registry/lazy-registry';
// import { ErrorBoundary } from './ErrorBoundary';

export function StoryblokComponentRenderer(blok: any) {
  if (!blok?.component) return null;

  const key = blok.component as keyof typeof lazyRegistry.components;
  const Component = lazyRegistry.components[key];

  if (!Component) {
    console.warn(`[Render] No component found for: ${key}`);
    return null;
  }

  lazyRegistry.preload('banner');

  // ✅ Preload for better UX
  lazyRegistry.preload(key);

  // ✅ Analytics tracking
  console.log(`[Analytics] Rendering component: ${key}`);

  return (
    // <ErrorBoundary>
    // <Suspense fallback={<div>Loading {key}...</div>}>
    <Component blok={blok} key={blok._uid} />
    // </Suspense>
    // </ErrorBoundary>
  );
}
