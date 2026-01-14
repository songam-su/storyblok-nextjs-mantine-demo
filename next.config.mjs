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
    return [
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
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ];
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
