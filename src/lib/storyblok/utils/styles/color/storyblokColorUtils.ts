import colorStyles from './StoryblokColors.module.scss';

const STORYBLOK_COLOR_KEYS = [
  'primary-highlight',
  'highlight-1',
  'highlight-2',
  'highlight-3',
  'primary-dark',
  'white',
  'primary-background',
  'background-1',
  'background-2',
  'background-3',
  'background-4',
  'background-5',
  'background-6',
  'background-7',
  'background-8',
  'background-9',
  'background-10',
  'color_1',
  'color_2',
  'color_3',
] as const;

export type StoryblokColorKey = (typeof STORYBLOK_COLOR_KEYS)[number];

export const STORYBLOK_COLOR_GROUPS = ['cta', 'highlight', 'surface-dark', 'surface-light'] as const;

export type StoryblokColorGroup = (typeof STORYBLOK_COLOR_GROUPS)[number];

export type StoryblokButtonTextColor = 'white' | 'primary-dark';

type StoryblokColorMeta = {
  className: string;
  highlightClassName?: string;
  groups?: StoryblokColorGroup[];
};

const COLOR_META: Record<StoryblokColorKey, StoryblokColorMeta> = {
  'primary-highlight': {
    className: colorStyles['primary-highlight'],
    highlightClassName: colorStyles['highlight-text-primary-highlight'],
    groups: ['cta', 'highlight'],
  },
  'highlight-1': {
    className: colorStyles['highlight-1'],
    highlightClassName: colorStyles['highlight-text-highlight-1'],
    groups: ['cta', 'highlight'],
  },
  'highlight-2': {
    className: colorStyles['highlight-2'],
    highlightClassName: colorStyles['highlight-text-highlight-2'],
    groups: ['cta', 'highlight'],
  },
  'highlight-3': {
    className: colorStyles['highlight-3'],
    highlightClassName: colorStyles['highlight-text-highlight-3'],
    groups: ['cta', 'highlight'],
  },
  'primary-dark': {
    className: colorStyles['primary-dark'],
    groups: ['cta', 'surface-dark'],
  },
  white: {
    className: colorStyles.white,
    groups: ['surface-light'],
  },
  'primary-background': {
    className: colorStyles['primary-background'],
    groups: ['surface-dark'],
  },
  'background-1': {
    className: colorStyles['background-1'],
    groups: ['surface-dark'],
  },
  'background-2': {
    className: colorStyles['background-2'],
    groups: ['surface-dark'],
  },
  'background-3': {
    className: colorStyles['background-3'],
    groups: ['surface-dark'],
  },
  'background-4': {
    className: colorStyles['background-4'],
    groups: ['surface-dark'],
  },
  'background-5': {
    className: colorStyles['background-5'],
    groups: ['surface-dark'],
  },
  'background-6': {
    className: colorStyles['background-6'],
    groups: ['surface-dark'],
  },
  'background-7': {
    className: colorStyles['background-7'],
    groups: ['surface-dark'],
  },
  'background-8': {
    className: colorStyles['background-8'],
    groups: ['surface-light'],
  },
  'background-9': {
    className: colorStyles['background-9'],
    groups: ['surface-light'],
  },
  'background-10': {
    className: colorStyles['background-10'],
    groups: ['surface-light'],
  },
  color_1: {
    className: colorStyles['highlight-1'],
    highlightClassName: colorStyles['highlight-text-color_1'] ?? colorStyles['highlight-text-highlight-1'],
    groups: ['cta', 'highlight'],
  },
  color_2: {
    className: colorStyles['highlight-2'],
    highlightClassName: colorStyles['highlight-text-color_2'] ?? colorStyles['highlight-text-highlight-2'],
    groups: ['cta', 'highlight'],
  },
  color_3: {
    className: colorStyles['highlight-3'],
    highlightClassName: colorStyles['highlight-text-color_3'] ?? colorStyles['highlight-text-highlight-3'],
    groups: ['cta', 'highlight'],
  },
};

const COLOR_GROUP_INDEX = STORYBLOK_COLOR_GROUPS.reduce(
  (acc, group) => {
    acc[group] = STORYBLOK_COLOR_KEYS.filter((key) => COLOR_META[key].groups?.includes(group));
    return acc;
  },
  {} as Record<StoryblokColorGroup, StoryblokColorKey[]>
);

const COLOR_GROUP_LOOKUP = STORYBLOK_COLOR_GROUPS.reduce(
  (acc, group) => {
    acc[group] = new Set(COLOR_GROUP_INDEX[group]);
    return acc;
  },
  {} as Record<StoryblokColorGroup, Set<StoryblokColorKey>>
);

const TEXT_COLOR_CLASS_MAP: Record<StoryblokButtonTextColor, string | undefined> = {
  white: colorStyles['text-white'],
  'primary-dark': colorStyles['text-primary-dark'],
};

export const getStoryblokColorClass = (key?: string) =>
  key ? COLOR_META[key as StoryblokColorKey]?.className : undefined;

export const getStoryblokHighlightClass = (key?: string) =>
  key ? COLOR_META[key as StoryblokColorKey]?.highlightClassName : undefined;

export const getStoryblokTextColorClass = (key?: string) =>
  key ? TEXT_COLOR_CLASS_MAP[key as StoryblokButtonTextColor] : undefined;

export const getStoryblokColorKeysByGroup = (group: StoryblokColorGroup) => COLOR_GROUP_INDEX[group] ?? [];

export const getStoryblokDefaultColorForGroup = (group: StoryblokColorGroup, fallback?: StoryblokColorKey) =>
  COLOR_GROUP_INDEX[group]?.[0] ?? fallback;

export const isStoryblokColorInGroup = (key: string | undefined, group: StoryblokColorGroup) =>
  key ? COLOR_GROUP_LOOKUP[group].has(key as StoryblokColorKey) : false;
