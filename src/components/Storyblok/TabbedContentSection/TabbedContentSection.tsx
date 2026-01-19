'use client';

import SectionHeader, { hasSectionHeaderContent } from '@/components/Storyblok/SectionHeader/SectionHeader';
import TabbedContentEntry from '@/components/Storyblok/TabbedContentEntry/TabbedContentEntry';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type {
  TabbedContentSection as TabbedContentSectionBlok,
  TabbedContentEntry as TabbedEntryBlok,
} from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { Accordion, SegmentedControl, Stack, Tabs } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './TabbedContentSection.module.scss';

const normalizeEntries = (entries?: TabbedEntryBlok[]) => (Array.isArray(entries) ? entries.filter(Boolean) : []);

const getEntryLabel = (entry: TabbedEntryBlok) => {
  const headline = typeof entry.headline === 'string' ? entry.headline.trim() : '';
  return headline.length ? headline : 'Untitled';
};

type MobileNavMode = 'tabs' | 'segmented' | 'accordion' | 'none';

const MOBILE_SEGMENTED_MAX = 5;
const MOBILE_ACCORDION_MIN = 6;

const TabbedContentSection = ({ blok }: SbComponentProps<TabbedContentSectionBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;

  const entries = useMemo(() => normalizeEntries(blok.entries), [blok.entries]);
  const hasHeader = hasSectionHeaderContent(blok.headline, blok.lead);
  const hasEntries = entries.length > 0;
  const firstEntryKey = entries[0]?._uid || '0';

  const [activeTab, setActiveTab] = useState<string>(firstEntryKey);

  const isMobile = useMediaQuery('(max-width: 48em)');
  const enableSticky = isMobile;

  const mobileNavMode: MobileNavMode = useMemo(() => {
    if (!isMobile) return 'tabs';
    if (entries.length <= 1) return 'none';
    if (entries.length >= MOBILE_ACCORDION_MIN) return 'accordion';
    if (entries.length <= MOBILE_SEGMENTED_MAX) return 'segmented';
    return 'tabs';
  }, [isMobile, entries.length]);

  const activeEntry = useMemo(() => {
    if (!entries.length) return null;
    return entries.find((entry) => entry?._uid === activeTab) ?? entries[0] ?? null;
  }, [entries, activeTab]);

  const stickySentinelRef = useRef<HTMLDivElement | null>(null);
  const tabsScrollRef = useRef<HTMLDivElement | null>(null);
  const segmentedScrollRef = useRef<HTMLDivElement | null>(null);
  const [isStuck, setIsStuck] = useState(false);
  const [stickyTop, setStickyTop] = useState(0);

  useEffect(() => {
    if (!hasEntries) return;
    const isValid = entries.some((entry) => entry?._uid === activeTab);
    if (!isValid) setActiveTab(firstEntryKey);
  }, [hasEntries, entries, activeTab, firstEntryKey]);

  useEffect(() => {
    if (!enableSticky) {
      setStickyTop(0);
      return;
    }

    if (typeof window === 'undefined') return;
    const headerEl = document.querySelector('header');
    if (!headerEl) return;

    const updateTop = () => {
      const height = headerEl.getBoundingClientRect().height;
      // Use floor() to avoid tiny subpixel gaps between the header and the sticky nav.
      setStickyTop(Number.isFinite(height) ? Math.floor(height) : 0);
    };

    updateTop();
    const resizeObserver = new ResizeObserver(() => updateTop());
    resizeObserver.observe(headerEl);
    window.addEventListener('resize', updateTop);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateTop);
    };
  }, [enableSticky]);

  useEffect(() => {
    if (!enableSticky) {
      setIsStuck(false);
      return;
    }

    const sentinel = stickySentinelRef.current;
    if (!sentinel || typeof window === 'undefined') return;

    const safeStickyTop = Number.isFinite(stickyTop) ? Math.max(0, stickyTop) : 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting);
      },
      {
        // Consider the header height so the “stuck” background turns on as soon as
        // the nav reaches its sticky position (below the header), not after it scrolls past.
        rootMargin: `${-safeStickyTop}px 0px 0px 0px`,
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [enableSticky, mobileNavMode, stickyTop]);

  useEffect(() => {
    if (!isMobile) return;
    if (mobileNavMode !== 'segmented' && mobileNavMode !== 'tabs') return;
    const activeIndex = entries.findIndex((entry) => entry?._uid === activeTab);
    if (activeIndex < 0) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

    const align: ScrollLogicalPosition =
      activeIndex === 0 ? 'start' : activeIndex === entries.length - 1 ? 'end' : 'center';

    const container = mobileNavMode === 'segmented' ? segmentedScrollRef.current : tabsScrollRef.current;
    if (!container) return;

    const selector = mobileNavMode === 'segmented' ? `.${styles.segmentedControl}` : `.${styles.tabsTab}`;
    const controls = Array.from(container.querySelectorAll<HTMLElement>(selector));
    const activeEl = controls[activeIndex];
    if (!activeEl) return;

    // Only scroll the horizontal container. `scrollIntoView` can scroll the page vertically
    // (especially on viewport resize), which creates the “page jumps / won’t reach top” behavior.
    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    if (maxScrollLeft <= 0) return;

    const activeLeft = activeRect.left - containerRect.left + container.scrollLeft;
    const activeRight = activeLeft + activeRect.width;

    let targetLeft = container.scrollLeft;
    if (align === 'start') {
      targetLeft = activeLeft;
    } else if (align === 'end') {
      targetLeft = activeRight - container.clientWidth;
    } else {
      targetLeft = activeLeft - (container.clientWidth - activeRect.width) / 2;
    }

    targetLeft = Math.max(0, Math.min(targetLeft, maxScrollLeft));
    container.scrollTo({ left: targetLeft, behavior });
  }, [activeTab, entries, isMobile, mobileNavMode]);

  if (!hasHeader && !hasEntries) return null;

  return (
    <section className={styles.section} {...editable}>
      <Stack className={styles.inner} gap="var(--sb-section-stack-gap)">
        {hasHeader && <SectionHeader headline={blok.headline} lead={blok.lead} className={styles.header} />}

        {hasEntries && mobileNavMode === 'accordion' ? (
          <Accordion
            className={styles.accordion}
            classNames={{
              item: styles.accordionItem,
              control: styles.accordionControl,
              label: styles.accordionLabel,
              panel: styles.accordionPanel,
              content: styles.accordionContent,
            }}
            radius="lg"
            chevronPosition="right"
            value={activeTab}
            onChange={(value) => setActiveTab(value || firstEntryKey)}
          >
            {entries.map((entry) => {
              if (!entry) return null;
              return (
                <Accordion.Item key={entry._uid} value={entry._uid}>
                  <Accordion.Control>{getEntryLabel(entry)}</Accordion.Control>
                  <Accordion.Panel>
                    <TabbedContentEntry blok={entry} _uid={entry._uid} component="tabbed-content-entry" />
                  </Accordion.Panel>
                </Accordion.Item>
              );
            })}
          </Accordion>
        ) : null}

        {hasEntries && mobileNavMode === 'segmented' ? (
          <div>
            <div ref={stickySentinelRef} className={styles.stickySentinel} aria-hidden="true" />
            <div
              className={classNames(styles.nav, enableSticky && isStuck && styles.navStuck)}
              style={enableSticky ? ({ ['--sb-sticky-top' as any]: `${stickyTop}px` } as any) : undefined}
            >
              <div ref={segmentedScrollRef} className={styles.segmentedScroller}>
                <SegmentedControl
                  className={styles.segmented}
                  classNames={{
                    root: styles.segmentedRoot,
                    control: styles.segmentedControl,
                    label: styles.segmentedLabel,
                    indicator: styles.segmentedIndicator,
                  }}
                  radius="sm"
                  size="sm"
                  value={activeTab}
                  onChange={(value) => setActiveTab(value || firstEntryKey)}
                  data={entries.map((entry) => ({ value: entry._uid, label: getEntryLabel(entry) }))}
                />
              </div>
            </div>

            {activeEntry ? (
              <div className={styles.segmentedPanel}>
                <TabbedContentEntry blok={activeEntry} _uid={activeEntry._uid} component="tabbed-content-entry" />
              </div>
            ) : null}
          </div>
        ) : null}

        {hasEntries && (mobileNavMode === 'tabs' || mobileNavMode === 'none') ? (
          <>
            {mobileNavMode === 'tabs' ? (
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
                  <div ref={stickySentinelRef} className={styles.stickySentinel} aria-hidden="true" />
                  <div
                    className={classNames(styles.nav, enableSticky && isStuck && styles.navStuck)}
                    style={enableSticky ? ({ ['--sb-sticky-top' as any]: `${stickyTop}px` } as any) : undefined}
                  >
                    <div ref={tabsScrollRef} className={styles.tabsListViewport}>
                      <Tabs.List>
                        {entries.map((entry) => (
                          <Tabs.Tab key={entry._uid} value={entry._uid}>
                            <span className={styles.tabLabel}>
                              <span aria-hidden="true" className={styles.tabLabelMeasure}>
                                {getEntryLabel(entry)}
                              </span>
                              <span className={styles.tabLabelText}>{getEntryLabel(entry)}</span>
                            </span>
                          </Tabs.Tab>
                        ))}
                      </Tabs.List>
                    </div>
                  </div>

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
            ) : (
              activeEntry && (
                <TabbedContentEntry blok={activeEntry} _uid={activeEntry._uid} component="tabbed-content-entry" />
              )
            )}
          </>
        ) : null}
      </Stack>
    </section>
  );
};

export default TabbedContentSection;
