'use client';

import { FaqEntryContent } from '@/components/Storyblok/FaqEntry/FaqEntryContent';
import { renderHeadlineSegments } from '@/components/Storyblok/utils/renderHeadlineSegments';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import {
  FaqEntry as FaqEntryBlok,
  FaqSection as FaqSectionBlok,
} from '@/lib/storyblok/resources/types/storyblok-components';
import { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { Accordion, Paper, Stack, Text, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import styles from './FaqSection.module.scss';

const getAccordionValue = (entry: FaqEntryBlok, index: number) => entry._uid ?? entry.question ?? `faq-${index}`;

const FaqSection: React.FC<SbComponentProps<FaqSectionBlok>> = ({ blok }) => {
  const { isEditor } = useStoryblokEditor();
  const editableAttributes = isEditor ? storyblokEditable(blok as any) : undefined;
  const entries = blok.faq_entries ?? [];

  const hasHeader = Boolean(blok.headline?.length || blok.lead);
  const hasEntries = entries.length > 0;

  if (!hasHeader && !hasEntries) {
    return null;
  }

  return (
    <Paper component="section" className={styles.section} radius="sm" {...editableAttributes}>
      <Stack>
        {hasHeader && (
          <div className={styles.headerRow}>
            {hasHeader ? (
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
            ) : (
              <div />
            )}
          </div>
        )}

        {hasEntries && (
          <Accordion
            className={styles.accordion}
            radius="lg"
            chevronPosition="right"
            defaultValue={getAccordionValue(entries[0], 0)}
            mt="1rem"
            mx={{ base: 0, md: '4rem', xl: '0' }}
          >
            {entries.map((entry, index) => {
              if (!entry) return null;
              const value = getAccordionValue(entry, index);
              const entryEditableAttributes = isEditor ? storyblokEditable(entry as any) : undefined;

              return (
                <Accordion.Item key={value} value={value} {...entryEditableAttributes}>
                  <Accordion.Control>{entry.question ?? 'Untitled question'}</Accordion.Control>
                  <Accordion.Panel>
                    <FaqEntryContent question={entry.question} answer={entry.answer} showQuestion={false} />
                  </Accordion.Panel>
                </Accordion.Item>
              );
            })}
          </Accordion>
        )}
      </Stack>
    </Paper>
  );
};

export default FaqSection;
