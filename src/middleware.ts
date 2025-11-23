// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authMiddleware } from './middleware/auth';

export function middleware(req: NextRequest) {
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
    '/sb-preview/:path*', // Draft mode
    '/dashboard/:path*', // Auth-protected routes
  ],
};
