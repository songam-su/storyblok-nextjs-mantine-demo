'use client';

import { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@/styles/globals.scss';
import theme from '@/lib/mantine/theme';
import StoryblokClientRenderer from '@/lib/storyblok/storyblok-client-renderer';

interface PreviewProvidersProps {
  children: ReactNode;
}

export default function PreviewProviders({ children }: PreviewProvidersProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <StoryblokClientRenderer>{children}</StoryblokClientRenderer>
    </MantineProvider>
  );
}
