'use client';

import { Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import type { ArticleOverviewPage as ArticleOverviewPageBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import styles from './ArticleOverviewPage.module.scss';

const ArticleOverviewPage = ({ blok }: SbComponentProps<ArticleOverviewPageBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;

  if (!blok.headline) {
    return <section {...editable} className={styles.section} />;
  }

  return (
    <section {...editable} className={styles.section}>
      <Title order={1} fw={800}>
        {blok.headline}
      </Title>
    </section>
  );
};

export default ArticleOverviewPage;
