'use client';

import { FC, useEffect } from 'react';
import { storyblokInit, apiPlugin } from '@storyblok/react';
import { registry } from '../registry/component-registry';

const Placeholder: FC<any> = () => null;

export function StoryblokComponentsInitializer() {
  useEffect(() => {
    async function init() {
      const entries = await Promise.all(
        Object.entries(registry).map(async ([key, loader]) => {
          try {
            const mod = await loader();
            return [key, mod.default];
          } catch {
            return [key, Placeholder];
          }
        })
      );

      const staticMap = Object.fromEntries(entries);

      storyblokInit({
        accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN,
        use: [apiPlugin],
        bridge: true,
        components: staticMap,
      });
    }

    init();
  }, []);

  return null; // No UI needed
}
