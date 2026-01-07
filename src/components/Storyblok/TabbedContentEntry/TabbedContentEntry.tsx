'use client';

import { Card, Stack, Text } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import Button from '@/components/Storyblok/Button/Button';
import { renderSbRichText } from '@/lib/storyblok/utils/richtext/renderSbRichText';
import getSbImageData from '@/lib/storyblok/utils/image';
import type { TabbedContentEntry as TabbedContentEntryBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import styles from './TabbedContentEntry.module.scss';

const TabbedContentEntry = ({ blok }: SbComponentProps<TabbedContentEntryBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;

  const image = getSbImageData(blok.image || null);
  const hasImage = Boolean(image?.src);
  const hasBody = Boolean(hasImage || blok.headline || blok.description || (blok.button?.length ?? 0) > 0);
  if (!hasBody) return null;

  const backgroundStyle = hasImage ? { backgroundImage: `url(${image!.src})` } : undefined;

  return (
    <Card
      className={classNames(styles.card, hasImage ? styles.backgroundImage : styles.noImage)}
      style={backgroundStyle}
      {...editable}
      withBorder={false}
      shadow="sm"
      radius="lg"
    >
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
    </Card>
  );
};

export default TabbedContentEntry;
