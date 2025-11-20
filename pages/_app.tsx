import { MantineProvider } from '@mantine/core'
import type { AppProps } from 'next/app'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      // withGlobalStyles // TODO: upgate to Mantine 8.x.x ?
      // withNormalizeCSS
      defaultColorScheme="light"
      theme={{
        breakpoints: {
          xs: '500px',
          sm: '800px',
          md: '1000px',
          lg: '1200px',
          xl: '1400px',
        },
      }}
    >
      <Component {...pageProps} />
    </MantineProvider>
  )
}

export default MyApp
