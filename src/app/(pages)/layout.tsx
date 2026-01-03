import PublishedProviders from './providers';
import Header from '@/components/SiteChrome/Header/Header';
import Footer from '@/components/SiteChrome/Footer/Footer';
import { fetchStory } from '@/lib/storyblok/api/client';
import type { SiteConfigContent } from '@/lib/storyblok/context/SiteConfigContext';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteConfigStory = await fetchStory('site-config', 'published');
  const siteConfig = siteConfigStory?.content as SiteConfigContent | undefined;

  return (
    <html lang="en">
      <body className="app-body">
        <PublishedProviders siteConfig={siteConfig}>
          <div className="page-shell">
            <div className="page-shell__content">
              <Header />
              <main>{children}</main>
              <Footer />
            </div>
          </div>
        </PublishedProviders>
      </body>
    </html>
  );
}
