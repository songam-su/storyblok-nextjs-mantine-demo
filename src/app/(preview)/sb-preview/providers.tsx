'use client';

import { ReactNode } from 'react';
import '@mantine/core/styles.css';
import '@/styles/globals.scss';
import { StoryblokEditorProvider } from '@/lib/storyblok/context/StoryblokEditorContext';
import { SiteConfigProvider, SiteThemeProvider } from '@/lib/storyblok/context/SiteConfigContext';

interface PreviewProvidersProps {
  children: ReactNode;
}

export default function PreviewProviders({ children }: PreviewProvidersProps) {
  return (
    <StoryblokEditorProvider>
      <SiteConfigProvider>
        <SiteThemeProvider>{children}</SiteThemeProvider>
      </SiteConfigProvider>
    </StoryblokEditorProvider>
  );
}
