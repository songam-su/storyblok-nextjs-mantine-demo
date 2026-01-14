// src/proxy.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const hasUppercase = (value: string) => /[A-Z]/.test(value);

const looksLikeFilePath = (pathname: string) => {
  const last = pathname.split('/').pop() ?? '';
  return last.includes('.') && !last.startsWith('.');
};

function vanityRedirect(req: NextRequest): NextResponse | null {
  const nextUrl = req.nextUrl.clone();
  const pathname = nextUrl.pathname;

  // Exact vanity routes.
  if (pathname === '/home' || pathname === '/home/') {
    nextUrl.pathname = '/';
    return NextResponse.redirect(nextUrl, 308);
  }

  if (pathname === '/index' || pathname === '/index/' || pathname === '/index.html' || pathname === '/index.html/') {
    nextUrl.pathname = '/';
    return NextResponse.redirect(nextUrl, 308);
  }

  // Trailing slash canonicalization (but keep root '/').
  if (pathname.length > 1 && pathname.endsWith('/')) {
    nextUrl.pathname = pathname.replace(/\/+$/, '');
    return NextResponse.redirect(nextUrl, 308);
  }

  // Optional lowercase canonicalization.
  // IMPORTANT: This is safest when your CMS slugs are already lowercase.
  // If Storyblok contains mixed-case slugs, redirecting to lowercase could cause 404s.
  const enforceLowercase = process.env.ENFORCE_LOWERCASE_PATHS === 'true';
  if (enforceLowercase && hasUppercase(pathname) && !looksLikeFilePath(pathname)) {
    nextUrl.pathname = pathname.toLowerCase();
    return NextResponse.redirect(nextUrl, 308);
  }

  return null;
}

const setPreviewCookies = (res: NextResponse) => {
  const cookieOpts = { path: '/', sameSite: 'none' as const, secure: true };
  res.cookies.set('__prerender_bypass', 'true', cookieOpts);
  res.cookies.set('__next_preview_data', 'true', cookieOpts);
};

export function proxy(req: NextRequest) {
  // If the request comes from the Storyblok Visual Editor, rewrite to the preview route.
  // This keeps published pages ISR/static for normal traffic while ensuring editor requests
  // always hit the draft+bridge pipeline.
  const hasStoryblokParams =
    req.nextUrl.searchParams.has('_storyblok') || req.nextUrl.searchParams.has('_storyblok_tk');

  const isPreviewPath = req.nextUrl.pathname.startsWith('/sb-preview');
  const isApiPath = req.nextUrl.pathname.startsWith('/api');

  if (hasStoryblokParams && !isPreviewPath && !isApiPath) {
    const nextUrl = req.nextUrl.clone();

    // Map / -> /sb-preview/home because /sb-preview requires a slug.
    if (nextUrl.pathname === '/') {
      nextUrl.pathname = '/sb-preview/home';
    } else {
      nextUrl.pathname = `/sb-preview${nextUrl.pathname}`;
    }

    const res = NextResponse.rewrite(nextUrl);
    setPreviewCookies(res);
    return res;
  }

  // Enable draft mode for Storyblok preview routes
  if (req.nextUrl.pathname.startsWith('/sb-preview')) {
    const res = NextResponse.next();
    setPreviewCookies(res);
    return res;
  }

  // Vanity/canonical redirects (published site).
  const vanity = vanityRedirect(req);
  if (vanity) return vanity;

  return NextResponse.next();
}

// Next.js Middleware entrypoint.
// NOTE: Middleware runs in the Edge runtime. Keep this file Edge-safe (no Node-only imports).
export function middleware(req: NextRequest) {
  return proxy(req);
}

export const config = {
  matcher: [
    // Run proxy for all non-static paths so we can rewrite editor requests.
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|robots.txt).*)',
  ],
};
