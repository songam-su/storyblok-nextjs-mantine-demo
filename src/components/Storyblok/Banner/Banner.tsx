'use client';

import SectionHeader from '@/components/Storyblok/SectionHeader/SectionHeader';
import { Banner } from '@/lib/storyblok/resources/types/storyblok-components';
import { Group, Paper, Stack } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import React, { CSSProperties } from 'react';

import Button from '@/components/Storyblok/Button/Button';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import { getStoryblokAlignmentMeta } from '@/lib/storyblok/utils/styles/alignment/storyblokAlignment';
import { getStoryblokColorClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import styles from './Banner.module.scss';

const backgroundAlignmentClassMap: Record<'left' | 'center' | 'right', string> = {
  left: styles['background-position-left'],
  center: styles['background-position-center'],
  right: styles['background-position-right'],
};

type BannerStyleVars = CSSProperties & {
  '--sb-banner-image'?: string;
};

const SbBanner: React.FC<SbComponentProps<Banner>> = ({ blok }) => {
  const { isEditor } = useStoryblokEditor();
  const editableAttributes = isEditor ? storyblokEditable(blok as any) : undefined;
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
  const bannerClasses = classNames(styles.banner, 'edge-to-edge', backgroundClass, ...backgroundClasses);

  if (!hasContent) {
    return null;
  }

  return (
    <Paper
      component="section"
      radius={0}
      shadow="lg"
      className={bannerClasses}
      style={bannerInlineStyle}
      {...editableAttributes}
    >
      <div className={'edge-to-edge__inner ' + styles.inner}>
        <Stack gap="md" align={alignment.alignItems} style={{ textAlign: alignment.textAlign }}>
          <SectionHeader
            headline={blok.headline}
            lead={blok.lead}
            leadProps={{ c: 'inherit', ta: alignment.textAlign, maw: 680 }}
            style={{ marginBottom: 0, ['--section-header-lead-color' as any]: 'inherit' }}
          />

          {hasButtons && (
            <Group justify={alignment.justifyContent} gap="md" wrap="wrap" mt="sm">
              {blok.buttons?.map((button) => (
                <Button
                  key={button._uid}
                  blok={button}
                  _uid={button._uid}
                  component={button.component}
                  storyblokEditable={isEditor ? storyblokEditable(button as any) : undefined}
                />
              ))}
            </Group>
          )}
        </Stack>
      </div>
    </Paper>
  );
};

export default SbBanner;
