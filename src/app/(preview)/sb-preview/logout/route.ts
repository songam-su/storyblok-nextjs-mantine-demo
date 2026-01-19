import { draftMode } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // Disable Next.js draft mode (clears Next preview cookies).
  const dm = await draftMode();
  dm.disable();

  const cookieName = process.env.PREVIEW_AUTH_COOKIE_NAME ?? 'preview_auth';

  const url = new URL(req.url);
  const redirectUrl = new URL('/sb-preview/login', url.origin);
  const res = NextResponse.redirect(redirectUrl, 307);

  // Clear our preview-auth cookie.
  res.cookies.set({
    name: cookieName,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 0,
  });

  return res;
}
