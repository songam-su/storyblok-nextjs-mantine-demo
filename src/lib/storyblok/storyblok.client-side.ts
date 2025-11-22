import { apiPlugin, storyblokInit } from '@storyblok/react';
import SbBanner from '../../components/Storyblok/SbBanner/SbBanner';
import SbButton from '../../components/Storyblok/SbButton/SbButton';

// Client-side storyblok initialization: register client components for StoryblokComponent
storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
  components: {
    button: SbButton,
    banner: SbBanner,
  },
});
