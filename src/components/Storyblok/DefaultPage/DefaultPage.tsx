'use client';

import { storyblokEditable } from '@storyblok/react';
import { StoryblokComponentRenderer } from '@/lib/storyblok/rendering/StoryblokComponentRenderer';
import type { StoryblokBlok } from '@/lib/storyblok/registry/StoryblokBlok';
import type { DefaultPage } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import styles from './DefaultPage.module.scss';

const DefaultPage = ({ blok }: SbComponentProps<DefaultPage>) => {
  const editable = storyblokEditable(blok as any);
  const body = ((blok.body ?? []) as StoryblokBlok[]).filter(Boolean);

  if (!body.length) {
    return <div {...editable} className={styles.asContents} />;
  }

  return (
    <div {...editable} className={styles.asContents}>
      {body.map((section, index) => {
        if (!section) return null;
        const key = section._uid ?? `${section.component ?? 'section'}-${index}`;
        return <StoryblokComponentRenderer blok={section} key={key} />;
      })}
    </div>
  );
};

export default DefaultPage;
