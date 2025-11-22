'use client';

import { StoryblokComponent } from '@storyblok/react';

export default function StoryblokRenderer({ body }: { body: any[] }) {
  console.log('Body:', body);
  return (
    <>
      {body?.map((blok) => (
        <StoryblokComponent blok={blok} key={blok._uid} />
      ))}
    </>
  );
}
