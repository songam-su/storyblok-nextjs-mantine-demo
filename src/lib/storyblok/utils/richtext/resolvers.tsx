import { JSX } from 'react';
import { renderRichText } from '@storyblok/react';
import type { ISbRichtext } from '@storyblok/react';
import type { StoryblokRichtext } from '@/lib/storyblok/resources/types/storyblok';

type MarkRenderer = (children: React.ReactNode, props?: any) => React.ReactNode;

const stripStyleProps = (props: any = {}) => {
  const { style, styles, class: _class, className: _className, ...rest } = props;
  return rest; // drop inline styles/classes
};

// Theme-friendly elements without inline styles
const TextMark: MarkRenderer = (children) => <span>{children}</span>;
const BoldMark: MarkRenderer = (children) => <strong>{children}</strong>;
const ItalicMark: MarkRenderer = (children) => <em>{children}</em>;
const LinkComponent: MarkRenderer = (children, props) => <a {...stripStyleProps(props)}>{children}</a>;

const Paragraph = ({ children }: { children: React.ReactNode }) => <p className="sb-rt-paragraph">{children}</p>;
const Heading = ({ level, children }: { level: number; children: React.ReactNode }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag className={`sb-rt-heading sb-rt-heading-${level}`}>{children}</Tag>;
};

export const richTextResolvers = {
  markResolvers: {
    bold: BoldMark,
    strong: BoldMark,
    italic: ItalicMark,
    em: ItalicMark,
    styled: (children: React.ReactNode) => TextMark(children), // Storyblok "styled" mark
    'text-style': (children: React.ReactNode) => TextMark(children), // alternative key if emitted
    link: LinkComponent,
  },
  nodeResolvers: {
    paragraph: (children: any) => <Paragraph>{children}</Paragraph>,
    heading: (children: any, { level }: { level: number }) => <Heading level={level}>{children}</Heading>,
  },
};

type RichtextInput = StoryblokRichtext | ISbRichtext | undefined;

export function renderRichTextWithResolvers(richtext?: RichtextInput) {
  if (!richtext) return null;
  return renderRichText(richtext as ISbRichtext, richTextResolvers as any);
}
