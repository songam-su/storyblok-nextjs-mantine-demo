import React from 'react';
import { registry } from './loaders';

export const lazyRegistry = {
  components: Object.fromEntries(
    Object.entries(registry).map(([key, loader]) => [key, React.lazy(loader as any)])
  ) as Record<string, React.LazyExoticComponent<React.FC<any>>>,

  preload: async (key: string) => {
    const loader = registry[key as keyof typeof registry];
    if (!loader) {
      console.warn(`[Preload] No loader found for: ${key}`);
      return;
    }
    try {
      await loader();
    } catch {
      console.warn(`[Preload] Failed to preload: ${key}`);
    }
  },
};
