'use client';

import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type { HeadlineSegment as HeadlineSegmentBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import { getStoryblokHighlightClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { Text } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';

const HeadlineSegment = ({ blok }: SbComponentProps<HeadlineSegmentBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;
  const highlightClass =
    blok.highlight && blok.highlight !== 'none' ? getStoryblokHighlightClass(blok.highlight) : undefined;

  if (!blok.text) {
    return <span {...editable} />;
  }

  return (
    <Text component="span" className={highlightClass} size="30px" {...editable}>
      {blok.text}
    </Text>
  );
};

export default HeadlineSegment;
