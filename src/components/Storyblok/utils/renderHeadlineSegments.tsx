import type { HeadlineSegment } from '@/lib/storyblok/resources/types/storyblok-components';
import { getStoryblokHighlightClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import { Text } from '@mantine/core';
import type { ReactNode } from 'react';

export const renderHeadlineSegments = (segments?: HeadlineSegment[]): ReactNode => {
  if (!segments?.length) return null;

  return segments.map((segment, index) => {
    const highlightClass =
      segment.highlight && segment.highlight !== 'none' ? getStoryblokHighlightClass(segment.highlight) : undefined;

    return (
      <Text key={segment._uid ?? index} component="span" className={highlightClass} size="30px">
        {segment.text}
      </Text>
    );
  });
};
