'use client';

import ArticleCard, { type ArticleCardCategory } from '@/components/Storyblok/ArticleCard/ArticleCard';
import SectionHeader, { hasSectionHeaderContent } from '@/components/Storyblok/SectionHeader/SectionHeader';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type {
  ArticlePage,
  Category,
  FeaturedArticlesSection as FeaturedArticlesSectionBlok,
} from '@/lib/storyblok/resources/types/storyblok-components';
import getSbImageData from '@/lib/storyblok/utils/image';
import { getStoryblokColorClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { Stack } from '@mantine/core';
import type { ISbStoryData } from '@storyblok/react';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import { useCallback } from 'react';
import styles from './FeaturedArticlesSection.module.scss';

type ArticleRef = ISbStoryData<ArticlePage> | string;

type NormalizedArticle = {
  key: string;
  url: string;
  title: string;
  image?: { src: string; alt?: string };
  categories: ArticleCardCategory[];
};

const normalizeCategories = (raw?: (ISbStoryData<Category> | string)[]) => {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item, index) => {
      if (!item || typeof item === 'string') return null;

      const story = item as ISbStoryData<Category>;
      const content = story.content as Category | undefined;
      const label = (content?.headline || story.name || story.slug || '').trim();
      if (!label) return null;

      const iconData = getSbImageData(content?.icon || null);

      return {
        key: (story.uuid || content?._uid || story.slug || `cat-${index}`) ?? `cat-${index}`,
        name: label,
        icon: iconData?.src ? { src: iconData.src, alt: iconData.alt || undefined } : undefined,
      } satisfies ArticleCardCategory;
    })
    .filter(Boolean) as ArticleCardCategory[];
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
  const displayTitle = (metaTitle || headline || name || slug || '').trim();
  if (!displayTitle) return null;

  const imageData = getSbImageData(article?.image || null);
  const image = imageData?.src ? { src: imageData.src, alt: imageData.alt || undefined } : undefined;

  const categories = normalizeCategories(article?.categories);

  return {
    key: (uuid || article?._uid || slug || `${index}`) ?? `${index}`,
    url,
    title: displayTitle,
    image,
    categories,
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
  const hasHeader = hasSectionHeaderContent(blok.headline, blok.lead);
  const hasArticles = articles.length > 0;

  if (!hasHeader && !hasArticles) {
    return <section {...editable} className={classNames(styles.section, backgroundClass)} />;
  }

  return (
    <section {...editable} className={classNames(styles.section, backgroundClass)}>
      <Stack gap="var(--sb-section-stack-gap)">
        {hasHeader && <SectionHeader headline={blok.headline} lead={blok.lead} />}

        {hasArticles && (
          <div className={styles.grid}>
            {articles.map((article, index) => {
              const normalized = normalizeArticle(article as ArticleRef, index);
              if (!normalized) return null;

              return (
                <ArticleCard
                  key={normalized.key}
                  href={normalized.url}
                  title={normalized.title}
                  image={normalized.image}
                  categories={normalized.categories}
                  onClick={handleEditorClick}
                  titleOrder={4}
                  imageSizes="(min-width: 62em) 25vw, (min-width: 48em) 50vw, 100vw"
                />
              );
            })}
          </div>
        )}
      </Stack>
    </section>
  );
};

export default FeaturedArticlesSection;
