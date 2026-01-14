import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

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

function handleEdgeRequest(_req: NextRequest): NextResponse {
  // Placeholder: currently no-op.
  //
  // Example (future): lock down preview routes.
  //
  // const isPreview = _req.nextUrl.pathname.startsWith('/sb-preview');
  // const hasAuth = _req.cookies.has('your_auth_cookie');
  // if (isPreview && !hasAuth) {
  //   const url = _req.nextUrl.clone();
  //   url.pathname = '/login';
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}

export function proxy(req: NextRequest): NextResponse {
  return handleEdgeRequest(req);
}
