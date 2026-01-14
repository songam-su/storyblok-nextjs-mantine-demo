type HeadersLike = {
  get(name: string): string | null;
};

function isNonProductionEnvironment(): boolean {
  // Vercel sets VERCEL_ENV to: 'production' | 'preview' | 'development'.
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv && vercelEnv !== 'production') return true;

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

function hasCookie(headers: HeadersLike | null | undefined, cookieName: string): boolean {
  const raw = headers?.get('cookie') ?? '';
  if (!raw) return false;
  // Cheap/robust enough for gating: look for a "name=" segment boundary.
  return raw.split(';').some((part) => part.trimStart().toLowerCase().startsWith(`${cookieName.toLowerCase()}=`));
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
  if (authCookieName && hasCookie(headers, authCookieName)) return true;

  if (isStoryblokEditorRequest(headers, url)) return true;

  return false;
}
