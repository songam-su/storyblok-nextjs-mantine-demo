'use client';

import { Text } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import { getStoryblokHighlightClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { HeadlineSegment as HeadlineSegmentBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';

const HeadlineSegment = ({ blok }: SbComponentProps<HeadlineSegmentBlok>) => {
  const editable = storyblokEditable(blok as any);
  const highlightClass = blok.highlight && blok.highlight !== 'none' ? getStoryblokHighlightClass(blok.highlight) : undefined;

  if (!blok.text) {
    return <span {...editable} />;
  }

  return (
    <Text component="span" className={highlightClass} {...editable}>
      {blok.text}
    </Text>
  );
};

export default HeadlineSegment;
