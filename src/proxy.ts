import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const DEFAULT_STORYBLOK_API_BASE = 'https://api.storyblok.com/v2/cdn';

function getStoryblokApiBases(): string[] {
  const region = process.env.STORYBLOK_REGION;
  // Storyblok regions use api-<region>.storyblok.com (e.g. api-us.storyblok.com).
  // Some local DNS setups won't resolve regional hosts, so we always keep a fallback
  // to the default api.storyblok.com host.
  const regional = region ? `https://api-${region}.storyblok.com/v2/cdn` : null;
  return regional && regional !== DEFAULT_STORYBLOK_API_BASE
    ? [regional, DEFAULT_STORYBLOK_API_BASE]
    : [DEFAULT_STORYBLOK_API_BASE];
}

function shouldBypassProxy(pathname: string): boolean {
  // Never proxy internal, API, preview, or file requests.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/sb-preview') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/favicon')
  ) {
    return true;
  }

  if (pathname === '/robots.txt' || pathname === '/sitemap.xml' || pathname === '/error-404') return true;

  // Static assets in /public (best-effort): skip anything that looks like a file.
  if (/\.[a-z0-9]+$/i.test(pathname)) return true;

  return false;
}

async function storyblokStoryExists(
  slug: string
): Promise<{ exists: boolean | null; status: number | null; tokenPresent: boolean; apiBase: string | null }> {
  const token = process.env.STORYBLOK_PUBLIC_TOKEN ?? process.env.STORYBLOK_PREVIEW_TOKEN;
  if (!token) return { exists: null, status: null, tokenPresent: false, apiBase: null };

  for (const apiBase of getStoryblokApiBases()) {
    const url = new URL(`${apiBase}/stories/${encodeURIComponent(slug)}`);
    url.searchParams.set('version', 'published');
    url.searchParams.set('token', token);

    try {
      // Keep this fetch minimal and fail open on any errors.
      const res = await fetch(url.toString());

      if (res.ok) return { exists: true, status: res.status, tokenPresent: true, apiBase };
      if (res.status === 404) return { exists: false, status: res.status, tokenPresent: true, apiBase };

      // Non-404 errors are ambiguous: fail open.
      return { exists: null, status: res.status, tokenPresent: true, apiBase };
    } catch {
      // Try the next host (e.g. regional DNS failure -> default host).
      continue;
    }
  }

  return { exists: null, status: null, tokenPresent: true, apiBase: null };
}

/**
 * Edge "proxy" hookpoint (future middleware).
 *
 * Next.js (v16+) can execute `src/proxy.ts` as the request-level Edge proxy.
 * This is the successor pattern to `middleware.ts`.
 *
 * This file exists as a safe place to centralize future Edge-safe request logic
 * (auth gating, preview access control, etc.) without coupling it to a specific
 * middleware matcher/entrypoint.
 *
 * NOTE: Next expects this file to export either a default function or a named
 * `proxy()` function.
 */

async function handleEdgeRequest(req: NextRequest): Promise<NextResponse> {
  const pathname = req.nextUrl.pathname;

  if (shouldBypassProxy(pathname)) {
    const res = NextResponse.next();
    if (process.env.PROXY_DEBUG === '1') res.headers.set('x-proxy', 'bypass');
    return res;
  }

  // Only do the Storyblok existence check for GET/HEAD.
  // (For POST/PUT/etc we never want to rewrite.)
  const method = req.method.toUpperCase();
  if (method !== 'GET' && method !== 'HEAD') {
    const res = NextResponse.next();
    if (process.env.PROXY_DEBUG === '1') res.headers.set('x-proxy', 'skip-method');
    return res;
  }

  // Map URL path -> Storyblok slug.
  const slug = pathname === '/' ? 'home' : pathname.replace(/^\//, '').toLowerCase();

  const existsResult = await storyblokStoryExists(slug);

  // Fail open if we can't confidently answer (missing token / transient errors).
  if (existsResult.exists !== false) {
    const res = NextResponse.next();
    if (process.env.PROXY_DEBUG === '1') {
      res.headers.set('x-proxy', `pass;exists=${String(existsResult.exists)}`);
      res.headers.set('x-proxy-token', existsResult.tokenPresent ? 'present' : 'missing');
      if (typeof existsResult.status === 'number') res.headers.set('x-proxy-story-status', String(existsResult.status));
      if (existsResult.apiBase) res.headers.set('x-proxy-api', existsResult.apiBase);
      res.headers.set('x-proxy-slug', slug);
    }
    return res;
  }

  // Force a real HTTP 404 while keeping the original pathname.
  // In production, a status-only rewrite to the same URL can cause Next/Vercel to
  // serve the framework's generic 404 UI. Instead, rewrite to our dedicated
  // CMS-driven 404 route while keeping the browser URL unchanged.
  const rewriteUrl = req.nextUrl.clone();
  rewriteUrl.pathname = '/error-404';

  const res = NextResponse.rewrite(rewriteUrl, { status: 404 });

  // Best practice: prevent indexing of 404 responses.
  res.headers.set('X-Robots-Tag', 'noindex, follow, noarchive');
  res.headers.set('Cache-Control', 'no-store, max-age=0');
  // Next.js does not emit <link rel="canonical"> for 404 responses, even when
  // metadata specifies it. As a practical SEO signal, also include a Link header.
  // (This is especially useful for bots that honor HTTP canonical headers.)
  const forwardedProto = req.headers.get('x-forwarded-proto');
  const forwardedHost = req.headers.get('x-forwarded-host');
  const host = forwardedHost ?? req.headers.get('host') ?? req.nextUrl.host;
  const proto = forwardedProto ?? req.nextUrl.protocol.replace(':', '');
  const origin = `${proto}://${host}`;
  res.headers.append('Link', `<${new URL(pathname, origin).toString()}>; rel="canonical"`);
  if (process.env.PROXY_DEBUG === '1') res.headers.set('x-proxy', 'rewrite-404');
  return res;
}

export async function proxy(req: NextRequest): Promise<NextResponse> {
  return handleEdgeRequest(req);
}
