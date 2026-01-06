import PreviewProviders from './providers';
import Header from '@/components/chrome/Header/Header';
import Footer from '@/components/chrome/Footer/Footer';
import { fetchStory } from '@/lib/storyblok/api/client';
import type { SiteConfigContent } from '@/lib/storyblok/context/SiteConfigContext';
import { METADATA_BASE } from '@/lib/site/siteUrl';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: METADATA_BASE,
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
      <body>
        <PreviewProviders siteConfig={siteConfig}>
          <div className="page-shell">
            <div className="page-shell__content">
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
