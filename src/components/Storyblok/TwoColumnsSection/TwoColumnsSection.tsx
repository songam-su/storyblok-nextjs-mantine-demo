'use client';

import classNames from 'classnames';
import { Group, Stack, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import Button from '@/components/Storyblok/Button/Button';
import { renderHeadlineSegments } from '@/components/Storyblok/utils/renderHeadlineSegments';
import { renderSbRichText } from '@/lib/storyblok/utils/richtext/renderSbRichText';
import { getStoryblokColorClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { TwoColumnsSection as TwoColumnsSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import styles from './TwoColumnsSection.module.scss';

const TwoColumnsSection = ({ blok }: SbComponentProps<TwoColumnsSectionBlok>) => {
  const editable = storyblokEditable(blok as any);

  const columns = [
    {
      headline: blok.column_1_headline,
      text1: blok.column_1_text_1,
      text2: blok.column_1_text_2,
      buttons: blok.column_1_button,
      background: blok.column_1_background_color,
      decoration: blok.column_1_decoration_color,
    },
    {
      headline: blok.column_2_headline,
      text1: blok.column_2_text_1,
      text2: undefined,
      buttons: blok.column_2_button,
      background: blok.column_2_background_color,
      decoration: blok.column_2_decoration_color,
    },
  ];

  const hasContent = columns.some((col) =>
    Boolean(col.headline?.length || col.text1 || col.text2 || (col.buttons?.length ?? 0) > 0)
  );

  if (!hasContent) {
    return <section {...editable} className={styles.section} />;
  }

  return (
    <section {...editable} className={styles.section}>
      {columns.map((col, idx) => {
        const backgroundClass = getStoryblokColorClass(col.background as string | undefined);
        const decorationClass = getStoryblokColorClass(col.decoration as string | undefined);
        const showDecoration = Boolean(decorationClass);
        const hasButtons = Array.isArray(col.buttons) && col.buttons.length > 0;

        const columnContent = Boolean(col.headline?.length || col.text1 || col.text2 || hasButtons);

        if (!columnContent) return null;

        return (
          <div key={idx} className={classNames(styles.column, backgroundClass)}>
            <Stack gap="sm" className={styles.content}>
              {col.headline?.length ? (
                <Title order={3} fw={800} className={styles.title}>
                  {renderHeadlineSegments(col.headline)}
                </Title>
              ) : null}

              {col.text1 && <div>{renderSbRichText(col.text1)}</div>}
              {col.text2 && <div>{renderSbRichText(col.text2)}</div>}

              {hasButtons && (
                <Group gap="sm" className={styles.actions}>
                  {col.buttons!.map((btn) => {
                    if (!btn) return null;
                    return (
                      <Button
                        key={btn._uid}
                        blok={btn}
                        _uid={btn._uid}
                        component={btn.component}
                        storyblokEditable={storyblokEditable(btn as any)}
                      />
                    );
                  })}
                </Group>
              )}
            </Stack>

            {showDecoration && <div className={classNames(styles.decoration, decorationClass)} />}
          </div>
        );
      })}
    </section>
  );
};

export default TwoColumnsSection;
