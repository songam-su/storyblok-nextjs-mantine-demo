'use client';

import Button from '@/components/Storyblok/Button/Button';
import SbImage from '@/components/ui/SbImage/SbImage';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type { GridCard as GridCardBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import getSbImageData from '@/lib/storyblok/utils/image';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { Card, Flex, px, Stack, Text } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import styles from './GridCard.module.scss';

const GridCard = ({ blok }: SbComponentProps<GridCardBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;
  const iconData = getSbImageData(blok.icon || null);
  const showIcon = Boolean(iconData?.src);
  const rowSpanClass = blok.row_span === '2' ? styles.rowSpan2 : undefined;
  const hasBorder = Boolean(blok.border);

  // Background image support intentionally disabled.
  // const hasBackgroundImage = Boolean(blok.background_image?.filename);
  // const backgroundStyle = hasBackgroundImage
  //   ? { backgroundImage: `url(${blok.background_image!.filename})` }
  //   : undefined;

  const hasContent = Boolean(blok.label || blok.bold_text || blok.text || (blok.button?.length ?? 0) > 0 || showIcon);

  if (!hasContent) {
    return <div {...editable} className={classNames(styles.card, rowSpanClass, hasBorder && styles.withBorder)} />;
  }

  return (
    <Card
      {...editable}
      className={classNames(styles.card, rowSpanClass, hasBorder && styles.withBorder, styles.noImage)}
      shadow="sm"
      padding="lg"
    >
      <Stack gap="xs" ta="center" justify="space-between">
        <Flex gap="xs" ta="center" justify="space-between" dir="column">
          {showIcon && (
            <div className={styles.icon}>
              <SbImage
                src={iconData!.src}
                alt={iconData!.alt || ''}
                width={iconData?.width || 64}
                height={iconData?.height || 64}
                sizes="64px"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: iconData?.objectPosition,
                }}
              />
            </div>
          )}

          {blok.label && (
            <Flex justify="center" align="center" mb={showIcon ? px(8) : 0} mx="auto" pr={showIcon ? px(64) : 0}>
              <Text size="lg" fw={700} className={styles.boldText}>
                {blok.label}
              </Text>
            </Flex>
          )}
        </Flex>

        {blok.bold_text && (
          <Text fw={700} fz={px(21)} className={styles.boldText}>
            {blok.bold_text}
          </Text>
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
                  storyblokEditable={isEditor ? storyblokEditable(btn as any) : undefined}
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
