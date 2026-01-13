export const COLOR_SCHEME_STORAGE_KEY = 'site-color-scheme';

export type SiteColorScheme = 'light' | 'dark';

export const isSiteColorScheme = (value: unknown): value is SiteColorScheme => value === 'light' || value === 'dark';
