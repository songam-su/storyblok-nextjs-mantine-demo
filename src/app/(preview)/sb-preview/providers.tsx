'use client';

import {
  SiteConfigProvider,
  SiteThemeProvider,
  type SiteConfigContent,
} from '@/lib/storyblok/context/SiteConfigContext';
import { StoryblokEditorProvider } from '@/lib/storyblok/context/StoryblokEditorContext';
import '@/styles/globals.scss';
import '@/styles/vendor.css';
import { ReactNode } from 'react';
import DisableNavigationInVisualEditor from './DisableNavigationInVisualEditor';

interface PreviewProvidersProps {
  children: ReactNode;
  siteConfig?: SiteConfigContent;
}

export default function PreviewProviders({ children, siteConfig }: PreviewProvidersProps) {
  return (
    <StoryblokEditorProvider initialIsEditor={true}>
      <DisableNavigationInVisualEditor />
      <SiteConfigProvider initialConfig={siteConfig}>
        <SiteThemeProvider>{children}</SiteThemeProvider>
      </SiteConfigProvider>
    </StoryblokEditorProvider>
  );
}
