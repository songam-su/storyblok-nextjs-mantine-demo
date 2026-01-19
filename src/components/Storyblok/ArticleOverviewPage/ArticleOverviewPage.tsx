'use client';

import ArticleCard from '@/components/Storyblok/ArticleCard/ArticleCard';
import PageSkeleton from '@/components/chrome/PageSkeleton/PageSkeleton';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type { ArticleOverviewPage as ArticleOverviewPageBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { CloseButton, SegmentedControl, Select, SimpleGrid, Text, TextInput, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { storyblokEditable } from '@storyblok/react';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import styles from './ArticleOverviewPage.module.scss';

type ApiCategory = {
  key: string;
  name: string;
  url?: string;
  icon?: { src: string; alt?: string };
};

type ApiArticle = {
  key: string;
  title: string;
  url: string;
  image?: { src: string; alt?: string; width?: number; height?: number };
  excerpt?: string;
  categories: ApiCategory[];
};

type ApiResponse = {
  version: 'published' | 'draft';
  articles: ApiArticle[];
  categories: ApiCategory[];
};

const ArticleOverviewPage = ({ blok }: SbComponentProps<ArticleOverviewPageBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;

  const pathname = usePathname();
  const isPreviewPath = pathname === '/sb-preview' || pathname.startsWith('/sb-preview/');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [query, setQuery] = useState('');
  const [categoryKey, setCategoryKey] = useState<string>('all');
  const showCategoryDropdown = useMediaQuery('(max-width: 47.99em)');

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const version = isPreviewPath ? 'draft' : 'published';
        const res = await fetch(`/api/articles?version=${version}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          setError(`Failed to load articles (${res.status})`);
          setData(null);
          return;
        }

        const json = (await res.json()) as ApiResponse;
        setData(json);
      } catch (e) {
        if ((e as any)?.name === 'AbortError') return;
        setError('Failed to load articles');
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [isPreviewPath]);

  const categoryOptions = useMemo(() => {
    const items = (data?.categories ?? []).map((c) => ({ value: c.key, label: c.name }));
    return [{ value: 'all', label: 'All' }, ...items];
  }, [data?.categories]);

  const segmentedCategoryOptions = useMemo(
    () =>
      categoryOptions.map((item) => ({
        value: item.value,
        label: (
          <span className={styles.categoryLabel}>
            <span aria-hidden="true" className={styles.categoryLabelMeasure}>
              {item.label}
            </span>
            <span className={styles.categoryLabelText}>{item.label}</span>
          </span>
        ),
      })),
    [categoryOptions]
  );

  const filteredArticles = useMemo(() => {
    const raw = data?.articles ?? [];
    const q = query.trim().toLowerCase();

    return raw.filter((article) => {
      if (categoryKey !== 'all') {
        const hasCategory = article.categories.some((c) => c.key === categoryKey);
        if (!hasCategory) return false;
      }

      if (!q) return true;

      const haystack = [article.title, article.excerpt, ...article.categories.map((c) => c.name)]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [data?.articles, query, categoryKey]);

  if (!blok.headline) {
    return <section {...editable} className={styles.section} />;
  }

  return (
    <section {...editable} className={styles.section}>
      <header className={styles.header}>
        <Title order={1} fw={800} className={styles.title}>
          {blok.headline}
        </Title>

        <div className={styles.controls}>
          <TextInput
            type="search"
            placeholder="Search for anything"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            className={styles.search}
            classNames={{ input: styles.searchInput }}
            rightSection={
              <div className={styles.searchRightSection}>
                {query ? (
                  <CloseButton
                    variant="transparent"
                    aria-label="Clear search"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => setQuery('')}
                  />
                ) : null}
              </div>
            }
            rightSectionPointerEvents="all"
            rightSectionWidth="calc(3.125rem * var(--mantine-scale))"
          />

          {showCategoryDropdown ? (
            <Select
              value={categoryKey}
              onChange={(value) => setCategoryKey(value ?? 'all')}
              data={categoryOptions}
              allowDeselect={false}
              withScrollArea={false}
              className={styles.categoriesSelect}
              classNames={{
                input: styles.categoriesSelectInput,
                dropdown: styles.categoriesSelectDropdown,
                options: styles.categoriesSelectOptions,
                option: styles.categoriesSelectOption,
                section: styles.categoriesSelectSection,
              }}
              comboboxProps={{ withinPortal: false }}
            />
          ) : (
            <SegmentedControl
              fullWidth
              withItemsBorders={false}
              value={categoryKey}
              onChange={setCategoryKey}
              data={segmentedCategoryOptions}
              className={styles.categories}
            />
          )}
        </div>
      </header>

      <main className={styles.main}>
        {isLoading ? (
          <PageSkeleton mode="content" />
        ) : error ? (
          <Text c="red">{error}</Text>
        ) : filteredArticles.length === 0 ? (
          <Text c="dimmed">No articles match your filters.</Text>
        ) : (
          <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
            spacing="var(--sb-grid-gap-lg)"
            verticalSpacing="var(--sb-grid-gap-lg)"
            className={styles.grid}
          >
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.key}
                href={article.url}
                title={article.title}
                image={article.image?.src ? { src: article.image.src, alt: article.image.alt } : undefined}
                categories={article.categories.map((cat) => ({ key: cat.key, name: cat.name, icon: cat.icon }))}
                onClick={(e) => {
                  if (isEditor) e.preventDefault();
                }}
              />
            ))}
          </SimpleGrid>
        )}
      </main>
    </section>
  );
};

export default ArticleOverviewPage;
