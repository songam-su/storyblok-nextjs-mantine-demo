import { draftMode } from 'next/headers';

export async function GET() {
  const draft = await draftMode();
  draft.disable();

  // Optionally, log out the user from authentication here if needed

  return new Response(null, {
    status: 307,
    headers: { Location: '/' },
  });
}
