'use client';

import { ReactNode } from 'react';
import '@mantine/core/styles.css';
import '@/styles/globals.scss';
import { StoryblokEditorProvider } from '@/lib/storyblok/context/StoryblokEditorContext';
import { SiteConfigProvider, SiteThemeProvider, type SiteConfigContent } from '@/lib/storyblok/context/SiteConfigContext';

interface PublishedProvidersProps {
  children: ReactNode;
  siteConfig?: SiteConfigContent;
}

export default function PublishedProviders({ children, siteConfig }: PublishedProvidersProps) {
  return (
    <StoryblokEditorProvider>
      <SiteConfigProvider initialConfig={siteConfig}>
        <SiteThemeProvider>{children}</SiteThemeProvider>
      </SiteConfigProvider>
    </StoryblokEditorProvider>
  );
}
