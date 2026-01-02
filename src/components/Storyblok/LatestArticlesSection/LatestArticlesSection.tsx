import { Text, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import { renderHeadlineSegments } from '@/components/Storyblok/utils/renderHeadlineSegments';
import { getStoryblokColorClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { LatestArticlesSection as LatestArticlesSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import styles from './LatestArticlesSection.module.scss';

const LatestArticlesSection = ({ blok }: SbComponentProps<LatestArticlesSectionBlok>) => {
  const editable = storyblokEditable(blok as any);
  const backgroundClass = getStoryblokColorClass(blok.background_color as string | undefined);
  const hasHeader = Boolean(blok.headline?.length || blok.lead);

  return (
    <section {...editable} className={classNames(styles.section, backgroundClass)}>
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

      <Text size="sm" c="dimmed">
        No articles connected yet.
      </Text>
    </section>
  );
};

export default LatestArticlesSection;
