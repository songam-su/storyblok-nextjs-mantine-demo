'use client';

import { Stack, Text, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import { renderHeadlineSegments } from '@/components/Storyblok/utils/renderHeadlineSegments';
import { renderSbRichText } from '@/lib/storyblok/utils/richtext/renderSbRichText';
import { getStoryblokColorClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { TextSection as TextSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import styles from './TextSection.module.scss';

const TextSection = ({ blok }: SbComponentProps<TextSectionBlok>) => {
  const editable = storyblokEditable(blok as any);
  const backgroundClass = getStoryblokColorClass(blok.background_color as string | undefined);

  const hasHeader = Boolean(blok.headline?.length || blok.lead);
  const hasText = Boolean(blok.text);

  if (!hasHeader && !hasText) {
    return <section {...editable} className={classNames(styles.section, backgroundClass)} />;
  }

  return (
    <section {...editable} className={classNames(styles.section, backgroundClass)}>
      <Stack gap="md">
        {hasHeader && (
          <div className={styles.header}>
            {blok.headline?.length ? (
              <Title order={2} fw={800}>
                {renderHeadlineSegments(blok.headline)}
              </Title>
            ) : null}
            {blok.lead && (
              <Text size="lg" className={styles.lead}>
                {blok.lead}
              </Text>
            )}
          </div>
        )}

        {hasText && <div className={styles.content}>{renderSbRichText(blok.text)}</div>}
      </Stack>
    </section>
  );
};

export default TextSection;
