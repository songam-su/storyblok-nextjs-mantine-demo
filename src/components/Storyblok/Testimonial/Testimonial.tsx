'use client';

import { Card, Group, Stack, Text, Avatar } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import getSbImageData from '@/lib/storyblok/utils/image';
import type { Testimonial as TestimonialBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import styles from './Testimonial.module.scss';

const Testimonial = ({ blok }: SbComponentProps<TestimonialBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;

  const photo = getSbImageData(blok.photo || null);
  const hasPhoto = Boolean(photo?.src);

  const hasBody = Boolean(blok.quote || blok.name || blok.role || hasPhoto);
  if (!hasBody) return null;

  return (
    <Card className={classNames(styles.card)} withBorder={false} radius="lg" shadow="sm" {...editable}>
      {blok.quote && (
        <Text className={styles.quote}>“{blok.quote}”</Text>
      )}

      {(blok.name || blok.role || hasPhoto) && (
        <Group className={styles.meta} justify="flex-start" align="center">
          {hasPhoto ? (
            <Avatar
              src={photo!.src}
              alt={photo!.alt || blok.name || 'Testimonial author'}
              radius="xl"
              size={48}
            />
          ) : (
            <Avatar radius="xl" size={48} color="gray" variant="light">
              {(blok.name || '?').slice(0, 1)}
            </Avatar>
          )}

          <Stack gap={2}>
            {blok.name && (
              <Text className={styles.name}>{blok.name}</Text>
            )}
            {blok.role && (
              <Text className={styles.role}>{blok.role}</Text>
            )}
          </Stack>
        </Group>
      )}
    </Card>
  );
};

export default Testimonial;
