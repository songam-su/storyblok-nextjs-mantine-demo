'use client';

import { Text, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import Link from 'next/link';
import { useCallback } from 'react';
import { renderHeadlineSegments } from '@/components/Storyblok/utils/renderHeadlineSegments';
import { getStoryblokColorClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { ArticlePage, FeaturedArticlesSection as FeaturedArticlesSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { ISbStoryData } from '@storyblok/react';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import styles from './FeaturedArticlesSection.module.scss';

type ArticleRef = ISbStoryData<ArticlePage> | string;

type NormalizedArticle = {
  key: string;
  name: string;
  lead?: string;
  url: string;
};

const normalizeArticle = (item: ArticleRef | null | undefined, index: number): NormalizedArticle | null => {
  if (!item) return null;

  if (typeof item === 'string') {
    // If relations aren't resolved, skip rendering this entry.
    return null;
  }

  const { full_slug, slug, uuid, name, content } = item as ISbStoryData<ArticlePage>;
  const article = content as ArticlePage | undefined;

  const url = full_slug ? `/${full_slug}` : slug ? `/${slug}` : null;
  if (!url) return null;

  const metaTitle = article && typeof article.meta_title === 'string' ? article.meta_title : undefined;
  const headline = article && typeof article.headline === 'string' ? article.headline : undefined;
  const displayName = metaTitle || headline || name || slug;
  if (!displayName) return null;

  const rawLead = article ? (article as Record<string, unknown>).lead : undefined;
  const lead = typeof rawLead === 'string' ? rawLead : undefined;

  return {
    key: (uuid || article?._uid || slug || `${index}`) ?? `${index}`,
    name: displayName,
    lead,
    url,
  };
};

const FeaturedArticlesSection = ({ blok }: SbComponentProps<FeaturedArticlesSectionBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;
  const backgroundClass = getStoryblokColorClass(blok.background_color as string | undefined);

  const handleEditorClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (isEditor) {
        event.preventDefault();
      }
    },
    [isEditor]
  );

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
                  {normalized.url ? (
                    <Link href={normalized.url} onClick={handleEditorClick}>
                      {normalized.name}
                    </Link>
                  ) : (
                    normalized.name
                  )}
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
