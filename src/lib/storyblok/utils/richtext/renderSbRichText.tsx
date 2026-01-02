import parse, { type HTMLReactParserOptions, type Element } from 'html-react-parser';
import type { ReactNode } from 'react';
import type { StoryblokRichtext } from '@/lib/storyblok/resources/types/storyblok';
import { renderRichTextWithResolvers } from './resolvers';

export const renderSbRichText = (richtext?: StoryblokRichtext): ReactNode => {
  if (!richtext) return null;

  const rendered = renderRichTextWithResolvers(richtext);
  if (!rendered) return null;

  if (typeof rendered !== 'string') {
    return <div className="sb-richtext">{rendered}</div>;
  }

  const options: HTMLReactParserOptions = {
    replace: (node) => {
      if (node.type === 'tag') {
        const el = node as Element;
        const styleAttr = el.attribs?.style;
        if (styleAttr) {
          const cleaned = styleAttr
            .replace(/color:\s*[^;]+;?/gi, '')
            .replace(/font-size:\s*[^;]+;?/gi, '')
            .replace(/font-weight:\s*[^;]+;?/gi, '')
            .replace(/font-family:\s*[^;]+;?/gi, '')
            .trim()
            .replace(/^;|;$/g, '');
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

  return <div className="sb-richtext">{parse(rendered, options)}</div>;
};
