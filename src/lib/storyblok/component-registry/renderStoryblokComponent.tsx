// 'use client';

// import type { StoryblokBlok } from '@/lib/storyblok/component-registry/generated-union'; // /generated-union-types';
// import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
// import { lazyRegistry } from './lazy-registry';

// /**
//  * Type-safe rendering helper for Storyblok components.
//  * Uses lazyRegistry for dynamic loading and placeholder fallback.
//  */
// type ComponentName = keyof typeof lazyRegistry.components;

// export function renderStoryblokComponent<K extends ComponentName>(
//   blok: SbComponentProps<Extract<StoryblokBlok, { component: K }>> & { component: K }
// ) {
//   const Component = lazyRegistry.components[blok.component];

//   if (!Component) {
//     return <div style={{ opacity: 0.6 }}>Unknown component: {blok.component}</div>;
//   }

//   return <Component {...blok} key={blok._uid} />;
// }

'use client';

import type { StoryblokBlok } from '@/lib/storyblok/component-registry/generated-union'; // /generated-union-types';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { lazyRegistry } from './lazy-registry';

type ComponentName = keyof typeof lazyRegistry.components;

export function renderStoryblokComponent<K extends ComponentName>(
  blok: SbComponentProps<Extract<StoryblokBlok, { component: K }>> & { component: K }
) {
  const Component = lazyRegistry.components[blok.component];
  return Component ? <Component {...blok} key={blok._uid} /> : null;
}
