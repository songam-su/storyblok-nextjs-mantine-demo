import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Auth Middleware
 * - Protects routes by checking for an auth token in cookies.
 * - Redirects to /login if not authenticated.
 */
export function authMiddleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
