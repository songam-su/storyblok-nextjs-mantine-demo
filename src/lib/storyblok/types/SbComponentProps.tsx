import { storyblokEditable } from '@storyblok/react';

export type SbComponentProps<T> = {
  blok: T;
  storyblokEditable?: ReturnType<typeof storyblokEditable>;

  _uid: string;
  component: string;
  [key: string]: any; // fallback for dynamic fields
};

export interface StoryblokComponentBase {
  _uid: string;
  component: string;
  [key: string]: any; // fallback for dynamic fields
}

export interface PageBlok extends StoryblokComponentBase {
  body?: StoryblokComponentBase[];
}
