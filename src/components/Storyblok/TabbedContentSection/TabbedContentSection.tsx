'use client';

import { Tabs, Stack, Text, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import TabbedContentEntry from '@/components/Storyblok/TabbedContentEntry/TabbedContentEntry';
import { renderHeadlineSegments } from '@/components/Storyblok/utils/renderHeadlineSegments';
import type { TabbedContentSection as TabbedContentSectionBlok, TabbedContentEntry as TabbedEntryBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import styles from './TabbedContentSection.module.scss';

const normalizeEntries = (entries?: TabbedEntryBlok[]) => (Array.isArray(entries) ? entries.filter(Boolean) : []);

const TabbedContentSection = ({ blok }: SbComponentProps<TabbedContentSectionBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;

  const entries = normalizeEntries(blok.entries);
  const hasHeader = Boolean(blok.headline?.length || blok.lead);
  const hasEntries = entries.length > 0;

  if (!hasHeader && !hasEntries) return null;

  return (
    <section className={styles.section} {...editable}>
      <Stack gap="md" className={styles.header}>
        {blok.headline?.length ? (
          <Title order={2} fw={800} size="h2">
            {renderHeadlineSegments(blok.headline)}
          </Title>
        ) : null}

        {blok.lead && (
          <Text size="lg" className={styles.lead}>
            {blok.lead}
          </Text>
        )}
      </Stack>

      {hasEntries && (
        <Tabs className={styles.tabs} defaultValue={entries[0]._uid || '0'} variant="pills">
          <Tabs.List>
            {entries.map((entry) => (
              <Tabs.Tab key={entry._uid} value={entry._uid}>
                {entry.headline || 'Untitled'}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {entries.map((entry) => (
            <Tabs.Panel key={entry._uid} value={entry._uid} pt="md">
              <TabbedContentEntry blok={entry} _uid={entry._uid} component="tabbed-content-entry" />
            </Tabs.Panel>
          ))}
        </Tabs>
      )}
    </section>
  );
};

export default TabbedContentSection;
