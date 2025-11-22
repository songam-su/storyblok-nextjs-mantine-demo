import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';

// Initialize Storyblok for RSC usage. Do not import client-only components here
// because this file runs in a server context. Keep `components` minimal or
// empty for server initialization to avoid importing client-only React code.
storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
  components: {},
});

//used by page.tsx
