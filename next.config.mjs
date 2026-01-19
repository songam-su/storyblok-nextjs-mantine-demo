/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Vanity: /home -> /
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/home/:path*',
        destination: '/:path*',
        permanent: true,
      },

      // Vanity: /index* -> /
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },

      // Trailing slash canonicalization (keep root '/').
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    // Storyblok Visual Editor appends `_storyblok` / `_storyblok_tk` query params.
    // Instead of Edge Middleware, use config-based rewrites so production builds
    // don’t depend on middleware trace artifacts.
    return {
      beforeFiles: [
        // Map / -> /sb-preview/home when opened inside the Visual Editor.
        {
          source: '/',
          has: [{ type: 'query', key: '_storyblok' }],
          destination: '/sb-preview/home',
        },
        {
          source: '/',
          has: [{ type: 'query', key: '_storyblok_tk' }],
          destination: '/sb-preview/home',
        },

        // Map /anything -> /sb-preview/anything in the Visual Editor.
        {
          source: '/:path((?!sb-preview|api|_next).*)',
          has: [{ type: 'query', key: '_storyblok' }],
          destination: '/sb-preview/:path',
        },
        {
          source: '/:path((?!sb-preview|api|_next).*)',
          has: [{ type: 'query', key: '_storyblok_tk' }],
          destination: '/sb-preview/:path',
        },
      ],
    };
  },
  async headers() {
    const nodeEnv = process.env.NODE_ENV;
    const vercelEnv = process.env.VERCEL_ENV;

    // Optional override for self-hosted environments (e.g. "staging").
    // If set and not "production", we treat the deploy as non-production.
    const deployEnv = process.env.DEPLOY_ENV ?? process.env.NEXT_PUBLIC_DEPLOY_ENV ?? vercelEnv;

    // Treat self-hosted production (NODE_ENV=production, no VERCEL_ENV) as production.
    // Only apply global noindex for known non-production environments.
    const isNonProductionDeploy = nodeEnv !== 'production' || (deployEnv && deployEnv !== 'production');

    const headers = [
      {
        source: '/.well-known/appspecific/com.chrome.devtools.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        // Never index preview content or API endpoints.
        source: '/sb-preview/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
          {
            // Ensure draft content and auth-gated pages are not cached by CDNs/browsers.
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        // Internal CMS-driven 404 route. In normal operation this is hit via an
        // Edge rewrite with a 404 status, but keep it noindex/no-store even when
        // accessed directly.
        source: '/error-404',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, follow, noarchive',
          },
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];

    // Best practice: prevent indexing for non-production deploys (Vercel preview/dev/local).
    if (isNonProductionDeploy) {
      headers.push({
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      });
    }

    return headers;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a.storyblok.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img2.storyblok.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
