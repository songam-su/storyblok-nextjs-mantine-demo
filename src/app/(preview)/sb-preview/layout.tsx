import PreviewProviders from './providers';

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PreviewProviders>{children}</PreviewProviders>
      </body>
    </html>
  );
}
