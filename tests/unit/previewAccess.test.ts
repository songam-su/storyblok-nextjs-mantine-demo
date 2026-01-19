import { isPreviewAllowed } from '@/lib/site/previewAccess';
import crypto from 'crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';

function base64Url(input: Buffer) {
  return input.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function makeToken(secret: string, timestampSeconds: number) {
  const nonce = base64Url(crypto.randomBytes(16));
  const payload = `${timestampSeconds}.${nonce}`;
  const sig = base64Url(crypto.createHmac('sha256', secret).update(payload).digest());
  return `${payload}.${sig}`;
}

describe('preview access', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('denies in production without allowlist/editor/draft/cookie', () => {
    vi.stubEnv('VERCEL_ENV', 'production');
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('PREVIEW_ALLOWED_HOSTS', '');
    vi.stubEnv('PREVIEW_AUTH_COOKIE_NAME', 'preview_auth');
    vi.stubEnv('PREVIEW_AUTH_SECRET', 'secret');

    const allowed = isPreviewAllowed({
      host: 'www.andrewcaperton.me',
      headers: { get: () => null },
      isDraftModeEnabled: false,
      url: 'https://www.andrewcaperton.me/sb-preview/home',
    });

    expect(allowed).toBe(false);
  });

  it('allows when DEPLOY_ENV is non-production even if NODE_ENV is production', () => {
    vi.stubEnv('VERCEL_ENV', 'production');
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('DEPLOY_ENV', 'staging');

    const allowed = isPreviewAllowed({
      host: 'www.andrewcaperton.me',
      headers: { get: () => null },
      isDraftModeEnabled: false,
      url: 'https://www.andrewcaperton.me/sb-preview/home',
    });

    expect(allowed).toBe(true);
  });

  it('allows when NEXT_PUBLIC_DEPLOY_ENV is non-production even if NODE_ENV is production', () => {
    vi.stubEnv('VERCEL_ENV', 'production');
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ENV', 'preview');

    const allowed = isPreviewAllowed({
      host: 'www.andrewcaperton.me',
      headers: { get: () => null },
      isDraftModeEnabled: false,
      url: 'https://www.andrewcaperton.me/sb-preview/home',
    });

    expect(allowed).toBe(true);
  });

  it('allows in production with valid signed preview cookie', () => {
    vi.stubEnv('VERCEL_ENV', 'production');
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('PREVIEW_ALLOWED_HOSTS', '');
    vi.stubEnv('PREVIEW_AUTH_COOKIE_NAME', 'preview_auth');
    vi.stubEnv('PREVIEW_AUTH_SECRET', 'supersecret');

    const ts = Math.floor(Date.now() / 1000);
    const token = makeToken('supersecret', ts);

    const allowed = isPreviewAllowed({
      host: 'www.andrewcaperton.me',
      headers: { get: (name) => (name.toLowerCase() === 'cookie' ? `preview_auth=${token}` : null) },
      isDraftModeEnabled: false,
      url: 'https://www.andrewcaperton.me/sb-preview/home',
    });

    expect(allowed).toBe(true);
  });
});
