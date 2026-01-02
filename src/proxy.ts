// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authMiddleware } from './middleware/auth';

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
    res.cookies.set('__prerender_bypass', 'true', { path: '/' });
    res.cookies.set('__next_preview_data', 'true', { path: '/' });
    return res;
  }

  // Enable draft mode for Storyblok preview routes
  if (req.nextUrl.pathname.startsWith('/sb-preview')) {
    const res = NextResponse.next();
    res.cookies.set('__prerender_bypass', 'true', { path: '/' });
    res.cookies.set('__next_preview_data', 'true', { path: '/' });
    return res;
  }

  // Apply auth middleware for protected routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    return authMiddleware(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run proxy for all non-static paths so we can rewrite editor requests.
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
