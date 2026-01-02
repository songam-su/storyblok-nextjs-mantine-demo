import parse from 'html-react-parser';
import type { ReactNode } from 'react';
import type { StoryblokRichtext } from '@/lib/storyblok/resources/types/storyblok';
import { renderRichTextWithResolvers } from './resolvers';

export const renderSbRichText = (richtext?: StoryblokRichtext): ReactNode => {
  if (!richtext) return null;

  const rendered = renderRichTextWithResolvers(richtext);
  if (!rendered) return null;

  if (typeof rendered === 'string') {
    return <div className="sb-richtext">{parse(rendered)}</div>;
  }

  return <div className="sb-richtext">{rendered}</div>;
};
