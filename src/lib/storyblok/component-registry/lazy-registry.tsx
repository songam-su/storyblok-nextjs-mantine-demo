import React from 'react';
import { registry } from './component-registry';

export const lazyRegistry = {
  components: Object.fromEntries(Object.entries(registry).map(([key, loader]) => [key, React.lazy(loader)])) as Record<
    string,
    React.LazyExoticComponent<React.FC<any>>
  >,

  preload: async (key: string) => {
    const loader = registry[key];
    if (!loader) {
      console.warn(`[Preload] No loader found for: ${key}`);
      return;
    }
    try {
      await loader();
      // Logging to verify preload
      // console.log(`[Preload] Preloaded: ${key}`);
    } catch {
      console.warn(`[Preload] Failed to preload: ${key}`);
    }
  },
};
