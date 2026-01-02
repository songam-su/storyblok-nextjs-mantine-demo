'use client';

import { Text } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import Image from 'next/image';
import getSbImageData from '@/lib/storyblok/utils/image';
import { getStoryblokColorClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { ImageCard as ImageCardBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import styles from './ImageCard.module.scss';

const parseBackground = (value?: string | null) => {
  if (!value) return undefined;
  try {
    if (value.startsWith('[')) {
      const colors = JSON.parse(value) as string[];
      if (Array.isArray(colors) && colors.length >= 2) {
        return { backgroundImage: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` } as const;
      }
      if (Array.isArray(colors) && colors.length === 1) {
        return { background: colors[0] } as const;
      }
    }
  } catch (error) {
    console.warn('[ImageCard] Failed to parse background color', error);
  }
  return { background: value } as const;
};

const ImageCard = ({ blok }: SbComponentProps<ImageCardBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;
  const backgroundStyle = blok.background_color ? parseBackground(blok.background_color as string) : undefined;
  const backgroundClass = getStoryblokColorClass(blok.background_color as string | undefined);

  const imageData = getSbImageData(blok.image || null);
  const hasImage = Boolean(imageData?.src);

  if (!hasImage && !blok.label && !blok.text) {
    return <div {...editable} className={classNames(styles.card, backgroundClass)} style={backgroundStyle} />;
  }

  return (
    <div {...editable} className={classNames(styles.card, backgroundClass)} style={backgroundStyle}>
      {hasImage && (
        <div className={styles.imageFrame}>
          <Image
            className={styles.img}
            src={imageData!.src}
            alt={imageData!.alt || ''}
            fill
            sizes="(min-width: 768px) 320px, 100vw"
            style={{ objectFit: 'cover', ...(imageData?.objectPosition ? { objectPosition: imageData.objectPosition } : {}) }}
          />
        </div>
      )}

      {blok.label && (
        <p className={styles.label}>
          {blok.label}
        </p>
      )}

      {blok.text && (
        <Text size="sm" className={styles.text}>
          {blok.text}
        </Text>
      )}
    </div>
  );
};

export default ImageCard;
