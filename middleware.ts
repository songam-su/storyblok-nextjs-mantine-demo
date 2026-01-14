import type { NextRequest } from 'next/server';

// Next.js only auto-detects Middleware from `middleware.ts` (root) or `src/middleware.ts`.
// This repo keeps the actual logic in `src/proxy.ts` so it can be imported elsewhere.
import { middleware as proxyMiddleware } from './src/proxy';

export function middleware(req: NextRequest) {
  return proxyMiddleware(req);
}

// NOTE: Next.js requires this object to be statically analyzable.
export const config = {
  matcher: [
    // Run middleware for all non-static paths so we can rewrite editor requests.
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|robots.txt).*)',
  ],
};
