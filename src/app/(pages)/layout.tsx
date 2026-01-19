import AppLoadingOverlay from '@/components/chrome/AppLoadingOverlay/AppLoadingOverlay';
import Footer from '@/components/chrome/Footer/Footer';
import Header from '@/components/chrome/Header/Header';
import { METADATA_BASE } from '@/lib/site/siteUrl';
import { fetchStory } from '@/lib/storyblok/api/client';
import type { SiteConfigContent } from '@/lib/storyblok/context/SiteConfigContext';
import { ColorSchemeScript } from '@mantine/core';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import ScrollToTop from '../ScrollToTop';
import PublishedProviders from './providers';

export function generateMetadata(): Metadata {
  const nodeEnv = process.env.NODE_ENV;
  const vercelEnv = process.env.VERCEL_ENV;

  const deployEnv = process.env.DEPLOY_ENV ?? process.env.NEXT_PUBLIC_DEPLOY_ENV ?? vercelEnv;

  const isNonProductionDeploy = nodeEnv !== 'production' || (deployEnv && deployEnv !== 'production');

  return {
    metadataBase: METADATA_BASE,
    icons: {
      icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/favicon.ico' }],
    },
    // In production we want indexing; for preview/dev deployments we keep it noindex.
    robots: isNonProductionDeploy
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
        },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteConfigStory = await fetchStory('site-config', 'published');
  const siteConfig = siteConfigStory?.content as SiteConfigContent | undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" localStorageKey="site-color-scheme" />
      </head>
      <body className="app-body">
        <PublishedProviders siteConfig={siteConfig}>
          <AppLoadingOverlay />
          <div className="page-shell">
            <div className="page-shell__content">
              <ScrollToTop />
              <Header />
              <main>{children}</main>
              <Footer />
              <SpeedInsights />
              <Analytics />
            </div>
          </div>
        </PublishedProviders>
      </body>
    </html>
  );
}
