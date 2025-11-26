import { NextResponse } from 'next/server';

interface AlgoliaWebhookPayload {
  event?: string;
  entity?: string;
  storyId?: number;
  [key: string]: unknown;
}

// Scaffold for future Algolia reindexing webhook...
// TODO: implement Algolia indexing logic and mechanisms...
export async function POST(req: Request) {
  const secret = process.env.ALGOLIA_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Missing ALGOLIA_WEBHOOK_SECRET' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  if (searchParams.get('secret') !== secret) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  let payload: AlgoliaWebhookPayload | null = null;
  try {
    payload = await req.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  // Placeholder: wire up Algolia sync later. Keeping the shape helps future implementation.
  const message = 'Algolia reindex webhook received. Implement indexing logic when ready.';

  return NextResponse.json({ ok: true, message, payload });
}
