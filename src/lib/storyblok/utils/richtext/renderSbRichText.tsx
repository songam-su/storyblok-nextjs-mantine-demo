import { renderRichText } from '@storyblok/react';
import parse from 'html-react-parser';
import type { ReactNode } from 'react';
import type { StoryblokRichtext } from '@/lib/storyblok/resources/types/storyblok';

export const renderSbRichText = (richtext?: StoryblokRichtext): ReactNode => {
  if (!richtext) return null;

  const html = renderRichText(richtext);
  if (!html) return null;

  return parse(html);
};
