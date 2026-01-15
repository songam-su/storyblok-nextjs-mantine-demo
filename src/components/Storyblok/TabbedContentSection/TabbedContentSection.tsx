'use client';

import SectionHeader, { hasSectionHeaderContent } from '@/components/Storyblok/SectionHeader/SectionHeader';
import TabbedContentEntry from '@/components/Storyblok/TabbedContentEntry/TabbedContentEntry';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type {
  TabbedContentSection as TabbedContentSectionBlok,
  TabbedContentEntry as TabbedEntryBlok,
} from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { Stack, Tabs } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import { useEffect, useState } from 'react';
import styles from './TabbedContentSection.module.scss';

const normalizeEntries = (entries?: TabbedEntryBlok[]) => (Array.isArray(entries) ? entries.filter(Boolean) : []);

const TabbedContentSection = ({ blok }: SbComponentProps<TabbedContentSectionBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;

  const entries = normalizeEntries(blok.entries);
  const hasHeader = hasSectionHeaderContent(blok.headline, blok.lead);
  const hasEntries = entries.length > 0;
  const firstEntryKey = entries[0]?._uid || '0';

  const [activeTab, setActiveTab] = useState<string>(firstEntryKey);

  useEffect(() => {
    if (!hasEntries) return;
    const isValid = entries.some((entry) => entry?._uid === activeTab);
    if (!isValid) setActiveTab(firstEntryKey);
  }, [hasEntries, entries, activeTab, firstEntryKey]);

  if (!hasHeader && !hasEntries) return null;

  return (
    <section className={styles.section} {...editable}>
      <Stack className={styles.inner} gap="var(--sb-section-stack-gap)">
        {hasHeader && <SectionHeader headline={blok.headline} lead={blok.lead} className={styles.header} />}

        {hasEntries && (
          <>
            <Tabs
              className={styles.tabs}
              classNames={{
                list: styles.tabsList,
                tab: styles.tabsTab,
              }}
              value={activeTab}
              onChange={(value) => setActiveTab(value || firstEntryKey)}
              variant="pills"
              keepMounted
            >
              <Tabs.List>
                {entries.map((entry) => (
                  <Tabs.Tab key={entry._uid} value={entry._uid}>
                    <span className={styles.tabLabel}>
                      <span aria-hidden="true" className={styles.tabLabelMeasure}>
                        {entry.headline || 'Untitled'}
                      </span>
                      <span className={styles.tabLabelText}>{entry.headline || 'Untitled'}</span>
                    </span>
                  </Tabs.Tab>
                ))}
              </Tabs.List>

              <div className={styles.panels}>
                {entries.map((entry) => (
                  <Tabs.Panel
                    key={entry._uid}
                    value={entry._uid}
                    className={styles.panel}
                    data-sb-active={activeTab === entry._uid}
                  >
                    <TabbedContentEntry blok={entry} _uid={entry._uid} component="tabbed-content-entry" />
                  </Tabs.Panel>
                ))}
              </div>
            </Tabs>
          </>
        )}
      </Stack>
    </section>
  );
};

export default TabbedContentSection;
