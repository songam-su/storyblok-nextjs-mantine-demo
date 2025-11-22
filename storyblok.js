import { apiPlugin, storyblokInit } from '@storyblok/react';
import SbButton from './components/Storyblok/SbBanner/SbBanner';
import SbPage from './components/Storyblok/SbPage/SbPage';

storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN, // from Storyblok space settings
  use: [apiPlugin],
  components: {
    button: SbButton, // maps the Storyblok component name to your React component
    banner: SbBanner,
    page: SbPage,
  },
});
