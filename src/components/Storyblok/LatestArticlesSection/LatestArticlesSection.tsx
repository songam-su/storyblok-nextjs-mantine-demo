import SectionHeader, { hasSectionHeaderContent } from '@/components/Storyblok/SectionHeader/SectionHeader';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type { LatestArticlesSection as LatestArticlesSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import { getStoryblokColorClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { Stack, Text } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import styles from './LatestArticlesSection.module.scss';

const LatestArticlesSection = ({ blok }: SbComponentProps<LatestArticlesSectionBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;
  const backgroundClass = getStoryblokColorClass(blok.background_color as string | undefined);
  const hasHeader = hasSectionHeaderContent(blok.headline, blok.lead);

  return (
    <section {...editable} className={classNames(styles.section, backgroundClass)}>
      <Stack gap="var(--sb-section-stack-gap)">
        {hasHeader && <SectionHeader headline={blok.headline} lead={blok.lead} />}

        <Text size="sm" c="dimmed">
          No articles connected yet.
        </Text>
      </Stack>
    </section>
  );
};

export default LatestArticlesSection;
