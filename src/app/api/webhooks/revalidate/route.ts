import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

interface StoryblokWebhookPayload {
  action?: string;
  story?: {
    full_slug?: string;
    alternates?: Array<{ full_slug?: string }>;
  };
  slug?: string;
  text?: string;
  cached_urls?: string[];
}

const HOME_SLUG = 'home';
const MAX_REQUEST_AGE_SECONDS = 5 * 60; // 5 minutes

const normalizeSlugToPath = (slug?: string | null) => {
  if (!slug) return null;
  if (slug === HOME_SLUG || slug === '/') return '/';
  return slug.startsWith('/') ? slug : `/${slug}`;
};

export async function POST(req: Request) {
  const secret = process.env.STORYBLOK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Missing STORYBLOK_WEBHOOK_SECRET' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  if (searchParams.get('secret') !== secret) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const signatureHeader = req.headers.get('x-storyblok-signature');
  const timestampHeader = req.headers.get('x-storyblok-request-timestamp');

  if (!signatureHeader || !timestampHeader) {
    return NextResponse.json({ error: 'Missing signature or timestamp' }, { status: 401 });
  }

  const timestamp = Number(timestampHeader);
  if (!Number.isFinite(timestamp)) {
    return NextResponse.json({ error: 'Invalid timestamp' }, { status: 401 });
  }

  const nowSeconds = Date.now() / 1000;
  if (Math.abs(nowSeconds - timestamp) > MAX_REQUEST_AGE_SECONDS) {
    return NextResponse.json({ error: 'Stale webhook' }, { status: 401 });
  }

  const rawBody = await req.text();

  const expectedSignature = crypto.createHmac('sha1', secret).update(rawBody).digest('hex');
  const providedSignature = signatureHeader.trim().toLowerCase();

  const signaturesMatch = (() => {
    const expectedBuf = Buffer.from(expectedSignature, 'hex');
    const providedBuf = Buffer.from(providedSignature, 'hex');
    if (expectedBuf.length !== providedBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, providedBuf);
  })();

  if (!signaturesMatch) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: StoryblokWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const slugs = new Set<string>();

  const mainSlug = normalizeSlugToPath(payload.story?.full_slug ?? payload.slug ?? payload.text);
  if (mainSlug) slugs.add(mainSlug);

  payload.story?.alternates?.forEach((alternate) => {
    const altSlug = normalizeSlugToPath(alternate.full_slug);
    if (altSlug) slugs.add(altSlug);
  });

  payload.cached_urls?.forEach((url) => {
    const cachedSlug = normalizeSlugToPath(url);
    if (cachedSlug) slugs.add(cachedSlug);
  });

  if (!slugs.size) {
    return NextResponse.json({ error: 'No slugs to revalidate' }, { status: 400 });
  }

  await Promise.all(Array.from(slugs).map((slug) => revalidatePath(slug)));

  return NextResponse.json({ revalidated: true, slugs: Array.from(slugs) });
}
