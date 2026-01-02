'use client';

import { Badge, Stack, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import Image from 'next/image';
import { renderSbRichText } from '@/lib/storyblok/utils/richtext/renderSbRichText';
import getSbImageData from '@/lib/storyblok/utils/image';
import type { ArticlePage as ArticlePageBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import styles from './ArticlePage.module.scss';

const ArticlePage = ({ blok }: SbComponentProps<ArticlePageBlok>) => {
  const editable = storyblokEditable(blok as any);
  const imageData = getSbImageData(blok.image || null);
  const hasImage = Boolean(imageData?.src);
  const categories = Array.isArray(blok.categories) ? blok.categories : [];

  return (
    <article {...editable} className={styles.section}>
      <Stack gap="md" className={styles.header}>
        {blok.headline && (
          <Title order={1} fw={800}>
            {blok.headline}
          </Title>
        )}

        {categories.length > 0 && (
          <div className={styles.categories}>
            {categories.map((cat, idx) => (
              <Badge key={cat?.uuid ?? idx} variant="light" color="gray">
                {typeof cat === 'string' ? cat : cat?.name || cat?.slug || 'Category'}
              </Badge>
            ))}
          </div>
        )}
      </Stack>

      {hasImage && (
        <div className={styles.media}>
          <Image
            src={imageData!.src}
            alt={imageData!.alt || ''}
            width={imageData?.width || 1600}
            height={imageData?.height || 900}
            sizes="(min-width: 1024px) 960px, 100vw"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              ...(imageData?.objectPosition ? { objectPosition: imageData.objectPosition } : {}),
            }}
            priority={false}
          />
        </div>
      )}

      {blok.text && <div className={classNames(styles.body)}>{renderSbRichText(blok.text)}</div>}
    </article>
  );
};

export default ArticlePage;
