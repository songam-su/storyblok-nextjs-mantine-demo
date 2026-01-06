import type { CSSProperties } from 'react';

export const STORYBLOK_ALIGNMENT_KEYS = ['left', 'center', 'right'] as const;

export type StoryblokAlignmentKey = (typeof STORYBLOK_ALIGNMENT_KEYS)[number];

const DEFAULT_ALIGNMENT: StoryblokAlignmentKey = 'left';

export type StoryblokAlignmentMeta = {
  key: StoryblokAlignmentKey;
  textAlign: NonNullable<CSSProperties['textAlign']>;
  alignItems: CSSProperties['alignItems'];
  justifyContent: CSSProperties['justifyContent'];
};

const ALIGNMENT_META: Record<StoryblokAlignmentKey, StoryblokAlignmentMeta> = {
  left: {
    key: 'left',
    textAlign: 'left',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  center: {
    key: 'center',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    key: 'right',
    textAlign: 'right',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
};

const normalizeStoryblokAlignment = (key?: string): StoryblokAlignmentKey => {
  if (!key) return DEFAULT_ALIGNMENT;
  return STORYBLOK_ALIGNMENT_KEYS.includes(key as StoryblokAlignmentKey)
    ? (key as StoryblokAlignmentKey)
    : DEFAULT_ALIGNMENT;
};

export const getStoryblokAlignmentMeta = (key?: string): StoryblokAlignmentMeta => {
  const normalized = normalizeStoryblokAlignment(key);
  return ALIGNMENT_META[normalized];
};
