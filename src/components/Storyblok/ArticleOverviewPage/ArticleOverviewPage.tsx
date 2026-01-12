'use client';

import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type { ArticleOverviewPage as ArticleOverviewPageBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { SegmentedControl, SimpleGrid, Text, TextInput, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import Image from 'next/image';
import Link from 'next/link';
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

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [query, setQuery] = useState('');
  const [categoryKey, setCategoryKey] = useState<string>('all');

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const isPreviewPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/sb-preview');
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
  }, []);

  const categoryOptions = useMemo(() => {
    const items = (data?.categories ?? []).map((c) => ({ value: c.key, label: c.name }));
    return [{ value: 'all', label: 'All' }, ...items];
  }, [data?.categories]);

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
          />

          <SegmentedControl
            fullWidth
            value={categoryKey}
            onChange={setCategoryKey}
            data={categoryOptions}
            className={styles.categories}
          />
        </div>
      </header>

      <main className={styles.main}>
        {isLoading ? (
          <Text size="sm" c="dimmed">
            Loading articles…
          </Text>
        ) : error ? (
          <Text size="sm" c="red">
            {error}
          </Text>
        ) : filteredArticles.length === 0 ? (
          <Text size="sm" c="dimmed">
            No articles match your filters.
          </Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" verticalSpacing="xl" className={styles.grid}>
            {filteredArticles.map((article) => (
              <Link
                key={article.key}
                href={article.url}
                className={styles.card}
                onClick={(e) => {
                  if (isEditor) e.preventDefault();
                }}
              >
                {article.image?.src ? (
                  <div className={styles.imageWrap}>
                    <Image
                      src={article.image.src}
                      alt={article.image.alt || ''}
                      fill
                      className={styles.image}
                      sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                ) : null}

                <div className={styles.body}>
                  {article.categories.length > 0 ? (
                    <div className={styles.cardCategories}>
                      {article.categories.map((cat) => (
                        <span key={cat.key} className={styles.cardCategory}>
                          {cat.icon?.src ? (
                            <span className={styles.cardCategoryIconWrap} aria-hidden="true">
                              <Image
                                src={cat.icon.src}
                                alt=""
                                width={18}
                                height={18}
                                className={styles.cardCategoryIcon}
                              />
                            </span>
                          ) : null}
                          <span>{cat.name}</span>
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <Title order={3} className={styles.cardTitle}>
                    {article.title}
                  </Title>

                  {article.excerpt ? <Text className={styles.cardExcerpt}>{article.excerpt}</Text> : null}

                  <div className={styles.cardCta}>
                    <Text fw={600}>Read more</Text>
                  </div>
                </div>
              </Link>
            ))}
          </SimpleGrid>
        )}
      </main>
    </section>
  );
};

export default ArticleOverviewPage;
