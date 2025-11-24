import PublishedProviders from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PublishedProviders>{children}</PublishedProviders>
      </body>
    </html>
  );
}
