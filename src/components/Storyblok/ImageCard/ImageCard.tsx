'use client';

import SbImage from '@/components/ui/SbImage/SbImage';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type { ImageCard as ImageCardBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import getSbImageData from '@/lib/storyblok/utils/image';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { Text } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import styles from './ImageCard.module.scss';

const EARTH_TONE_PASTELS = [
  '#E9E8D2', // oat
  '#FBE8D5', // peach
  '#E3F0D5', // sage
  '#D9E4F1', // mist
  '#F8D7D4', // blush
  '#D8D4F9', // lilac
] as const;

const hashString = (value: string) => {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return hash >>> 0;
};

const pickFromPalette = (palette: readonly string[], seed: string) => palette[hashString(seed) % palette.length];

const parseBackground = (seed: string, rawValue?: string | null) => {
  const value = typeof rawValue === 'string' ? rawValue.trim() : '';

  // Default / preset option from Storyblok: use earth-tone pastels.
  if (!value || value === 'medium') {
    return { background: pickFromPalette(EARTH_TONE_PASTELS, seed) } as const;
  }

  try {
    if (value.startsWith('[')) {
      const colors = JSON.parse(value) as unknown;
      const palette = Array.isArray(colors)
        ? (colors
            .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
            .map((item) => item.trim()) as string[])
        : [];

      // Treat JSON arrays as a palette of options, not a gradient.
      if (palette.length > 0) {
        return { background: pickFromPalette(palette, seed) } as const;
      }
    }
  } catch (error) {
    console.warn('[ImageCard] Failed to parse background color', error);
  }

  // Hex colors.
  if (value.startsWith('#')) {
    return { background: value } as const;
  }

  // Any other string (e.g. Storyblok theme keys like 'background-2'):
  // map to our earth-tone palette so the look stays consistent.
  return { background: pickFromPalette(EARTH_TONE_PASTELS, value) } as const;
};

const ImageCard = ({ blok }: SbComponentProps<ImageCardBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;
  const frameBackgroundStyle = parseBackground(blok._uid, blok.background_color as string | undefined);

  const imageData = getSbImageData(blok.image || null);
  const hasImage = Boolean(imageData?.src);

  const imageStyle: React.CSSProperties = {
    objectFit: 'contain',
    objectPosition: imageData?.objectPosition || 'center',
  };

  if (!hasImage && !blok.label && !blok.text) {
    return <div {...editable} className={styles.card} />;
  }

  return (
    <div {...editable} className={styles.card}>
      {hasImage && (
        <div className={styles.imageFrame} style={frameBackgroundStyle}>
          <div className={styles.imageInner}>
            <SbImage
              className={styles.img}
              src={imageData!.src}
              alt={imageData!.alt || ''}
              fill
              sizes="(min-width: 768px) 320px, 100vw"
              style={imageStyle}
            />
          </div>
        </div>
      )}

      {(blok.label || blok.text) && (
        <div className={styles.content}>
          {blok.label && <p className={styles.label}>{blok.label}</p>}

          {blok.text && (
            <Text className={styles.text} fz="var(--sb-font-body-size)" lh="var(--sb-font-body-line-height)">
              {blok.text}
            </Text>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageCard;
