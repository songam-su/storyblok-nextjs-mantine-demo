// 'use client';

// import { lazyRegistry } from './lazy-registry';
// import React from 'react';

// export function renderStoryblokComponent(blok: any) {
//   if (!blok || !blok.component) return null;

//   const Component = lazyRegistry.components[blok.component as keyof typeof lazyRegistry.components] as React.FC<any>;

//   // Optional: preload for UX
//   lazyRegistry.preload(blok.component);

//   // Optional: analytics
//   console.log(`Rendering Storyblok component: ${blok.component}`);

//   return <Component blok={blok} key={blok._uid} />;
// }

'use client';

import React, { Suspense } from 'react';
import { lazyRegistry } from './component-registry/lazy-registry';
// import { ErrorBoundary } from './ErrorBoundary';

export function StoryblokComponentRenderer(blok: any) {
  if (!blok?.component) return null;

  const key = blok.component as keyof typeof lazyRegistry.components;
  const Component = lazyRegistry.components[key];

  if (!Component) {
    console.warn(`[Render] No component found for: ${key}`);
    return null;
  }

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
