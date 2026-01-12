'use client';

import Button from '@/components/Storyblok/Button/Button';
import SectionHeader, { hasSectionHeaderContent } from '@/components/Storyblok/SectionHeader/SectionHeader';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type {
  HeadlineSegment,
  PersonalizedSection as PersonalizedSectionBlok,
  Button as SbButtonBlok,
} from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { Card, Stack } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import styles from './PersonalizedSection.module.scss';

type PersonalizedSectionContent = PersonalizedSectionBlok & {
  headline?: HeadlineSegment[];
  lead?: string;
  buttons?: SbButtonBlok[];
};

const normalizeCards = (buttons?: PersonalizedSectionContent['buttons']) =>
  Array.isArray(buttons) ? buttons.filter(Boolean) : [];

const PersonalizedSection = ({ blok }: SbComponentProps<PersonalizedSectionContent>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;

  const buttons = normalizeCards(blok.buttons as any); // Storyblok type may differ; we use Button blok entries
  const hasHeader = hasSectionHeaderContent(blok.headline, blok.lead);
  const hasButtons = buttons.length > 0;

  if (!hasHeader && !hasButtons) return null;

  return (
    <section className={styles.section} {...editable}>
      <Stack className={styles.inner} gap="var(--sb-section-stack-gap)">
        {hasHeader && <SectionHeader headline={blok.headline} lead={blok.lead} />}

        {hasButtons && (
          <div className={styles.cards}>
            {buttons.map((btn) => (
              <Card key={btn._uid} className={styles.card} shadow="sm" radius="lg" withBorder={false}>
                <Button
                  blok={btn}
                  _uid={btn._uid}
                  component={btn.component}
                  storyblokEditable={isEditor ? storyblokEditable(btn as any) : undefined}
                />
              </Card>
            ))}
          </div>
        )}
      </Stack>
    </section>
  );
};

export default PersonalizedSection;
