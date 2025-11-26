import colorStyles from '../styles/StoryblokColors.module.scss';

const COLOR_KEYS = [
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

export type StoryblokColorKey = (typeof COLOR_KEYS)[number];

export const STORYBLOK_COLOR_GROUPS = ['cta', 'highlight', 'surface-dark', 'surface-light'] as const;

export type StoryblokColorGroup = (typeof STORYBLOK_COLOR_GROUPS)[number];

export type StoryblokButtonTextColor = 'white' | 'primary-dark';

type StoryblokColorVars = {
  '--sb-color-bg': string;
  '--sb-color-text': string;
  '--sb-color-bg-hover'?: string;
};

type StoryblokColorMeta = {
  className: string;
  cssVars: StoryblokColorVars;
  highlight?: string;
  groups?: StoryblokColorGroup[];
};

const vars = (bg: string, text: string, hover?: string): StoryblokColorVars => ({
  '--sb-color-bg': bg,
  '--sb-color-text': text,
  ...(hover ? { '--sb-color-bg-hover': hover } : {}),
});

const COLOR_META: Record<StoryblokColorKey, StoryblokColorMeta> = {
  'primary-highlight': {
    className: colorStyles['primary-highlight'],
    cssVars: vars(
      'var(--mantine-color-neonIceLight-6)',
      'var(--mantine-color-carbonBlack-8)',
      'var(--mantine-color-neonIceLight-8)'
    ),
    highlight: 'var(--mantine-color-neonIceLight-3)',
    groups: ['cta', 'highlight'],
  },
  'highlight-1': {
    className: colorStyles['highlight-1'],
    cssVars: vars(
      'var(--mantine-color-bubblegumPink-6)',
      'var(--mantine-color-white)',
      'var(--mantine-color-bubblegumPink-5)'
    ),
    highlight: 'var(--mantine-color-bubblegumPink-3)',
    groups: ['cta', 'highlight'],
  },
  'highlight-2': {
    className: colorStyles['highlight-2'],
    cssVars: vars(
      'var(--mantine-color-amberGlow-6)',
      'var(--mantine-color-carbonBlack-8)',
      'var(--mantine-color-amberGlow-5)'
    ),
    highlight: 'var(--mantine-color-amberGlow-3)',
    groups: ['cta', 'highlight'],
  },
  'highlight-3': {
    className: colorStyles['highlight-3'],
    cssVars: vars(
      'var(--mantine-color-blushedBrick-6)',
      'var(--mantine-color-white)',
      'var(--mantine-color-blushedBrick-5)'
    ),
    highlight: 'var(--mantine-color-blushedBrick-3)',
    groups: ['cta', 'highlight'],
  },
  'primary-dark': {
    className: colorStyles['primary-dark'],
    cssVars: vars(
      'var(--mantine-color-carbonBlack-8)',
      'var(--mantine-color-white)',
      'var(--mantine-color-carbonBlack-7)'
    ),
    groups: ['cta', 'surface-dark'],
  },
  white: {
    className: colorStyles.white,
    cssVars: vars(
      'var(--mantine-color-whiteSmoke-0)',
      'var(--mantine-color-carbonBlack-8)',
      'var(--mantine-color-whiteSmoke-9)'
    ),
    groups: ['surface-light'],
  },
  'primary-background': {
    className: colorStyles['primary-background'],
    cssVars: vars('var(--mantine-color-carbonBlack-9)', 'var(--mantine-color-white)'),
    groups: ['surface-dark'],
  },
  'background-1': {
    className: colorStyles['background-1'],
    cssVars: vars('var(--mantine-color-carbonBlack-8)', 'var(--mantine-color-white)'),
    groups: ['surface-dark'],
  },
  'background-2': {
    className: colorStyles['background-2'],
    cssVars: vars('var(--mantine-color-carbonBlack-7)', 'var(--mantine-color-white)'),
    groups: ['surface-dark'],
  },
  'background-3': {
    className: colorStyles['background-3'],
    cssVars: vars('var(--mantine-color-carbonBlack-6)', 'var(--mantine-color-white)'),
    groups: ['surface-dark'],
  },
  'background-4': {
    className: colorStyles['background-4'],
    cssVars: vars('var(--mantine-color-graphite-8)', 'var(--mantine-color-white)'),
    groups: ['surface-dark'],
  },
  'background-5': {
    className: colorStyles['background-5'],
    cssVars: vars('var(--mantine-color-graphite-7)', 'var(--mantine-color-white)'),
    groups: ['surface-dark'],
  },
  'background-6': {
    className: colorStyles['background-6'],
    cssVars: vars('var(--mantine-color-gunmetal-8)', 'var(--mantine-color-white)'),
    groups: ['surface-dark'],
  },
  'background-7': {
    className: colorStyles['background-7'],
    cssVars: vars('var(--mantine-color-gunmetal-6)', 'var(--mantine-color-white)'),
    groups: ['surface-dark'],
  },
  'background-8': {
    className: colorStyles['background-8'],
    cssVars: vars('var(--mantine-color-gunmetal-3)', 'var(--mantine-color-carbonBlack-8)'),
    groups: ['surface-light'],
  },
  'background-9': {
    className: colorStyles['background-9'],
    cssVars: vars('var(--mantine-color-whiteSmoke-3)', 'var(--mantine-color-carbonBlack-8)'),
    groups: ['surface-light'],
  },
  'background-10': {
    className: colorStyles['background-10'],
    cssVars: vars('var(--mantine-color-whiteSmoke-1)', 'var(--mantine-color-carbonBlack-8)'),
    groups: ['surface-light'],
  },
  color_1: {
    className: colorStyles['highlight-1'],
    cssVars: vars(
      'var(--mantine-color-bubblegumPink-6)',
      'var(--mantine-color-white)',
      'var(--mantine-color-bubblegumPink-5)'
    ),
    highlight: 'var(--mantine-color-bubblegumPink-3)',
    groups: ['cta', 'highlight'],
  },
  color_2: {
    className: colorStyles['highlight-2'],
    cssVars: vars(
      'var(--mantine-color-amberGlow-6)',
      'var(--mantine-color-carbonBlack-8)',
      'var(--mantine-color-amberGlow-5)'
    ),
    highlight: 'var(--mantine-color-amberGlow-3)',
    groups: ['cta', 'highlight'],
  },
  color_3: {
    className: colorStyles['highlight-3'],
    cssVars: vars(
      'var(--mantine-color-blushedBrick-6)',
      'var(--mantine-color-white)',
      'var(--mantine-color-blushedBrick-5)'
    ),
    highlight: 'var(--mantine-color-blushedBrick-3)',
    groups: ['cta', 'highlight'],
  },
};

const createGroupIndex = () => {
  const base = STORYBLOK_COLOR_GROUPS.reduce(
    (acc, group) => {
      acc[group] = [] as StoryblokColorKey[];
      return acc;
    },
    {} as Record<StoryblokColorGroup, StoryblokColorKey[]>
  );

  Object.entries(COLOR_META).forEach(([key, meta]) => {
    meta.groups?.forEach((group) => {
      base[group].push(key as StoryblokColorKey);
    });
  });

  return base;
};

const COLOR_GROUP_INDEX = createGroupIndex();

const COLOR_GROUP_LOOKUP = STORYBLOK_COLOR_GROUPS.reduce(
  (acc, group) => {
    acc[group] = new Set(COLOR_GROUP_INDEX[group]);
    return acc;
  },
  {} as Record<StoryblokColorGroup, Set<StoryblokColorKey>>
);

const TEXT_COLOR_CLASS_MAP: Record<StoryblokButtonTextColor, string> = {
  white: colorStyles['text-white'],
  'primary-dark': colorStyles['text-primary-dark'],
};

const getMeta = (key?: string): StoryblokColorMeta | undefined => {
  if (!key) return undefined;
  return COLOR_META[key as StoryblokColorKey];
};

export const getStoryblokColorClass = (key?: string) => getMeta(key)?.className;

export const getStoryblokColorVars = (key?: string) => getMeta(key)?.cssVars;

export const getStoryblokHighlightColor = (key?: string) => getMeta(key)?.highlight;

export const getStoryblokTextColorClass = (key?: string) =>
  key ? TEXT_COLOR_CLASS_MAP[key as StoryblokButtonTextColor] : undefined;

export const getStoryblokColorKeysByGroup = (group: StoryblokColorGroup) => COLOR_GROUP_INDEX[group] ?? [];

export const getStoryblokDefaultColorForGroup = (
  group: StoryblokColorGroup,
  fallback?: StoryblokColorKey
) => COLOR_GROUP_INDEX[group]?.[0] ?? fallback;

export const isStoryblokColorInGroup = (key: string | undefined, group: StoryblokColorGroup) =>
  key ? COLOR_GROUP_LOOKUP[group].has(key as StoryblokColorKey) : false;
