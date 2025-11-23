import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@/styles/globals.scss';
import StoryblokClientRenderer from '@/lib/storyblok/rendering/storyblok-client-renderer';

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider>
          <StoryblokClientRenderer>{children}</StoryblokClientRenderer>
        </MantineProvider>
      </body>
    </html>
  );
}
