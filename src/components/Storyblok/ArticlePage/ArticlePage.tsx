'use client';

import SbImage from '@/components/ui/SbImage/SbImage';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type { ArticlePage as ArticlePageBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import getSbImageData from '@/lib/storyblok/utils/image';
import { renderSbRichText } from '@/lib/storyblok/utils/richtext/renderSbRichText';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { Badge, Stack, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import styles from './ArticlePage.module.scss';

const ArticlePage = ({ blok }: SbComponentProps<ArticlePageBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;
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
              <Badge key={typeof cat === 'string' ? idx : (cat?.uuid ?? idx)} variant="light" color="gray">
                {typeof cat === 'string' ? cat : cat?.name || cat?.slug || 'Category'}
              </Badge>
            ))}
          </div>
        )}
      </Stack>

      {hasImage && (
        <div className={styles.media}>
          <SbImage
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
