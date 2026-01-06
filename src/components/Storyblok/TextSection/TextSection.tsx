'use client';

import { Stack, Text, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import { renderHeadlineSegments } from '@/components/Storyblok/utils/renderHeadlineSegments';
import { renderSbRichText } from '@/lib/storyblok/utils/richtext/renderSbRichText';
import { getStoryblokColorClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { TextSection as TextSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import styles from './TextSection.module.scss';

const TextSection = ({ blok }: SbComponentProps<TextSectionBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;
  const backgroundClass = getStoryblokColorClass(blok.background_color as string | undefined);

  const lead = typeof (blok as any)?.lead === 'string' ? ((blok as any).lead as string) : undefined;

  const hasHeader = Boolean(blok.headline?.length || lead);
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
            {lead && (
              <Text size="lg" className={styles.lead}>
                {lead}
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
