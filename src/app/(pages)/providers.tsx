'use client';

import {
  SiteConfigProvider,
  SiteThemeProvider,
  type SiteConfigContent,
} from '@/lib/storyblok/context/SiteConfigContext';
import { StoryblokEditorProvider } from '@/lib/storyblok/context/StoryblokEditorContext';
import '@/styles/vendor.css';
import '@/styles/globals.scss';
import { ReactNode } from 'react';

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
