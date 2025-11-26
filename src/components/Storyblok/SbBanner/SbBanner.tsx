'use client';

import { storyblokEditable } from '@storyblok/react';
import { Group, Paper, Stack, Text, Title } from '@mantine/core';
import classNames from 'classnames';
import React, { CSSProperties } from 'react';
import { Banner, HeadlineSegment } from '@/lib/storyblok/resources/types/storyblok-components';

import { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import SbButton from '@/components/Storyblok/SbButton/SbButton';
import styles from './SbBanner.module.scss';
import {
  getStoryblokColorClass,
  getStoryblokHighlightClass,
} from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import { getStoryblokAlignmentMeta } from '@/lib/storyblok/utils/styles/alignment/storyblokAlignment';

const backgroundAlignmentClassMap: Record<'left' | 'center' | 'right', string> = {
  left: styles['background-position-left'],
  center: styles['background-position-center'],
  right: styles['background-position-right'],
};

type BannerStyleVars = CSSProperties & {
  '--sb-banner-image'?: string;
};

const renderHeadline = (segments: HeadlineSegment[] | undefined) => {
  if (!segments?.length) return null;

  return (
    <Title order={1} fw={700} size="h1">
      {segments.map((segment, index) => (
        <Text
          key={segment._uid ?? index}
          component="span"
          className={
            segment.highlight && segment.highlight !== 'none'
              ? getStoryblokHighlightClass(segment.highlight)
              : undefined
          }
        >
          {segment.text}
        </Text>
      ))}
    </Title>
  );
};

const SbBanner: React.FC<SbComponentProps<Banner>> = ({ blok }) => {
  const editableAttributes = storyblokEditable(blok as any);
  const alignment = getStoryblokAlignmentMeta(blok.text_alignment);
  const backgroundKey = typeof blok.background_color === 'string' ? blok.background_color : undefined;
  const backgroundClass = getStoryblokColorClass(backgroundKey);

  const hasButtons = Boolean(blok.buttons?.length);
  const hasHeadline = Boolean(blok.headline?.length);
  const hasLead = Boolean(blok.lead);
  const hasContent = hasHeadline || hasLead || hasButtons;

  const backgroundImage = blok.background_image?.filename;
  const hasBackgroundImage = Boolean(backgroundImage);
  const bannerInlineStyle: BannerStyleVars | undefined = hasBackgroundImage
    ? { '--sb-banner-image': `url(${backgroundImage})` }
    : undefined;
  const backgroundAlignmentValue = (blok.background_image_alignment ?? 'center') as 'left' | 'center' | 'right';
  const backgroundClasses = hasBackgroundImage
    ? [
        styles['has-background-image'],
        blok.background_image_cover ? styles['background-cover'] : styles['background-contain'],
        backgroundAlignmentClassMap[backgroundAlignmentValue],
      ]
    : [];
  const bannerClasses = classNames(styles.banner, backgroundClass, ...backgroundClasses);

  if (!hasContent) {
    return null;
  }

  return (
    <Paper
      component="section"
      radius="xl"
      p={{ base: 'xl', md: 'xxl' }}
      shadow="lg"
      className={bannerClasses}
      style={bannerInlineStyle}
      {...editableAttributes}
    >
      <Stack gap="md" align={alignment.alignItems} maw={960} mx="auto" style={{ textAlign: alignment.textAlign }}>
        {hasHeadline && renderHeadline(blok.headline)}
        {hasLead && (
          <Text size="lg" ta={alignment.textAlign} maw={680}>
            {blok.lead}
          </Text>
        )}

        {hasButtons && (
          <Group justify={alignment.justifyContent} gap="md" wrap="wrap" mt="sm">
            {blok.buttons?.map((button) => (
              <SbButton
                key={button._uid}
                blok={button}
                _uid={button._uid}
                component={button.component}
                storyblokEditable={storyblokEditable(button as any)}
              />
            ))}
          </Group>
        )}
      </Stack>
    </Paper>
  );
};

export default SbBanner;
