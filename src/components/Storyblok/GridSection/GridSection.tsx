'use client';

import { Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import Button from '@/components/Storyblok/Button/Button';
import GridCard from '@/components/Storyblok/GridCard/GridCard';
import { renderHeadlineSegments } from '@/components/Storyblok/utils/renderHeadlineSegments';
import { getStoryblokColorClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { GridCard as GridCardBlok, GridSection as GridSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import styles from './GridSection.module.scss';

const GridSection = ({ blok }: SbComponentProps<GridSectionBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;
  const backgroundClass = getStoryblokColorClass(blok.background_color as string | undefined);
  const cols = Math.min(Math.max(parseInt(String(blok.cols ?? '3'), 10) || 3, 1), 4);

  const cards = Array.isArray(blok.cards) ? blok.cards.filter(Boolean) : [];
  const buttons = Array.isArray(blok.button) ? blok.button.filter(Boolean) : [];
  const hasHeader = Boolean(blok.headline?.length || blok.lead);
  const hasContent = hasHeader || cards.length > 0 || buttons.length > 0;

  if (!hasContent) {
    return <section {...editable} className={classNames(styles.section, backgroundClass)} />;
  }

  return (
    <section {...editable} className={classNames(styles.section, backgroundClass)}>
      <Stack gap="md">
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

        {cards.length > 0 && (
          <SimpleGrid cols={cols} spacing="lg" className={styles.grid}>
            {cards.map((card, index) => {
              if (!card) return null;
              if (card.component !== 'grid-card') return null; // ignore unimplemented card types for now
              return <GridCard key={card._uid ?? `card-${index}`} blok={card as GridCardBlok} _uid={card._uid} component={card.component} />;
            })}
          </SimpleGrid>
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
      </Stack>
    </section>
  );
};

export default GridSection;
