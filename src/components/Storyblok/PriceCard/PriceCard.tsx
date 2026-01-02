'use client';

import { Badge, Stack, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import { renderSbRichText } from '@/lib/storyblok/utils/richtext/renderSbRichText';
import type { PriceCard as PriceCardBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import Button from '@/components/Storyblok/Button/Button';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import styles from './PriceCard.module.scss';

const PriceCard = ({ blok }: SbComponentProps<PriceCardBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;
  const hasRichTop = Boolean(blok.text_1);
  const hasRichBottom = Boolean(blok.text_2);
  const hasButtons = Array.isArray(blok.button) && blok.button.length > 0;

  return (
    <article
      {...editable}
      className={classNames(styles.card, blok.most_popular && styles.popular)}
      aria-label={blok.headline || 'Price card'}
    >
      <Stack gap="sm" className={styles.header}>
        {blok.most_popular && (
          <Badge color="blue" variant="light" className={styles.badge}>
            Most popular
          </Badge>
        )}

        {blok.headline && (
          <Title order={3} fw={800} m={0}>
            {blok.headline}
          </Title>
        )}

        {blok.price && (
          <p className={styles.price}>
            {blok.price}
          </p>
        )}
      </Stack>

      <div className={styles.body}>
        {hasRichTop && <div>{renderSbRichText(blok.text_1)}</div>}
        {hasButtons && (
          <div className={styles.actions}>
            {blok.button!.map((btn) => {
              if (!btn) return null;
              return (
                <Button
                  key={btn._uid}
                  blok={btn}
                  _uid={btn._uid}
                  component={btn.component}
                  storyblokEditable={isEditor ? storyblokEditable(btn as any) : undefined}
                />
              );
            })}
          </div>
        )}
        {hasRichBottom && <div>{renderSbRichText(blok.text_2)}</div>}
      </div>
    </article>
  );
};

export default PriceCard;
