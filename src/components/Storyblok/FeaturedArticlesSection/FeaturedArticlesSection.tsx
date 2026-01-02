'use client';

import { Text, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import Link from 'next/link';
import { renderHeadlineSegments } from '@/components/Storyblok/utils/renderHeadlineSegments';
import { getStoryblokColorClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { ArticlePage, FeaturedArticlesSection as FeaturedArticlesSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { ISbStoryData } from '@storyblok/react';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import styles from './FeaturedArticlesSection.module.scss';

type ArticleRef = string | ISbStoryData<ArticlePage>;
type NormalizedArticle = {
  key: string;
  name: string;
  lead?: string;
  url?: string;
};

const normalizeArticle = (item: ArticleRef, index: number): NormalizedArticle | null => {
  if (!item) return null;

  if (typeof item === 'string') {
    const slug = item.replace(/^\//, '');
    return {
      key: `${slug || index}-${index}`,
      name: slug || `Article ${index + 1}`,
      lead: undefined as string | undefined,
      url: slug ? `/${slug}` : undefined,
    };
  }

  const { full_slug, slug, uuid, name, content } = item;
  const articleContent = (content || {}) as ArticlePage;
  const rawLead = (articleContent as Record<string, unknown>).lead;
  const lead = typeof rawLead === 'string' ? rawLead : undefined;
  const url = full_slug ? `/${full_slug}` : slug ? `/${slug}` : undefined;
  const displayName = articleContent.headline || name || `Article ${index + 1}`;

  return {
    key: (uuid || articleContent._uid || `${index}`) ?? `${index}`,
    name: displayName,
    lead,
    url,
  };
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
            const normalized = normalizeArticle(article as ArticleRef, index);
            if (!normalized) return null;

            return (
              <div key={normalized.key} className={styles.card}>
                <Title order={4} className={styles.cardTitle}>
                  {normalized.url ? <Link href={normalized.url}>{normalized.name}</Link> : normalized.name}
                </Title>
                {normalized.lead && <Text size="sm">{normalized.lead}</Text>}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default FeaturedArticlesSection;
