import { renderRichText } from '@storyblok/react';
import parse, { type HTMLReactParserOptions, type Element } from 'html-react-parser';
import type { ReactNode } from 'react';
import type { StoryblokRichtext } from '@/lib/storyblok/resources/types/storyblok';

export const renderSbRichText = (richtext?: StoryblokRichtext): ReactNode => {
  if (!richtext) return null;

  const html = renderRichText(richtext);
  if (!html) return null;

  const options: HTMLReactParserOptions = {
    replace: (node) => {
      if (node.type === 'tag') {
        const el = node as Element;
        const styleAttr = el.attribs?.style;
        if (styleAttr) {
          // Strip inline color declarations to allow theme colors to apply
          const cleaned = styleAttr.replace(/color:\s*[^;]+;?/gi, '').trim().replace(/^;|;$/g, '');
          if (cleaned) {
            el.attribs.style = cleaned;
          } else {
            delete el.attribs.style;
          }
        }
      }
      return undefined;
    },
  };

  return <div className="sb-richtext">{parse(html, options)}</div>;
};
