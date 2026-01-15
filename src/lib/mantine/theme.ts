// src/lib/mantine/theme.ts
import { createTheme, type MantineColorsTuple } from '@mantine/core';

const FONT_STACK = 'Inter, "Segoe UI", system-ui, -apple-system, sans-serif';

// Site backbone palettes
// sageTeal: light bg (dark hover) = #348183, light hover (dark bg) = #2c6c6e
const sageTeal: MantineColorsTuple = [
  '#e7f0f0',
  '#d2e3e4',
  '#bed7d7',
  '#aacacb',
  '#8fbabb',
  '#348183',
  '#2c6c6e',
  '#235658',
  '#1b4344',
  '#143132',
];

// raspberryRed: light bg (dark hover) = #E02E58, light hover (dark bg) = #CA294F
const raspberryRed: MantineColorsTuple = [
  '#fceaee',
  '#f9d5de',
  '#f6c0cd',
  '#f3abbc',
  '#ee8ca3',
  '#E02E58',
  '#CA294F',
  '#a2213f',
  '#7d1931',
  '#5b1224',
];

const blushedBrick: MantineColorsTuple = [
  '#ffe6ea',
  '#fbcfd3',
  '#f6b7bf',
  '#f19fab',
  '#ea8797',
  '#e36f83',
  '#dc576f',
  '#d53e5b',
  '#cc4c5a',
  '#a93143',
];

const gunmetal: MantineColorsTuple = [
  '#f0f0f0',
  '#d9d9d9',
  '#c3c3c3',
  '#acacac',
  '#969696',
  '#808080',
  '#696969',
  '#545454',
  '#2c2c2c',
  '#2c2c2c',
];

const graphite: MantineColorsTuple = [
  '#f4f2f2',
  '#dfd9d9',
  '#c9c1c1',
  '#b3a9aa',
  '#9d9293',
  '#867c7d',
  '#706667',
  '#5a5152',
  '#444041',
  '#2f2b2c',
];

const carbonBlack: MantineColorsTuple = [
  '#f2f2f2',
  '#d9d9d9',
  '#c0c0c0',
  '#a7a7a7',
  '#8e8e8e',
  '#757575',
  '#5c5c5c',
  '#434343',
  '#212121',
  '#0d0d0d',
];

const whiteSmoke: MantineColorsTuple = [
  '#ffffff',
  '#fefefe',
  '#fdfdfd',
  '#fbfbfb',
  '#f9f9f9',
  '#f7f7f7',
  '#f5f5f5',
  '#e6e6e6',
  '#d8d8d8',
  '#cacaca',
];

const tomatoJam: MantineColorsTuple = [
  '#ffe5e5',
  '#ffc7c7',
  '#ffa8a8',
  '#ff8989',
  '#ff6b6b',
  '#f44f4f',
  '#e43333',
  '#d31818',
  '#d32f2f',
  '#a31919',
];

const amberGlow: MantineColorsTuple = [
  '#fff7e6',
  '#ffeac0',
  '#ffdd99',
  '#ffd073',
  '#ffc34d',
  '#ffb629',
  '#ffa904',
  '#f09600',
  '#ffa000',
  '#c57300',
];

const twitterBlue: MantineColorsTuple = [
  '#e6f0fb',
  '#c7dbf5',
  '#a8c6ef',
  '#89b1e9',
  '#6a9ce3',
  '#4a87dd',
  '#2b72d7',
  '#1d63c5',
  '#1976d2',
  '#0f4b8a',
];

const forestGreen: MantineColorsTuple = [
  '#e6f4ea',
  '#c7e6ce',
  '#a8d8b2',
  '#89ca96',
  '#6bbc7b',
  '#4cae60',
  '#3d9d4f',
  '#2e8c3e',
  '#388e3c',
  '#1e6124',
];

const theme = createTheme({
  fontFamily: FONT_STACK,
  primaryColor: 'sageTeal',
  // Align with backbone: light uses index 5 (#348183), dark uses index 6 (#2c6c6e)
  primaryShade: { light: 5, dark: 6 },
  colors: {
    sageTeal,
    raspberryRed,

    // Raw palettes (kept for backwards compatibility)
    blushedBrick,
    amberGlow,
    tomatoJam,
    twitterBlue,
    forestGreen,
    gunmetal,
    graphite,
    carbonBlack,
    whiteSmoke,

    // Semantic aliases (preferred)
    secondary: raspberryRed,
    accent: blushedBrick,
    warning: amberGlow,
    danger: tomatoJam,
    info: twitterBlue,
    success: forestGreen,
  },
  black: '#212121',
  white: '#ffffff',
  headings: {
    fontFamily: FONT_STACK,
    fontWeight: '600',
    sizes: {
      h1: { fontSize: '3.5rem', lineHeight: '1.1' },
      h2: { fontSize: '2.8rem', lineHeight: '1.15' },
      // …
    },
  },
  other: {
    backgroundDark: '#2c2c2c',
    backgroundDarkMuted: '#444041',
    backgroundLight: '#ffffff',
    backgroundLightMuted: '#f5f5f5',
    textOnDark: '#f5f5f5',
    textOnLight: '#212121',
    accent: '#cc4c5a',
    secondary: '#E02E58',
    primarySwatches: {
      lightScheme: '#348183',
      darkScheme: '#2c6c6e',
    },
    status: {
      danger: '#d32f2f',
      warning: '#ffa000',
      info: '#1976d2',
      success: '#388e3c',
    },
  },
});

export default theme;
