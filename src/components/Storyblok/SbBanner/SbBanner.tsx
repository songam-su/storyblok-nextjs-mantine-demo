'use client';

import { storyblokEditable } from '@storyblok/react';
import { Group, Paper, Stack, Text, Title } from '@mantine/core';
import React, { CSSProperties } from 'react';
import { Banner, HeadlineSegment } from '@/lib/storyblok/resources/types/storyblok-components';

type HighlightColorsDataSource = 'primary-highlight' | 'highlight-1' | 'highlight-2' | 'highlight-3';

import { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import SbButton from '@/components/Storyblok/SbButton/SbButton';
import styles from './SbBanner.module.scss';

const highlightColorMap: Record<string, string> = {
  'primary-highlight': 'var(--mantine-color-neonIceLight-3)',
  'highlight-1': 'var(--mantine-color-bubblegumPink-3)',
  'highlight-2': 'var(--mantine-color-amberGlow-3)',
  'highlight-3': 'var(--mantine-color-blushedBrick-3)',
  color_1: 'var(--mantine-color-bubblegumPink-3)',
  color_2: 'var(--mantine-color-amberGlow-3)',
  color_3: 'var(--mantine-color-blushedBrick-3)',
};

const backgroundColorValueMap: Record<string, string> = {
  'primary-highlight': 'var(--mantine-color-neonIceLight-6)',
  'highlight-1': 'var(--mantine-color-bubblegumPink-6)',
  'highlight-2': 'var(--mantine-color-amberGlow-6)',
  'highlight-3': 'var(--mantine-color-blushedBrick-6)',
  'primary-dark': 'var(--mantine-color-carbonBlack-8)',
  white: 'var(--mantine-color-whiteSmoke-0)',
  'primary-background': 'var(--mantine-color-carbonBlack-9)',
  'background-1': 'var(--mantine-color-carbonBlack-8)',
  'background-2': 'var(--mantine-color-carbonBlack-7)',
  'background-3': 'var(--mantine-color-carbonBlack-6)',
  'background-4': 'var(--mantine-color-graphite-8)',
  'background-5': 'var(--mantine-color-graphite-7)',
  'background-6': 'var(--mantine-color-gunmetal-8)',
  'background-7': 'var(--mantine-color-gunmetal-6)',
  'background-8': 'var(--mantine-color-gunmetal-3)',
  'background-9': 'var(--mantine-color-whiteSmoke-3)',
  'background-10': 'var(--mantine-color-whiteSmoke-1)',
  color_1: 'var(--mantine-color-bubblegumPink-6)',
  color_2: 'var(--mantine-color-amberGlow-6)',
  color_3: 'var(--mantine-color-blushedBrick-6)',
};

const backgroundColorClassMap: Record<string, string> = {
  'primary-highlight': styles['primary-highlight'],
  'highlight-1': styles['highlight-1'],
  'highlight-2': styles['highlight-2'],
  'highlight-3': styles['highlight-3'],
  'primary-dark': styles['primary-dark'],
  white: styles.white,
  'primary-background': styles['primary-background'],
  'background-1': styles['background-1'],
  'background-2': styles['background-2'],
  'background-3': styles['background-3'],
  'background-4': styles['background-4'],
  'background-5': styles['background-5'],
  'background-6': styles['background-6'],
  'background-7': styles['background-7'],
  'background-8': styles['background-8'],
  'background-9': styles['background-9'],
  'background-10': styles['background-10'],
  color_1: styles['highlight-1'],
  color_2: styles['highlight-2'],
  color_3: styles['highlight-3'],
};

const LIGHT_BACKGROUNDS = new Set<string | undefined>([
  'primary-highlight',
  'highlight-2',
  'color_2',
  'white',
  'background-8',
  'background-9',
  'background-10',
]);

const backgroundAlignmentClassMap: Record<'left' | 'center' | 'right', string> = {
  left: styles['background-position-left'],
  center: styles['background-position-center'],
  right: styles['background-position-right'],
};

type BannerStyleVars = CSSProperties & {
  '--sb-banner-image'?: string;
  '--sb-banner-color'?: string;
};

const renderHeadline = (segments: HeadlineSegment[] | undefined) => {
  if (!segments?.length) return null;

  return (
    <Title order={1} fw={700} size="h1">
      {segments.map((segment, index) => (
        <Text
          key={segment._uid ?? index}
          component="span"
          c={segment.highlight && segment.highlight !== 'none' ? highlightColorMap[segment.highlight] : undefined}
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
  const backgroundClass = backgroundKey ? (backgroundColorClassMap[backgroundKey] ?? '') : '';
  const isLightBackground = LIGHT_BACKGROUNDS.has(backgroundKey);

  const hasButtons = Boolean(blok.buttons?.length);
  const hasHeadline = Boolean(blok.headline?.length);
  const hasLead = Boolean(blok.lead);

  const backgroundImage = blok.background_image?.filename;
  const hasBackgroundImage = Boolean(backgroundImage);
  const backgroundColorValue = backgroundKey ? backgroundColorValueMap[backgroundKey] : undefined;
  const bannerInlineStyle: BannerStyleVars | undefined =
    hasBackgroundImage || (!backgroundClass && backgroundColorValue)
      ? {
          ...(hasBackgroundImage ? { '--sb-banner-image': `url(${backgroundImage})` } : {}),
          ...(!backgroundClass && backgroundColorValue ? { '--sb-banner-color': backgroundColorValue } : {}),
        }
      : undefined;
  const backgroundSizeClass = hasBackgroundImage
    ? blok.background_image_cover
      ? styles['background-cover']
      : styles['background-contain']
    : '';
  const backgroundAlignmentValue = (blok.background_image_alignment ?? 'center') as 'left' | 'center' | 'right';
  const backgroundAlignmentClass = hasBackgroundImage ? backgroundAlignmentClassMap[backgroundAlignmentValue] : '';
  const textToneClass = hasBackgroundImage
    ? styles['text-on-dark']
    : isLightBackground
      ? styles['text-on-light']
      : styles['text-on-dark'];
  const bannerClasses = [
    styles.banner,
    backgroundClass,
    textToneClass,
    ...(hasBackgroundImage ? [styles['has-background-image'], backgroundSizeClass, backgroundAlignmentClass] : []),
  ]
    .filter(Boolean)
    .join(' ');

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
