'use client';

import Button from '@/components/Storyblok/Button/Button';
import { renderHeadlineSegments } from '@/components/Storyblok/utils/renderHeadlineSegments';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type { HeroSection as HeroSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import getSbImageData from '@/lib/storyblok/utils/image';
import { getStoryblokColorClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { Group, Stack, Text, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import styles from './HeroSection.module.scss';

const HeroSection = ({ blok }: SbComponentProps<HeroSectionBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;
  const backgroundClass = getStoryblokColorClass(blok.background_color as string | undefined);
  const accentClass = getStoryblokColorClass(blok.secondary_background_color as string | undefined);
  const textAlign = blok.text_alignment === 'left' ? 'left' : 'center';
  const isStackedLayout = blok.layout === 'stacked';

  const imageData = getSbImageData(blok.image || null);
  const hasImage = Boolean(imageData?.src);
  const imageObjectFit = blok.preserve_image_aspect_ratio ? 'contain' : 'cover';
  const stackedImageObjectFit = imageObjectFit;

  const showDecoration = Boolean(blok.image_decoration && accentClass);

  const hasBody = Boolean(blok.eyebrow || blok.headline?.length || blok.text || (blok.buttons?.length ?? 0) > 0);

  if (!hasBody && !hasImage) {
    return <section {...editable} className={classNames(styles.section, backgroundClass)} />;
  }

  const heroStyle = (hasImage
    ? {
        '--sb-hero-image': `url(${imageData!.src})`,
        '--sb-hero-position': imageData?.objectPosition || 'center',
      }
    : undefined) as React.CSSProperties | undefined;

  return (
    <section
      {...editable}
      className={classNames(
        styles.section,
        'edge-to-edge',
        backgroundClass,
        textAlign === 'center' && styles.alignCenter,
        !isStackedLayout && hasImage && styles.hasBackgroundImage,
        !isStackedLayout && hasImage && (imageObjectFit === 'contain' ? styles.backgroundContain : styles.backgroundCover),
      )}
      style={heroStyle}
    >
      <div className="edge-to-edge__inner">
        <div className={classNames(styles.inner, isStackedLayout && styles.stacked)}>
          {showDecoration && <div className={classNames(styles.decoration, accentClass)} />}

          {isStackedLayout && hasImage && (
            <div
              className={classNames(
                styles.stackedImage,
                stackedImageObjectFit === 'contain' ? styles.stackedImageContain : styles.stackedImageCover
              )}
              aria-hidden="true"
            />
          )}

          {hasBody && (
            <div className={classNames(styles.contentBox, isStackedLayout && styles.contentBoxStacked)}>
              <Stack gap="md" className={styles.copy} style={{ textAlign }}>
                {blok.eyebrow && (
                  <Text size="sm" className={styles.eyebrow}>
                    {blok.eyebrow}
                  </Text>
                )}

                {blok.headline?.length ? (
                  <Title order={1} className={styles.headline} fw={800} size="h1">
                    {renderHeadlineSegments(blok.headline)}
                  </Title>
                ) : null}

                {blok.text && (
                  <Text size="lg" className={styles.lead}>
                    {blok.text}
                  </Text>
                )}

                {Array.isArray(blok.buttons) && blok.buttons.length > 0 && (
                  <Group gap="sm" className={styles.actions} justify={textAlign === 'center' ? 'center' : 'flex-start'}>
                    {blok.buttons.map((button) => {
                      if (!button) return null;
                      return (
                        <Button
                          key={button._uid}
                          blok={button}
                          _uid={button._uid}
                          component={button.component}
                          storyblokEditable={isEditor ? storyblokEditable(button as any) : undefined}
                        />
                      );
                    })}
                  </Group>
                )}
              </Stack>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
