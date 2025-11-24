import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@/styles/globals.scss';
import StoryblokClientRenderer from '@/lib/storyblok/storyblok-client-renderer';
import theme from '@/lib/mantine/theme';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider theme={theme}>
          <StoryblokClientRenderer>{children}</StoryblokClientRenderer>
        </MantineProvider>
      </body>
    </html>
  );
}
