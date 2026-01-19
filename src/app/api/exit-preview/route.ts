import { isPreviewAllowed } from '@/lib/site/previewAccess';
import { draftMode } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const host = req.headers.get('host');
  if (!isPreviewAllowed({ host, headers: req.headers, url: req.url })) {
    return new Response(null, { status: 404 });
  }

  const draft = await draftMode();
  draft.disable();

  const url = new URL(req.url);
  const response = NextResponse.redirect(new URL('/', url.origin), 307);

  // Mirror the /api/preview behavior: normalize preview cookie attributes.
  const previewCookieNames: Array<'__prerender_bypass' | '__next_preview_data'> = [
    '__prerender_bypass',
    '__next_preview_data',
  ];

  previewCookieNames.forEach((name) => {
    const cookie = response.cookies.get(name);
    if (cookie) {
      response.cookies.set({
        ...cookie,
        sameSite: 'none',
        secure: true,
      });
    }
  });

  return response;
}
