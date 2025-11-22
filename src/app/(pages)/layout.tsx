import { MantineProvider } from '@mantine/core';
import '@/lib/storyblok/storyblok'; // ✅ Initialize Storyblok
import '../../styles/globals.scss';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
