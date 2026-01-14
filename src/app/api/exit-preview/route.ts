import { isPreviewAllowed } from '@/lib/site/previewAccess';
import { draftMode } from 'next/headers';

export async function GET(req: Request) {
  const host = req.headers.get('host');
  if (!isPreviewAllowed({ host, headers: req.headers, url: req.url })) {
    return new Response(null, { status: 404 });
  }

  const draft = await draftMode();
  draft.disable();

  // Optionally, log out the user from authentication here if needed

  return new Response(null, {
    status: 307,
    headers: { Location: '/' },
  });
}
