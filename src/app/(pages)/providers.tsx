'use client';

import { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@/styles/globals.scss';
import theme from '@/lib/mantine/theme';
import { StoryblokEditorProvider } from '@/lib/storyblok/context/StoryblokEditorContext';

interface PreviewProvidersProps {
  children: ReactNode;
}

export default function PublishedProviders({ children }: PreviewProvidersProps) {
  return (
    <StoryblokEditorProvider>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        {children}
      </MantineProvider>
    </StoryblokEditorProvider>
  );
}
