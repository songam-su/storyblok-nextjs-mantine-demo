import { SITE_URL } from '@/lib/site/siteUrl';
import type { MetadataRoute } from 'next';

// Demo subdomain: allow crawling but prevent indexing.
// - robots.txt only blocks preview + API routes
// - noindex is enforced via metadata + X-Robots-Tag headers
export default function robots(): MetadataRoute.Robots {
  return {
    sitemap: `${SITE_URL}/sitemap.xml`,
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/sb-preview/', '/api/'],
      },
    ],
  };
}
