import PublishedProviders from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="app-body">
        <PublishedProviders>
          <div className="page-shell">
            <main className="page-shell__content">{children}</main>
          </div>
        </PublishedProviders>
      </body>
    </html>
  );
}
