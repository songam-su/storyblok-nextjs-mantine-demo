import { SITE_URL } from '@/lib/site/siteUrl';
import type { MetadataRoute } from 'next';

// Option A: keep the demo publicly accessible, but prevent indexing.
// - robots.txt blocks crawl access to preview + API routes
// - noindex is enforced via metadata + X-Robots-Tag headers
export default function robots(): MetadataRoute.Robots {
  const nodeEnv = process.env.NODE_ENV;
  const vercelEnv = process.env.VERCEL_ENV;
  const deployEnv = process.env.DEPLOY_ENV ?? process.env.NEXT_PUBLIC_DEPLOY_ENV ?? vercelEnv;

  const isNonProductionDeploy = nodeEnv !== 'production' || (deployEnv && deployEnv !== 'production');

  return {
    sitemap: `${SITE_URL}/sitemap.xml`,
    rules: [
      {
        userAgent: '*',
        ...(isNonProductionDeploy
          ? {
              disallow: ['/', '/sb-preview/', '/api/'],
            }
          : {
              allow: '/',
              disallow: ['/sb-preview/', '/api/'],
            }),
      },
    ],
  };
}
