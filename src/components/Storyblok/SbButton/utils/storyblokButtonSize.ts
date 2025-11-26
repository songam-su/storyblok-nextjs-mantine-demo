import type { MantineSize } from '@mantine/core';

export const STORYBLOK_BUTTON_SIZES = ['small', 'medium', 'large'] as const;

export type StoryblokButtonSizeKey = (typeof STORYBLOK_BUTTON_SIZES)[number];

const DEFAULT_BUTTON_SIZE: StoryblokButtonSizeKey = 'medium';

export type StoryblokButtonSizeMeta = {
  key: StoryblokButtonSizeKey;
  mantineSize: MantineSize;
};

const BUTTON_SIZE_META: Record<StoryblokButtonSizeKey, StoryblokButtonSizeMeta> = {
  small: {
    key: 'small',
    mantineSize: 'sm',
  },
  medium: {
    key: 'medium',
    mantineSize: 'md',
  },
  large: {
    key: 'large',
    mantineSize: 'lg',
  },
};

const normalizeStoryblokButtonSize = (size?: string): StoryblokButtonSizeKey => {
  if (!size) return DEFAULT_BUTTON_SIZE;
  return STORYBLOK_BUTTON_SIZES.includes(size as StoryblokButtonSizeKey)
    ? (size as StoryblokButtonSizeKey)
    : DEFAULT_BUTTON_SIZE;
};

export const getStoryblokButtonSizeMeta = (size?: string): StoryblokButtonSizeMeta => {
  const normalized = normalizeStoryblokButtonSize(size);
  return BUTTON_SIZE_META[normalized];
};

export const getStoryblokButtonMantineSize = (size?: string): MantineSize =>
  getStoryblokButtonSizeMeta(size).mantineSize;
