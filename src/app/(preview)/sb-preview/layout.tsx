import Footer from '@/components/chrome/Footer/Footer';
import Header from '@/components/chrome/Header/Header';
import { METADATA_BASE } from '@/lib/site/siteUrl';
import { fetchStory } from '@/lib/storyblok/api/client';
import type { SiteConfigContent } from '@/lib/storyblok/context/SiteConfigContext';
import { ColorSchemeScript } from '@mantine/core';
import type { Metadata } from 'next';
import ScrollToTop from '../../ScrollToTop';
import PreviewProviders from './providers';

export const metadata: Metadata = {
  metadataBase: METADATA_BASE,
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/favicon.ico' }],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function PreviewLayout({ children }: { children: React.ReactNode }) {
  const siteConfigStory = await fetchStory('site-config', 'draft');
  const siteConfig = siteConfigStory?.content as SiteConfigContent | undefined;

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="light" localStorageKey="site-color-scheme" />
      </head>
      <body>
        <PreviewProviders siteConfig={siteConfig}>
          <div className="page-shell">
            <div className="page-shell__content">
              <ScrollToTop />
              <Header />
              <main>{children}</main>
              <Footer />
            </div>
          </div>
        </PreviewProviders>
      </body>
    </html>
  );
}
