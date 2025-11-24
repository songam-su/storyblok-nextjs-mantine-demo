'use client';

import { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@/styles/globals.scss';
import theme from '@/lib/mantine/theme';
import StoryblokClientRenderer from '@/lib/storyblok/rendering/StoryblokClientRenderer';
import { StoryblokEditorProvider } from '@/lib/storyblok/context/StoryblokEditorContext';

interface PreviewProvidersProps {
  children: ReactNode;
}

export default function PreviewProviders({ children }: PreviewProvidersProps) {
  return (
    <StoryblokEditorProvider initialIsEditor>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <StoryblokClientRenderer>{children}</StoryblokClientRenderer>
      </MantineProvider>
    </StoryblokEditorProvider>
  );
}
