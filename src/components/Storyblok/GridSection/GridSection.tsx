'use client';

import Button from '@/components/Storyblok/Button/Button';
import GridCard from '@/components/Storyblok/GridCard/GridCard';
import ImageCard from '@/components/Storyblok/ImageCard/ImageCard';
import PriceCard from '@/components/Storyblok/PriceCard/PriceCard';
import { renderHeadlineSegments } from '@/components/Storyblok/utils/renderHeadlineSegments';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type {
  GridCard as GridCardBlok,
  GridSection as GridSectionBlok,
  ImageCard as ImageCardBlok,
  PriceCard as PriceCardBlok,
} from '@/lib/storyblok/resources/types/storyblok-components';
import { getStoryblokColorClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import styles from './GridSection.module.scss';

const GridSection = ({ blok }: SbComponentProps<GridSectionBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;
  const backgroundClass = getStoryblokColorClass(blok.background_color as string | undefined);
  const cols = Math.min(Math.max(parseInt(String(blok.cols ?? '3'), 10) || 3, 1), 4);

  const cards = Array.isArray(blok.cards) ? blok.cards.filter(Boolean) : [];
  const buttons = Array.isArray(blok.button) ? blok.button.filter(Boolean) : [];
  const headlineSegments = Array.isArray(blok.headline)
    ? blok.headline.filter((segment) => Boolean(segment?.text?.trim()))
    : [];
  const hasHeadline = headlineSegments.length > 0;
  const hasLead = typeof blok.lead === 'string' && blok.lead.trim().length > 0;
  const hasHeader = hasHeadline || hasLead;
  const hasHeaderRow = hasHeader || buttons.length > 0;
  const hasContent = hasHeaderRow || cards.length > 0;

  if (!hasContent) {
    return <section {...editable} className={classNames(styles.section, backgroundClass)} />;
  }

  return (
    <section {...editable} className={classNames(styles.section, backgroundClass)}>
      <Stack gap={hasHeaderRow && cards.length > 0 ? 'md' : 0}>
        {hasHeaderRow && (
          <div className={styles.headerRow}>
            {hasHeader ? (
              <div className={styles.header}>
                {hasHeadline ? (
                  <Title order={2} fw={800}>
                    {renderHeadlineSegments(headlineSegments)}
                  </Title>
                ) : null}
                {hasLead && (
                  <Text size="lg" className={styles.lead}>
                    {blok.lead}
                  </Text>
                )}
              </div>
            ) : (
              <div />
            )}

            {buttons.length > 0 && (
              <Group className={styles.actions} gap="sm">
                {buttons.map((btn) => (
                  <Button
                    key={btn._uid}
                    blok={btn}
                    _uid={btn._uid}
                    component={btn.component}
                    storyblokEditable={isEditor ? storyblokEditable(btn as any) : undefined}
                  />
                ))}
              </Group>
            )}
          </div>
        )}

        {cards.length > 0 && (
          <SimpleGrid
            cols={{ base: 1, sm: Math.ceil(cols / 2), lg: cols }}
            spacing="lg"
            className={styles.grid}
            mx={{ base: 0, md: '4rem', lg: '0' }}
          >
            {cards.map((card, index) => {
              if (!card) return null;

              if (card.component === 'grid-card') {
                return (
                  <GridCard
                    key={card._uid ?? `card-${index}`}
                    blok={card as GridCardBlok}
                    _uid={card._uid}
                    component={card.component}
                  />
                );
              }

              if (card.component === 'price-card') {
                return (
                  <PriceCard
                    key={card._uid ?? `card-${index}`}
                    blok={card as PriceCardBlok}
                    _uid={card._uid}
                    component={card.component}
                  />
                );
              }

              if (card.component === 'image-card') {
                return (
                  <ImageCard
                    key={card._uid ?? `card-${index}`}
                    blok={card as ImageCardBlok}
                    _uid={card._uid}
                    component={card.component}
                  />
                );
              }

              return null;
            })}
          </SimpleGrid>
        )}
      </Stack>
    </section>
  );
};

export default GridSection;
