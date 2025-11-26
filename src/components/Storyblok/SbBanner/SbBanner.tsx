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
  getStoryblokColorVars,
  getStoryblokHighlightColor,
} from '@/components/Storyblok/utils/storyblokColorUtils';

const backgroundAlignmentClassMap: Record<'left' | 'center' | 'right', string> = {
  left: styles['background-position-left'],
  center: styles['background-position-center'],
  right: styles['background-position-right'],
};

type BannerStyleVars = CSSProperties & {
  '--sb-banner-image'?: string;
  '--sb-color-bg'?: string;
  '--sb-color-text'?: string;
  '--sb-color-bg-hover'?: string;
};

const renderHeadline = (segments: HeadlineSegment[] | undefined) => {
  if (!segments?.length) return null;

  return (
    <Title order={1} fw={700} size="h1">
      {segments.map((segment, index) => (
        <Text
          key={segment._uid ?? index}
          component="span"
          c={
            segment.highlight && segment.highlight !== 'none'
              ? getStoryblokHighlightColor(segment.highlight)
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
  const alignment = blok.text_alignment ?? 'left';
  const alignItems = alignment === 'center' ? 'center' : 'flex-start';
  const textAlign = alignment === 'center' ? 'center' : 'left';
  const backgroundKey = typeof blok.background_color === 'string' ? blok.background_color : undefined;
  const backgroundClass = getStoryblokColorClass(backgroundKey);
  const colorVars = getStoryblokColorVars(backgroundKey);

  const hasButtons = Boolean(blok.buttons?.length);
  const hasHeadline = Boolean(blok.headline?.length);
  const hasLead = Boolean(blok.lead);

  const backgroundImage = blok.background_image?.filename;
  const hasBackgroundImage = Boolean(backgroundImage);
  const inlineColorVars = !backgroundClass && colorVars ? colorVars : undefined;
  const bannerInlineStyle: BannerStyleVars | undefined =
    hasBackgroundImage || inlineColorVars
      ? {
          ...(hasBackgroundImage ? { '--sb-banner-image': `url(${backgroundImage})` } : {}),
          ...(inlineColorVars ?? {}),
        }
      : undefined;
  const backgroundSizeClass = hasBackgroundImage
    ? blok.background_image_cover
      ? styles['background-cover']
      : styles['background-contain']
    : '';
  const backgroundAlignmentValue = (blok.background_image_alignment ?? 'center') as 'left' | 'center' | 'right';
  const backgroundAlignmentClass = hasBackgroundImage ? backgroundAlignmentClassMap[backgroundAlignmentValue] : '';
  const bannerClasses = classNames(
    styles.banner,
    backgroundClass,
    hasBackgroundImage && styles['has-background-image'],
    hasBackgroundImage && backgroundSizeClass,
    hasBackgroundImage && backgroundAlignmentClass
  );

  if (!hasHeadline && !hasLead && !hasButtons) {
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
      <Stack gap="md" align={alignItems} maw={960} mx="auto" style={{ textAlign }}>
        {hasHeadline && renderHeadline(blok.headline)}
        {hasLead && (
          <Text size="lg" ta={textAlign} maw={680}>
            {blok.lead}
          </Text>
        )}

        {hasButtons && (
          <Group justify={alignment === 'center' ? 'center' : 'flex-start'} gap="md" wrap="wrap" mt="sm">
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
