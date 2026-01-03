import PreviewProviders from './providers';
import Header from '@/components/SiteChrome/Header/Header';
import Footer from '@/components/SiteChrome/Footer/Footer';
import { fetchStory } from '@/lib/storyblok/api/client';
import type { SiteConfigContent } from '@/lib/storyblok/context/SiteConfigContext';

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
