'use client';

import { Card, Stack, Text, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import Button from '@/components/Storyblok/Button/Button';
import { renderHeadlineSegments } from '@/components/Storyblok/utils/renderHeadlineSegments';
import type {
  PersonalizedSection as PersonalizedSectionBlok,
  Button as SbButtonBlok,
  HeadlineSegment,
} from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
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
  const hasHeader = Boolean(blok.headline?.length || blok.lead);
  const hasButtons = buttons.length > 0;

  if (!hasHeader && !hasButtons) return null;

  return (
    <section className={styles.section} {...editable}>
      <div className={styles.inner}>
        {hasHeader && (
          <Stack gap="xs">
            {blok.headline?.length ? (
              <Title order={2} size="h2" fw={800}>
                {renderHeadlineSegments(blok.headline)}
              </Title>
            ) : null}
            {blok.lead && <Text className={styles.lead}>{blok.lead}</Text>}
          </Stack>
        )}

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
      </div>
    </section>
  );
};

export default PersonalizedSection;
