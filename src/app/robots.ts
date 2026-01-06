import type { MetadataRoute } from 'next';

// Option A: keep the demo publicly accessible, but prevent indexing.
// - robots.txt blocks crawl access to preview + API routes
// - noindex is enforced via metadata + X-Robots-Tag headers
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/sb-preview/', '/api/'],
      },
    ],
  };
}
