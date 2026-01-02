import parse from 'html-react-parser';
import React, { isValidElement } from 'react';
import type { ReactNode } from 'react';
import type { StoryblokRichtext } from '@/lib/storyblok/resources/types/storyblok';
import { renderRichTextWithResolvers } from './resolvers';

// Recursively strip inline style props from React nodes
const stripInlineStyles = (node: ReactNode): ReactNode => {
  if (Array.isArray(node)) return node.map(stripInlineStyles);
  if (!isValidElement(node)) return node;

  const props = node.props as Record<string, any>;
  const { style, ...rest } = props || {};
  const cleanedChildren = React.Children.map(props.children, stripInlineStyles);
  return React.cloneElement(node, rest, cleanedChildren);
};

export const renderSbRichText = (richtext?: StoryblokRichtext): ReactNode => {
  if (!richtext) return null;

  const rendered = renderRichTextWithResolvers(richtext);
  if (!rendered) return null;

  if (typeof rendered === 'string') {
    const sanitized = rendered
      .replace(/style="[^"]*"/gi, '')
      .replace(/style='[^']*'/gi, '');
    return <div className="sb-richtext">{parse(sanitized)}</div>;
  }

  return <div className="sb-richtext">{stripInlineStyles(rendered)}</div>;
};
