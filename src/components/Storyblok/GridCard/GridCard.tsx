'use client';

import { Card, Stack, Text } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import Image from 'next/image';
import Button from '@/components/Storyblok/Button/Button';
import getSbImageData from '@/lib/storyblok/utils/image';
import type { GridCard as GridCardBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import styles from './GridCard.module.scss';

const GridCard = ({ blok }: SbComponentProps<GridCardBlok>) => {
  const editable = storyblokEditable(blok as any);
  const iconData = getSbImageData(blok.icon || null);
  const showIcon = Boolean(iconData?.src);
  const rowSpanClass = blok.row_span === '2' ? styles.rowSpan2 : undefined;
  const hasBorder = Boolean(blok.border);

  const backgroundStyle = blok.background_image?.filename
    ? { backgroundImage: `url(${blok.background_image.filename})` }
    : undefined;

  const hasContent = Boolean(blok.label || blok.bold_text || blok.text || (blok.button?.length ?? 0) > 0 || showIcon);

  if (!hasContent) {
    return <div {...editable} className={classNames(styles.card, rowSpanClass, hasBorder && styles.withBorder)} />;
  }

  return (
    <Card
      {...editable}
      className={classNames(styles.card, rowSpanClass, hasBorder && styles.withBorder, backgroundStyle && styles.backgroundImage)}
      style={backgroundStyle}
      shadow="sm"
      padding="lg"
    >
      <Stack gap="xs">
        {showIcon && (
          <div className={styles.icon}>
            <Image
              src={iconData!.src}
              alt={iconData!.alt || ''}
              width={iconData?.width || 64}
              height={iconData?.height || 64}
              sizes="64px"
              style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: iconData?.objectPosition }}
            />
          </div>
        )}

        {blok.label && (
          <Text size="lg" fw={700} className={styles.boldText}>
            {blok.label}
          </Text>
        )}

        {blok.bold_text && (
          <Text fw={600}>{blok.bold_text}</Text>
        )}

        {blok.text && <Text>{blok.text}</Text>}

        {Array.isArray(blok.button) && blok.button.length > 0 && (
          <Stack gap="xs">
            {blok.button.map((btn) => {
              if (!btn) return null;
              return (
                <Button
                  key={btn._uid}
                  blok={btn}
                  _uid={btn._uid}
                  component={btn.component}
                  storyblokEditable={storyblokEditable(btn as any)}
                />
              );
            })}
          </Stack>
        )}
      </Stack>
    </Card>
  );
};

export default GridCard;
