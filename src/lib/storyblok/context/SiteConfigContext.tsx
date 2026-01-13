'use client';

import baseTheme from '@/lib/mantine/theme';
import { COLOR_SCHEME_STORAGE_KEY, isSiteColorScheme, type SiteColorScheme } from '@/lib/site/colorScheme';
import type { SiteConfig as SiteConfigBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import { MantineProvider, MantineThemeOverride, type MantineColorsTuple } from '@mantine/core';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const DEFAULT_RADIUS = baseTheme.defaultRadius ?? 'md';
const DEFAULT_BACKGROUND_LIGHT = baseTheme.other?.backgroundLight ?? '#ffffff';
const DEFAULT_TEXT_ON_LIGHT = baseTheme.other?.textOnLight ?? '#212121';
const DEFAULT_BACKGROUND_DARK = baseTheme.other?.backgroundDark ?? '#0d0d0d';
const DEFAULT_TEXT_ON_DARK = baseTheme.other?.textOnDark ?? '#ffffff';

export type SiteConfigContent = SiteConfigBlok & {
  primary_highlight_color?: string;
  highlight_1_color?: string;
  highlight_2_color?: string;
  highlight_3_color?: string;
  primary_background_color?: string;
  background_1_color?: string;
  background_2_color?: string;
  background_3_color?: string;
  primary_dark_color?: string;
  custom_font_display?: string;
  custom_font_body?: string;
};

export type NormalizedSiteConfig = {
  primary?: string;
  secondary?: string;
  tertiary?: string;
  accentAlt?: string;
  background?: string;
  backgroundAlt?: string;
  backgroundMuted?: string;
  backgroundDark?: string;
  disableRoundedCorners?: boolean;
  useCustomColors?: boolean;
  useCustomFonts?: boolean;
  coloredHeadlines?: boolean;
  headingsFont?: string;
  bodyFont?: string;
  raw?: SiteConfigContent;
};

type SiteConfigContextValue = {
  config?: NormalizedSiteConfig;
  setConfig: (config?: NormalizedSiteConfig) => void;
  theme: MantineThemeOverride;
  colorScheme: SiteColorScheme;
  hasInitializedColorScheme: boolean;
  setColorScheme: (scheme: SiteColorScheme) => void;
  toggleColorScheme: () => void;
};

const SiteConfigContext = createContext<SiteConfigContextValue | undefined>(undefined);

const toColor = (value: unknown) => (typeof value === 'string' && value.trim().length ? value.trim() : undefined);

export const normalizeSiteConfig = (blok?: SiteConfigContent): NormalizedSiteConfig | undefined => {
  if (!blok) return undefined;

  return {
    primary: toColor(blok.primary_highlight_color),
    secondary: toColor(blok.highlight_1_color),
    tertiary: toColor(blok.highlight_2_color),
    accentAlt: toColor(blok.highlight_3_color),
    background: toColor(blok.primary_background_color),
    backgroundAlt: toColor(blok.background_1_color),
    backgroundMuted: toColor(blok.background_2_color) ?? toColor(blok.background_3_color),
    backgroundDark: toColor(blok.primary_dark_color),
    disableRoundedCorners: Boolean(blok.disable_rounded_corners),
    useCustomColors: Boolean(blok.use_custom_colors),
    useCustomFonts: Boolean(blok.use_custom_fonts),
    coloredHeadlines: Boolean(blok.colored_headlines),
    headingsFont: typeof blok.custom_font_display === 'string' ? blok.custom_font_display : undefined,
    bodyFont: typeof blok.custom_font_body === 'string' ? blok.custom_font_body : undefined,
    raw: blok,
  };
};

const toMantinePalette = (color?: string): MantineColorsTuple | undefined => {
  if (!color) return undefined;

  // Mantine expects a 10-shade tuple.
  return [color, color, color, color, color, color, color, color, color, color] as MantineColorsTuple;
};

const hexToRgb = (value?: string): [number, number, number] | null => {
  if (!value || typeof value !== 'string') return null;
  const hex = value.trim().replace('#', '');
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return null;

  const normalized =
    hex.length === 3
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex;
  const num = parseInt(normalized, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return [r, g, b];
};

const getReadableTextColor = (background?: string): string | undefined => {
  const rgb = hexToRgb(background);
  if (!rgb) return undefined;

  // WCAG relative luminance
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Choose text color that maximizes contrast against the background.
  return luminance > 0.55 ? '#0d0d0d' : '#ffffff';
};

export const applyConfigToTheme = (config?: NormalizedSiteConfig): MantineThemeOverride => {
  const palette = config?.useCustomColors ? toMantinePalette(config.primary) : undefined;
  const backgroundLight = config?.useCustomColors && config.background ? config.background : DEFAULT_BACKGROUND_LIGHT;
  const backgroundDark =
    config?.useCustomColors && config.backgroundDark ? config.backgroundDark : baseTheme.other?.backgroundDark;
  const backgroundLightMuted =
    config?.useCustomColors && config.backgroundAlt ? config.backgroundAlt : baseTheme.other?.backgroundLightMuted;
  const backgroundDarkMuted =
    config?.useCustomColors && config.backgroundMuted ? config.backgroundMuted : baseTheme.other?.backgroundDarkMuted;
  const accent =
    config?.useCustomColors && (config.secondary || config.primary)
      ? (config.secondary ?? config.primary)
      : baseTheme.other?.accent;
  const secondary = config?.useCustomColors && config.tertiary ? config.tertiary : baseTheme.other?.secondary;

  const fontFamily = config?.useCustomFonts && config.bodyFont ? config.bodyFont : baseTheme.fontFamily;
  const headingsFont =
    config?.useCustomFonts && (config.headingsFont || config.bodyFont)
      ? config.headingsFont || config.bodyFont
      : (baseTheme.headings?.fontFamily ?? baseTheme.fontFamily);

  return {
    ...baseTheme,
    primaryColor: palette ? 'sbPrimary' : baseTheme.primaryColor,
    colors: {
      ...baseTheme.colors,
      ...(palette ? { sbPrimary: palette } : {}),
    },
    other: {
      ...baseTheme.other,
      backgroundLight,
      backgroundDark,
      backgroundLightMuted,
      backgroundDarkMuted,
      accent,
      secondary,
    },
    white: backgroundLight ?? baseTheme.white,
    black: backgroundDark ?? baseTheme.black,
    fontFamily,
    headings: {
      ...baseTheme.headings,
      fontFamily: headingsFont,
    },
    defaultRadius: config?.disableRoundedCorners ? 0 : DEFAULT_RADIUS,
  } satisfies MantineThemeOverride;
};

export const SiteConfigProvider = ({
  children,
  initialConfig,
}: {
  children: React.ReactNode;
  initialConfig?: SiteConfigContent;
}) => {
  const initialNormalized = useMemo(() => normalizeSiteConfig(initialConfig), [initialConfig]);
  const [config, setConfigState] = useState<NormalizedSiteConfig | undefined>(initialNormalized);
  // IMPORTANT: Keep SSR + first client render deterministic to avoid hydration mismatches.
  // We sync from ColorSchemeScript/localStorage after mount.
  const [colorScheme, setColorSchemeState] = useState<SiteColorScheme>('light');
  const [hasInitializedColorScheme, setHasInitializedColorScheme] = useState(false);

  const theme = useMemo(() => applyConfigToTheme(config), [config]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
      if (isSiteColorScheme(stored)) {
        setColorSchemeState(stored);
        setHasInitializedColorScheme(true);
        return;
      }
    } catch {
      // ignore
    }

    const attributeValue = document.documentElement.getAttribute('data-mantine-color-scheme');
    if (isSiteColorScheme(attributeValue)) {
      setColorSchemeState(attributeValue);
      setHasInitializedColorScheme(true);
      return;
    }

    setHasInitializedColorScheme(true);
  }, []);

  useEffect(() => {
    if (!hasInitializedColorScheme) return;

    if (!config) {
      resetCssVariables(colorScheme);
      return;
    }
    applyCssVariables(config, colorScheme);
  }, [config, colorScheme, hasInitializedColorScheme]);

  useEffect(() => {
    if (!hasInitializedColorScheme) return;

    document.documentElement.setAttribute('data-mantine-color-scheme', colorScheme);
    try {
      window.localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, colorScheme);
    } catch {
      // ignore
    }
  }, [colorScheme, hasInitializedColorScheme]);

  const setConfig = useCallback((value?: NormalizedSiteConfig) => {
    setConfigState(value);
  }, []);

  const setColorScheme = useCallback((scheme: SiteColorScheme) => {
    setHasInitializedColorScheme(true);
    setColorSchemeState(scheme);

    // Persist immediately so a fast refresh keeps the user's choice.
    try {
      window.localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, scheme);
    } catch {
      // ignore
    }

    document.documentElement.setAttribute('data-mantine-color-scheme', scheme);
  }, []);

  const toggleColorScheme = useCallback(() => {
    setHasInitializedColorScheme(true);
    setColorSchemeState((current) => {
      const next = current === 'dark' ? 'light' : 'dark';

      // Persist immediately so a fast refresh keeps the user's choice.
      try {
        window.localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, next);
      } catch {
        // ignore
      }

      document.documentElement.setAttribute('data-mantine-color-scheme', next);
      return next;
    });
  }, []);

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        setConfig,
        theme,
        colorScheme,
        hasInitializedColorScheme,
        setColorScheme,
        toggleColorScheme,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) throw new Error('useSiteConfig must be used inside SiteConfigProvider');
  return ctx;
};

export const SiteThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme, colorScheme } = useSiteConfig();

  return (
    <MantineProvider theme={theme} defaultColorScheme="light" forceColorScheme={colorScheme}>
      {children}
    </MantineProvider>
  );
};

export const resetCssVariables = (colorScheme: SiteColorScheme = 'light') => {
  const root = document.documentElement;

  const background = colorScheme === 'dark' ? DEFAULT_BACKGROUND_DARK : DEFAULT_BACKGROUND_LIGHT;
  const text = colorScheme === 'dark' ? DEFAULT_TEXT_ON_DARK : DEFAULT_TEXT_ON_LIGHT;

  root.style.setProperty('--sb-background', background);
  root.style.setProperty('--sb-text', text);
  root.style.setProperty('--sb-color-scheme', colorScheme);
  root.style.removeProperty('--sb-accent');
  root.style.removeProperty('--sb-headline-color');
  root.style.removeProperty('--sb-radius');
  document.body.style.backgroundColor = background;
  document.documentElement.style.backgroundColor = background;
};

export const applyCssVariables = (config?: NormalizedSiteConfig, colorScheme: SiteColorScheme = 'light') => {
  const root = document.documentElement;

  const background =
    config?.useCustomColors && colorScheme === 'dark'
      ? (config.backgroundDark ?? config.background ?? baseTheme.other?.backgroundDark)
      : config?.useCustomColors
        ? config.background
        : undefined;
  const accent = config?.useCustomColors ? (config.secondary ?? config.primary) : undefined;
  const headline = config?.coloredHeadlines ? (accent ?? config?.primary) : undefined;
  const radius = config?.disableRoundedCorners ? '0px' : undefined;

  const fallbackBackground = colorScheme === 'dark' ? DEFAULT_BACKGROUND_DARK : DEFAULT_BACKGROUND_LIGHT;
  const fallbackText = colorScheme === 'dark' ? DEFAULT_TEXT_ON_DARK : DEFAULT_TEXT_ON_LIGHT;
  const textColor = getReadableTextColor(background ?? fallbackBackground) ?? fallbackText;

  if (background) {
    root.style.setProperty('--sb-background', background);
    document.body.style.backgroundColor = background;
    document.documentElement.style.backgroundColor = background;
  } else {
    root.style.setProperty('--sb-background', fallbackBackground);
    document.body.style.backgroundColor = fallbackBackground;
    document.documentElement.style.backgroundColor = fallbackBackground;
  }

  root.style.setProperty('--sb-text', textColor);
  root.style.setProperty('--sb-color-scheme', colorScheme);

  if (accent) {
    root.style.setProperty('--sb-accent', accent);
  } else {
    root.style.removeProperty('--sb-accent');
  }

  if (headline) {
    root.style.setProperty('--sb-headline-color', headline);
  } else {
    root.style.removeProperty('--sb-headline-color');
  }

  if (radius) {
    root.style.setProperty('--sb-radius', radius);
  } else {
    root.style.removeProperty('--sb-radius');
  }
};
