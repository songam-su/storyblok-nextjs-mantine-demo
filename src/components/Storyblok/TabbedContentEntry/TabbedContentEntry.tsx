'use client';

import Button from '@/components/Storyblok/Button/Button';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type { TabbedContentEntry as TabbedContentEntryBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import getSbImageData from '@/lib/storyblok/utils/image';
import { renderSbRichText } from '@/lib/storyblok/utils/richtext/renderSbRichText';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { Card, Stack, Text } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import Image from 'next/image';
import styles from './TabbedContentEntry.module.scss';

const TabbedContentEntry = ({ blok }: SbComponentProps<TabbedContentEntryBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;

  const image = getSbImageData(blok.image || null);
  const hasImage = Boolean(image?.src);
  const hasBody = Boolean(hasImage || blok.headline || blok.description || (blok.button?.length ?? 0) > 0);
  if (!hasBody) return null;

  return (
    <Card className={styles.card} {...editable} withBorder={false} shadow="sm" radius="lg">
      <div className={styles.body}>
        <div className={styles.contentPane}>
          <Stack gap="sm">
            {blok.headline && <Text className={styles.headline}>{blok.headline}</Text>}

            {blok.description && <div className={styles.richtext}>{renderSbRichText(blok.description)}</div>}

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
        </div>

        {hasImage ? (
          <div className={styles.mediaPane} aria-hidden={image?.alt ? undefined : true}>
            <Image
              src={image!.src}
              alt={image?.alt || ''}
              fill
              sizes="(min-width: 62em) 50vw, 100vw"
              className={styles.mediaImage}
              priority={false}
            />
          </div>
        ) : null}
      </div>
    </Card>
  );
};

export default TabbedContentEntry;
