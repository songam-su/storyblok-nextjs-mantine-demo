'use client';

import { Text, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import { renderHeadlineSegments } from '@/components/Storyblok/utils/renderHeadlineSegments';
import { getStoryblokColorClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { ProductsSection as ProductsSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import styles from './ProductsSection.module.scss';

const ProductsSection = ({ blok }: SbComponentProps<ProductsSectionBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;
  const pluginValue = (blok as any)?.plugin;
  const hasPlugin = Boolean(pluginValue);
  const backgroundClass = getStoryblokColorClass(
    typeof pluginValue === 'string' ? pluginValue : undefined,
  );

  const hasHeader = Boolean(blok.headline?.length || blok.lead);

  if (!hasHeader && !hasPlugin) {
    return <section {...editable} className={classNames(styles.section, backgroundClass)} />;
  }

  return (
    <section {...editable} className={classNames(styles.section, backgroundClass)}>
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

      {hasPlugin && (
        <div className={styles.pluginBox}>
          Products will render here from the connected Storyblok plugin or integration.
        </div>
      )}
    </section>
  );
};

export default ProductsSection;
