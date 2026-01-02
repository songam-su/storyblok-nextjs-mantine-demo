'use client';

import { Text, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import Link from 'next/link';
import { renderHeadlineSegments } from '@/components/Storyblok/utils/renderHeadlineSegments';
import { getStoryblokColorClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { ArticlePage, FeaturedArticlesSection as FeaturedArticlesSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import styles from './FeaturedArticlesSection.module.scss';

const getStoryUrl = (story: any): string | undefined => {
  if (!story) return undefined;
  if (typeof story === 'string') return story ? `/${story}` : undefined;
  if (story.full_slug) return `/${story.full_slug}`;
  if (story.slug) return `/${story.slug}`;
  return undefined;
};

const FeaturedArticlesSection = ({ blok }: SbComponentProps<FeaturedArticlesSectionBlok>) => {
  const editable = storyblokEditable(blok as any);
  const backgroundClass = getStoryblokColorClass(blok.background_color as string | undefined);

  const articles = Array.isArray(blok.articles) ? blok.articles.filter(Boolean) : [];
  const hasHeader = Boolean(blok.headline?.length || blok.lead);
  const hasArticles = articles.length > 0;

  if (!hasHeader && !hasArticles) {
    return <section {...editable} className={classNames(styles.section, backgroundClass)} />;
  }

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

      {hasArticles && (
        <div className={styles.grid}>
          {articles.map((article, index) => {
            const url = getStoryUrl(article);
            const name = (article as any)?.name ?? (article as any)?.headline ?? `Article ${index + 1}`;
            const key = (article as any)?._uid ?? (article as any)?.uuid ?? index;

            return (
              <div key={key} className={styles.card}>
                <Title order={4} className={styles.cardTitle}>
                  {url ? <Link href={url}>{name}</Link> : name}
                </Title>
                {(article as ArticlePage)?.lead && <Text size="sm">{(article as ArticlePage).lead}</Text>}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default FeaturedArticlesSection;
