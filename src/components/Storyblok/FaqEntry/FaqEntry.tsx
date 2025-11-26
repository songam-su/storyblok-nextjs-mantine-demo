'use client';

import { Paper } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { FaqEntry as FaqEntryBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import styles from './FaqEntry.module.scss';
import { FaqEntryContent } from './FaqEntryContent';

const FaqEntry: React.FC<SbComponentProps<FaqEntryBlok>> = ({ blok }) => {
  const editableAttributes = storyblokEditable(blok as any);

  if (!blok.question && !blok.answer) {
    return null;
  }

  return (
    <Paper component="article" className={styles.entry} radius="lg" shadow="md" {...editableAttributes}>
      <FaqEntryContent question={blok.question} answer={blok.answer} />
    </Paper>
  );
};

export default FaqEntry;
