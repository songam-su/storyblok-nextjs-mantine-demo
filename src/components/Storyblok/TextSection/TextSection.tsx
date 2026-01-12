'use client';

import SectionHeader, { hasSectionHeaderContent } from '@/components/Storyblok/SectionHeader/SectionHeader';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type { TextSection as TextSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import { renderSbRichText } from '@/lib/storyblok/utils/richtext/renderSbRichText';
import { getStoryblokColorClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { Stack } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import styles from './TextSection.module.scss';

const TextSection = ({ blok }: SbComponentProps<TextSectionBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;
  const backgroundClass = getStoryblokColorClass(blok.background_color as string | undefined);

  const lead = typeof (blok as any)?.lead === 'string' ? ((blok as any).lead as string) : undefined;

  const hasHeader = hasSectionHeaderContent(blok.headline, lead);
  const hasText = Boolean(blok.text);

  if (!hasHeader && !hasText) {
    return <section {...editable} className={classNames(styles.section, backgroundClass)} />;
  }

  return (
    <section {...editable} className={classNames(styles.section, backgroundClass)}>
      <Stack gap="md">
        <SectionHeader headline={blok.headline} lead={lead} />

        {hasText && <div className={styles.content}>{renderSbRichText(blok.text)}</div>}
      </Stack>
    </section>
  );
};

export default TextSection;
