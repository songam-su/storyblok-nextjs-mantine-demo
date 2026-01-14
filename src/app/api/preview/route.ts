import { isPreviewAllowed } from '@/lib/site/previewAccess';
import { draftMode } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const host = req.headers.get('host');
  if (!isPreviewAllowed({ host, headers: req.headers, url: req.url })) {
    return new Response(null, { status: 404 });
  }

  const url = new URL(req.url);
  let slug = url.searchParams.get('slug') || '/';
  slug = slug.startsWith('/') ? slug.slice(1) : slug;

  const draft = await draftMode();
  draft.enable();

  const redirectUrl = new URL(`/sb-preview/${slug}`, url.origin);
  const response = NextResponse.redirect(redirectUrl, 307);

  // Ensure preview cookies survive inside Storyblok's cross-site iframe
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
