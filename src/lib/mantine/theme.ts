// src/lib/mantine/theme.ts
import { createTheme, MantineTheme } from '@mantine/core';

const theme = createTheme({
  primaryColor: 'brandAqua',
  primaryShade: { light: 4, dark: 6 },
  colors: {
    brandAqua: [
      '#e0fffe',
      '#b6fbfb',
      '#8bf7f6',
      '#5ef3f1',
      '#3eedea',
      '#1ee6eb',
      '#12c8cd',
      '#05aab0',
      '#008c93',
      '#006f76',
    ],
    brandCharcoal: [
      '#f5f5f5',
      '#dcdcdc',
      '#c2c2c2',
      '#a8a8a8',
      '#8f8f8f',
      '#757575',
      '#5c5c5c',
      '#424242',
      '#292929',
      '#121212',
    ],
    brandIvory: [
      '#ffffff',
      '#fefefe',
      '#fcfcfc',
      '#f9f9f9',
      '#f7f7f7',
      '#f5f5f5',
      '#ebebeb',
      '#e0e0e0',
      '#d6d6d6',
      '#cccccc',
    ],
  },
  black: '#212121',
  white: '#ffffff',
  headings: {
    fontWeight: '600',
    sizes: {
      h1: { fontSize: '3.5rem', lineHeight: '1.1' },
      h2: { fontSize: '2.8rem', lineHeight: '1.15' },
      // …
    },
  },
  components: {
    Paper: {
      styles: (theme: MantineTheme) => ({
        root: {
          backgroundColor: theme.other?.paperBg ?? 'transparent',
        },
      }),
    },
  },
  other: {
    paperBg: '#212121',
    textOnDark: '#f5f5f5',
    textOnLight: '#212121',
  },
});

export default theme;
