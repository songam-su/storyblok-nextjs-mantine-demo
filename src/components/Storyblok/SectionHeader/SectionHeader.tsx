'use client';

import { renderHeadlineSegments } from '@/components/Storyblok/utils/renderHeadlineSegments';
import type { HeadlineSegment } from '@/lib/storyblok/resources/types/storyblok-components';
import { Text, Title, type TextProps, type TitleProps } from '@mantine/core';
import classNames from 'classnames';
import type { CSSProperties, ReactNode } from 'react';
import styles from './SectionHeader.module.scss';

export const hasSectionHeaderContent = (headline?: HeadlineSegment[] | null, lead?: unknown): boolean => {
  const hasHeadline = Array.isArray(headline) && headline.some((segment) => Boolean(segment?.text?.trim()));
  const hasLead = typeof lead === 'string' && lead.trim().length > 0;
  return hasHeadline || hasLead;
};

export type SectionHeaderProps = {
  headline?: HeadlineSegment[] | null;
  lead?: string | null;
  rightSlot?: ReactNode;
  align?: 'left' | 'center';
  titleOrder?: 1 | 2 | 3 | 4 | 5 | 6;
  titleSize?: TitleProps['size'];
  titleFw?: TitleProps['fw'];
  leadProps?: Omit<TextProps, 'children'>;
  className?: string;
  style?: CSSProperties;
};

const SectionHeader = ({
  headline,
  lead,
  rightSlot,
  align = 'left',
  titleOrder = 2,
  titleSize,
  titleFw,
  leadProps,
  className,
  style,
}: SectionHeaderProps) => {
  const normalizedHeadline = Array.isArray(headline)
    ? headline.filter((segment) => Boolean(segment?.text?.trim()))
    : ([] as HeadlineSegment[]);

  const hasHeadline = normalizedHeadline.length > 0;
  const hasLead = typeof lead === 'string' && lead.trim().length > 0;
  const hasContent = hasHeadline || hasLead;

  if (!hasContent && !rightSlot) return null;

  const header = hasContent ? (
    <div className={styles.header}>
      {hasHeadline ? (
        <Title order={titleOrder} fw={titleFw ?? 800} size={titleSize}>
          {renderHeadlineSegments(normalizedHeadline)}
        </Title>
      ) : null}
      {hasLead ? (
        <Text size="lg" className={styles.lead} {...leadProps}>
          {lead}
        </Text>
      ) : null}
    </div>
  ) : (
    <div />
  );

  return (
    <div className={classNames(styles.row, align === 'center' && styles.center, className)} style={style}>
      {header}
      {rightSlot}
    </div>
  );
};

export default SectionHeader;
