'use client';

import { Button, Paper, PasswordInput, Stack, Text, Title } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

const normalizeNextPath = (value: string | null) => {
  if (!value) return '/sb-preview';
  if (!value.startsWith('/')) return '/sb-preview';
  // Prevent open redirects.
  if (!value.startsWith('/sb-preview')) return '/sb-preview';
  return value;
};

export default function PreviewLoginPage() {
  const searchParams = useSearchParams();
  const nextPath = useMemo(() => normalizeNextPath(searchParams.get('next')), [searchParams]);

  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/preview-auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password, next: nextPath }),
      });

      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; next?: string } | null;

      if (!res.ok || !data?.ok) {
        setError(data?.error || 'Login failed.');
        return;
      }

      window.location.assign(data.next || nextPath);
    } catch {
      setError('Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-shell__content" style={{ padding: 'clamp(24px, 6vw, 64px)' }}>
      <Paper
        withBorder
        radius="lg"
        p="xl"
        style={{
          maxWidth: 520,
          marginInline: 'auto',
          background: 'var(--sb-background)',
          borderColor: 'color-mix(in srgb, var(--sb-text) 18%, transparent)',
        }}
      >
        <Stack gap="md">
          <div>
            <Title order={2} style={{ color: 'var(--sb-text)' }}>
              Preview Login
            </Title>
            <Text c="dimmed" mt={6}>
              Enter the preview password to access draft content.
            </Text>
          </div>

          <form onSubmit={onSubmit}>
            <Stack gap="sm">
              <PasswordInput
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
              />

              {error ? <Text style={{ color: 'color-mix(in srgb, var(--sb-text) 80%, red)' }}>{error}</Text> : null}

              <Button type="submit" loading={isSubmitting}>
                Continue
              </Button>

              <Text c="dimmed">
                Requested: <code>{nextPath}</code>
              </Text>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </main>
  );
}
