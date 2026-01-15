import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <section
      style={{
        maxWidth: 'min(var(--page-shell-max-width), 100%)',
        margin: '0 auto',
        padding: 'var(--page-shell-section-padding-y) var(--page-shell-section-padding)',
        textAlign: 'center',
      }}
    >
      <h1 style={{ margin: 0, fontSize: 'clamp(2rem, 1.25rem + 3vw, 3.5rem)', lineHeight: 1.05 }}>404</h1>
      <p style={{ margin: '0.75rem 0 0', color: 'var(--sb-text-muted)' }}>This page could not be found.</p>
      <p style={{ margin: '1.25rem 0 0' }}>
        <Link href="/" style={{ color: 'var(--sb-accent)', textDecoration: 'underline' }}>
          Return home
        </Link>
      </p>
    </section>
  );
}
