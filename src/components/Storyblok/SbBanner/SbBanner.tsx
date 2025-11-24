'use client';

import { storyblokEditable } from '@storyblok/react';
import { Group, Paper, Stack, Text, Title } from '@mantine/core';
import React from 'react';
import { Banner, HeadlineSegment } from '@/lib/storyblok/resources/types/storyblok-components';

type HighlightColorsDataSource = 'primary-highlight' | 'highlight-1' | 'highlight-2' | 'highlight-3';

import { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import SbButton from '@/components/Storyblok/SbButton/SbButton';
import styles from './SbBanner.module.scss';

const highlightColorMap: Record<HighlightColorsDataSource, string> = {
  'primary-highlight': 'var(--mantine-color-blue-2)',
  'highlight-1': 'var(--mantine-color-indigo-2)',
  'highlight-2': 'var(--mantine-color-teal-2)',
  'highlight-3': 'var(--mantine-color-pink-2)',
};

const backgroundColorClassMap: Record<string, string> = {
  'primary-highlight': styles['primary-highlight'],
  'highlight-1': styles['highlight-1'],
  'highlight-2': styles['highlight-2'],
  'highlight-3': styles['highlight-3'],
  'primary-dark': styles['primary-dark'],
  white: styles.white,
};

const renderHeadline = (segments: HeadlineSegment[] | undefined, fallbackColor: string) => {
  if (!segments?.length) return null;

  return (
    <Title order={2} fw={600} ta="inherit">
      {segments.map((segment, index) => (
        <Text
          key={segment._uid ?? index}
          component="span"
          c={segment.highlight ? highlightColorMap[segment.highlight] : fallbackColor}
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
  const backgroundClass = blok.background_color ? backgroundColorClassMap[blok.background_color] : undefined;
  const isLightBackground = blok.background_color === 'white';

  const hasButtons = Boolean(blok.buttons?.length);
  const hasHeadline = Boolean(blok.headline?.length);
  const hasLead = Boolean(blok.lead);

  const backgroundImage = blok.background_image?.filename;
  const bannerStyle = backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgba(6,11,26,0.55), rgba(6,11,26,0.55)), url(${backgroundImage})`,
        backgroundSize: blok.background_image_cover ? 'cover' : 'contain',
        backgroundPosition: blok.background_image_alignment ?? 'center',
      }
    : undefined;

  const textColor = backgroundImage
    ? 'var(--mantine-color-gray-0)'
    : isLightBackground
      ? 'var(--mantine-color-dark-7)'
      : 'var(--mantine-color-gray-0)';

  if (!hasHeadline && !hasLead && !hasButtons) {
    return null;
  }

  return (
    <Paper
      component="section"
      radius="xl"
      p={{ base: 'xl', md: 'xxl' }}
      shadow="lg"
      className={[styles.banner, backgroundClass].filter(Boolean).join(' ')}
      style={bannerStyle}
      c={textColor}
      {...editableAttributes}
    >
      <Stack gap="md" align={alignItems} maw={960} mx="auto" style={{ textAlign }}>
        {hasHeadline && renderHeadline(blok.headline, textColor)}
        {hasLead && (
          <Text size="lg" c={textColor} ta={textAlign} maw={680}>
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
