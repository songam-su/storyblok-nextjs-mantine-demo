import crypto from 'crypto';

type HeadersLike = {
  get(name: string): string | null;
};

function base64UrlDecode(value: string): Buffer {
  const padded = value
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(value.length / 4) * 4, '=');
  return Buffer.from(padded, 'base64');
}

function isNonProductionEnvironment(): boolean {
  // Vercel sets VERCEL_ENV to: 'production' | 'preview' | 'development'.
  const vercelEnv = process.env.VERCEL_ENV;
  const deployEnv = process.env.DEPLOY_ENV ?? process.env.NEXT_PUBLIC_DEPLOY_ENV ?? vercelEnv;
  if (deployEnv && deployEnv !== 'production') return true;

  // Fallback for local/non-Vercel deployments.
  return process.env.NODE_ENV !== 'production';
}

export function isPreviewAllowedForHost(host: string | null | undefined): boolean {
  // Allow preview routes in non-production environments by default.
  if (isNonProductionEnvironment()) return true;

  const normalizedHost = (host ?? '').toLowerCase().trim();
  if (!normalizedHost) return false;

  // In production, require an explicit allowlist.
  // Example: PREVIEW_ALLOWED_HOSTS=localhost:3010,qa.mysite.com
  const allowlistRaw = process.env.PREVIEW_ALLOWED_HOSTS;
  const allowlist = (allowlistRaw ? allowlistRaw.split(',') : ['localhost', 'localhost:3010', '127.0.0.1'])
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  return allowlist.includes(normalizedHost);
}

function getCookieValue(headers: HeadersLike | null | undefined, cookieName: string): string | null {
  const raw = headers?.get('cookie') ?? '';
  if (!raw) return null;
  // Cheap/robust enough for gating: look for a "name=" segment boundary.
  const target = cookieName.toLowerCase();
  for (const part of raw.split(';')) {
    const trimmed = part.trimStart();
    const idx = trimmed.indexOf('=');
    if (idx <= 0) continue;
    const name = trimmed.slice(0, idx).trim().toLowerCase();
    if (name !== target) continue;
    return trimmed.slice(idx + 1).trim();
  }
  return null;
}

function isValidPreviewAuthToken(token: string, secret: string): boolean {
  // Format: <timestamp>.<nonce>.<sig>
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [rawTs, nonce, sig] = parts;

  const ts = Number(rawTs);
  if (!Number.isFinite(ts) || ts <= 0) return false;

  // 7 days validity (matches cookie maxAge).
  const now = Math.floor(Date.now() / 1000);
  if (ts > now + 60) return false; // allow small clock skew
  if (now - ts > 60 * 60 * 24 * 7) return false;

  const payload = `${rawTs}.${nonce}`;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest();
  let provided: Buffer;
  try {
    provided = base64UrlDecode(sig);
  } catch {
    return false;
  }

  if (expected.length !== provided.length) return false;
  return crypto.timingSafeEqual(expected, provided);
}

function isStoryblokEditorRequest(headers: HeadersLike | null | undefined, url: string | null | undefined): boolean {
  const editorHost = (process.env.STORYBLOK_EDITOR_HOST ?? 'app.storyblok.com').toLowerCase();
  const referrer = (headers?.get('referer') ?? '').toLowerCase();
  const origin = (headers?.get('origin') ?? '').toLowerCase();

  // Most reliable signal: Storyblok loads your site inside an iframe from its editor domain.
  if (referrer.includes(editorHost) || origin.includes(editorHost)) return true;

  // Secondary signal: Storyblok often appends these params when opening URLs in the Visual Editor.
  // `_storyblok_tk` is the stronger indicator (token param).
  if (!url) return false;

  try {
    const parsed = new URL(url);
    if (parsed.searchParams.has('_storyblok_tk')) return true;
    if (parsed.searchParams.has('_storyblok') && referrer.includes(editorHost)) return true;
  } catch {
    // Ignore parsing errors and fall back to referrer/origin signals.
  }

  return false;
}

export interface PreviewAccessOptions {
  host: string | null | undefined;
  headers?: HeadersLike | null;
  url?: string | null;
  isDraftModeEnabled?: boolean;
}

/**
 * Preview access policy.
 *
 * - Non-production: always allowed.
 * - Production:
 *   - Allowed on allowlisted hosts (QA), OR
 *   - Allowed for Storyblok Visual Editor requests, OR
 *   - Allowed when Next draft mode is already enabled, OR
 *   - Allowed when a dedicated preview-auth cookie is present.
 */
export function isPreviewAllowed(options: PreviewAccessOptions): boolean {
  if (isNonProductionEnvironment()) return true;

  const { host, headers, url, isDraftModeEnabled } = options;

  if (isPreviewAllowedForHost(host)) return true;
  if (isDraftModeEnabled) return true;

  const authCookieName = process.env.PREVIEW_AUTH_COOKIE_NAME ?? 'preview_auth';
  const authCookieValue = authCookieName ? getCookieValue(headers, authCookieName) : null;
  if (authCookieName && authCookieValue) {
    const secret = process.env.PREVIEW_AUTH_SECRET;
    if (!secret) return true;
    if (isValidPreviewAuthToken(authCookieValue, secret)) return true;
  }

  if (isStoryblokEditorRequest(headers, url)) return true;

  return false;
}
