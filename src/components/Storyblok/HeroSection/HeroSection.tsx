'use client';

import classNames from 'classnames';
import { Group, Stack, Text, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import Image from 'next/image';
import Button from '@/components/Storyblok/Button/Button';
import { renderHeadlineSegments } from '@/components/Storyblok/utils/renderHeadlineSegments';
import getSbImageData from '@/lib/storyblok/utils/image';
import { getStoryblokColorClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { HeroSection as HeroSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import styles from './HeroSection.module.scss';

const HeroSection = ({ blok }: SbComponentProps<HeroSectionBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;
  const backgroundClass = getStoryblokColorClass(blok.background_color as string | undefined);
  const accentClass = getStoryblokColorClass(blok.secondary_background_color as string | undefined);
  const isSplit = blok.layout === 'split';
  const textAlign = blok.text_alignment === 'left' ? 'left' : 'center';

  const imageData = getSbImageData(blok.image || null);
  const hasImage = Boolean(imageData?.src);
  const imageObjectFit = blok.preserve_image_aspect_ratio ? 'contain' : 'cover';

  const showDecoration = Boolean(blok.image_decoration && accentClass);

  const hasBody = Boolean(blok.eyebrow || blok.headline?.length || blok.text || (blok.buttons?.length ?? 0) > 0);

  if (!hasBody && !hasImage) {
    return <section {...editable} className={classNames(styles.section, backgroundClass)} />;
  }

  return (
    <section
      {...editable}
      className={classNames(styles.section, backgroundClass, textAlign === 'center' && styles.alignCenter)}
    >
      <div className={classNames(styles.inner, isSplit ? styles.layoutSplit : styles.layoutStacked)}>
        {hasBody && (
          <Stack gap="xs" className={styles.copy} style={{ textAlign }}>
            {blok.eyebrow && (
              <Text size="sm" className={styles.eyebrow} c="dimmed">
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
        )}

        {hasImage && (
          <div className={styles.media}>
            {showDecoration && <div className={classNames(styles.decoration, accentClass)} />}
            <div className={classNames(styles.imageFrame, imageObjectFit === 'contain' && styles.imageContain)}>
              <Image
                className={styles.img}
                src={imageData!.src}
                alt={imageData!.alt || ''}
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                style={{
                  objectFit: imageObjectFit,
                  ...(imageData?.objectPosition ? { objectPosition: imageData.objectPosition } : {}),
                }}
                priority={!!blok.image}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
