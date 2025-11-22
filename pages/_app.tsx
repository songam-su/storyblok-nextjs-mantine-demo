import { createTheme, MantineProvider } from '@mantine/core';
import type { AppProps } from 'next/app';
import '../src/lib/storyblok/storyblok'; // ✅ This runs storyblokInit before rendering
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const theme = getTheme();

  return (
    <MantineProvider
      // withGlobalStyles // TODO: upgate to Mantine 8.x.x ?
      // withNormalizeCSS
      defaultColorScheme="light"
      theme={theme}
    >
      <Component {...pageProps} />
    </MantineProvider>
  );
}

const getTheme = () => {
  return createTheme({
    breakpoints: {
      xs: '500px',
      sm: '800px',
      md: '1000px',
      lg: '1200px',
      xl: '1400px',
    },
    components: {
      Button: {
        styles: {
          root: { borderRadius: '8px' }, // global override
        },
      },
    },
  });
};

export default MyApp;
