import PreviewProviders from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PreviewProviders>{children}</PreviewProviders>
      </body>
    </html>
  );
}
