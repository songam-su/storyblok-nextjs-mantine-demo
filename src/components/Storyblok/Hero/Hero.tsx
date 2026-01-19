'use client';

import { Group, Stack, Text, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import React from 'react';

import Button from '@/components/Storyblok/Button/Button';
import SbImage from '@/components/ui/SbImage/SbImage';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import getSbImageData from '@/lib/storyblok/utils/image';
import { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import styles from './Hero.module.scss';

type HeroBlock = {
  _uid: string;
  component: string;
  eyebrow?: string;
  headline?: string;
  lead?: string;
  image?: any; // StoryblokAsset-ish
  image_cover?: boolean;
  buttons?: any[];
};

const Hero: React.FC<SbComponentProps<HeroBlock>> = ({ blok }) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;

  const imageData = getSbImageData(blok.image || null);
  const hasImage = Boolean(imageData?.src);
  const cover = Boolean(blok.image_cover ?? true);

  const mediaClasses = classNames(styles.media, { [styles.imageContain]: !cover });

  return (
    <section className={styles.hero} {...editable}>
      {hasImage ? (
        <div className={mediaClasses}>
          <SbImage
            className={styles.img}
            src={imageData!.src}
            alt={imageData!.alt || ''}
            fill
            sizes="100vw"
            style={{
              objectFit: cover ? 'cover' : 'contain',
              ...(imageData?.objectPosition ? { objectPosition: imageData.objectPosition } : {}),
            }}
            priority
          />
        </div>
      ) : (
        <div className={mediaClasses} />
      )}

      <div className={styles.overlay}>
        <div className={styles.content}>
          <div className={styles.inner}>
            <Stack gap="xs">
              {blok.eyebrow && <Text className={styles.eyebrow}>{blok.eyebrow}</Text>}
              {blok.headline && (
                <Title order={1} className={styles.headline} style={{ color: 'inherit' }}>
                  {blok.headline}
                </Title>
              )}
              {blok.lead && (
                <Text className={styles.lead} size="lg">
                  {blok.lead}
                </Text>
              )}

              {Array.isArray(blok.buttons) && blok.buttons.length > 0 && (
                <Group className={styles.actions} gap="md">
                  {blok.buttons.map((b: any) => (
                    <Button
                      key={b._uid}
                      blok={b}
                      _uid={b._uid}
                      component={b.component}
                      storyblokEditable={isEditor ? storyblokEditable(b as any) : undefined}
                    />
                  ))}
                </Group>
              )}
            </Stack>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
