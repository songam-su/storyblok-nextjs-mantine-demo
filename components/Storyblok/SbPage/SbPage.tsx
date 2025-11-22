import { StoryblokComponent } from '@storyblok/react';
import { PageBlok } from '../../../src/lib/storyblok/types/SbComponentProps';

interface PageProps {
  blok: PageBlok;
}

export default function Page({ blok }: PageProps) {
  return (
    <div>
      {blok.body?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
}
