'use client';

import Button from '@/components/Storyblok/Button/Button';
import GridCard from '@/components/Storyblok/GridCard/GridCard';
import ImageCard from '@/components/Storyblok/ImageCard/ImageCard';
import PriceCard from '@/components/Storyblok/PriceCard/PriceCard';
import SectionHeader, { hasSectionHeaderContent } from '@/components/Storyblok/SectionHeader/SectionHeader';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type {
  GridCard as GridCardBlok,
  GridSection as GridSectionBlok,
  ImageCard as ImageCardBlok,
  PriceCard as PriceCardBlok,
} from '@/lib/storyblok/resources/types/storyblok-components';
import { getStoryblokColorClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { Group, SimpleGrid, Stack } from '@mantine/core';
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
  const hasHeader = hasSectionHeaderContent(headlineSegments, blok.lead);
  const hasButtons = buttons.length > 0;
  const hasCards = cards.length > 0;
  const hasContent = hasHeader || hasCards || hasButtons;

  if (!hasContent) {
    return <section {...editable} className={classNames(styles.section, backgroundClass)} />;
  }

  return (
    <section {...editable} className={classNames(styles.section, backgroundClass)}>
      <Stack gap="var(--sb-section-stack-gap)">
        {hasHeader && <SectionHeader headline={headlineSegments} lead={blok.lead} align="center" />}

        {hasCards && (
          <SimpleGrid cols={{ base: 1, sm: Math.ceil(cols / 2), lg: cols }} spacing="xl" className={styles.grid}>
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

        {hasButtons && (
          <div className={styles.actionsWrap}>
            <Group className={styles.actions} justify="center" gap="sm" wrap="wrap">
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
          </div>
        )}
      </Stack>
    </section>
  );
};

export default GridSection;
