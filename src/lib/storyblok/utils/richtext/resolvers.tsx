import React, { Fragment, JSX } from 'react';
import { renderRichText } from '@storyblok/react';
import type { StoryblokRichtext } from '@/lib/storyblok/resources/types/storyblok';

type MarkRenderer = (children: React.ReactNode, props?: any) => React.ReactNode;

const stripStyleProps = (props: any = {}) => {
  const { style, styles, class: _class, className: _className, ...rest } = props;
  return rest; // drop inline styles/classes
};

const sanitizeLinkProps = (props: any = {}) => {
  const { href, target, rel, title } = props;
  return { href, target, rel, title } as const;
};

// Theme-friendly elements without inline styles
const TextMark: MarkRenderer = (children) => <Fragment>{children}</Fragment>;
const BoldMark: MarkRenderer = (children) => <strong>{children}</strong>;
const ItalicMark: MarkRenderer = (children) => <em>{children}</em>;
const LinkComponent: MarkRenderer = (children, props) => (
  <a {...sanitizeLinkProps(stripStyleProps(props))}>{children}</a>
);

const Paragraph = ({ children }: { children: React.ReactNode }) => <p className="sb-rt-paragraph">{children}</p>;
const Heading = ({ level, children }: { level: number; children: React.ReactNode }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag className={`sb-rt-heading sb-rt-heading-${level}`}>{children}</Tag>;
};

type RichtextInput = StoryblokRichtext | undefined;

export const richTextResolvers = {
  markResolvers: {
    bold: BoldMark,
    strong: BoldMark,
    italic: ItalicMark,
    em: ItalicMark,
    styled: (children: React.ReactNode) => TextMark(children), // Storyblok "styled" mark
    'text-style': (children: React.ReactNode) => TextMark(children), // alternative key if emitted
    textStyle: (children: React.ReactNode) => TextMark(children), // additional safety key
    style: (children: React.ReactNode) => TextMark(children), // defensive
    link: LinkComponent,
  },
  nodeResolvers: {
    paragraph: (children: any) => <Paragraph>{children}</Paragraph>,
    heading: (children: any, { level }: { level: number }) => <Heading level={level}>{children}</Heading>,
  },
};

export function renderRichTextWithResolvers(richtext?: RichtextInput) {
  if (!richtext) return null;
  const rendered = renderRichText(richtext as any, richTextResolvers as any);
  if (typeof rendered === 'string') return stripInlineStylesFromString(rendered);
  return stripInlineStyles(rendered);
}

// Recursively strip inline style props from React nodes returned by renderRichText
function stripInlineStyles(node: React.ReactNode): React.ReactNode {
  if (Array.isArray(node)) return node.map(stripInlineStyles);
  if (!React.isValidElement(node)) return node;

  const props = node.props as any;
  const { style, ...rest } = props || {};
  const cleanedChildren = React.Children.map(props.children, stripInlineStyles);
  return React.cloneElement(node, rest, cleanedChildren);
}

// Strip inline style attributes from string output (fallback if renderRichText returns HTML)
function stripInlineStylesFromString(html: string): string {
  return html.replace(/style="[^"]*"/gi, '').replace(/style='[^']*'/gi, '');
}
