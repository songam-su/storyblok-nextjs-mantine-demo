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
const SITE_CONFIG_SLUG = 'site-config';
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

  const rawBody = await req.text();

  // Storyblok can send signed webhooks (recommended) using these headers.
  // Some plans/configs may not expose a signing secret UI, so we also support
  // "unsigned" webhooks where the query-string `secret` is the only auth.
  const signatureHeader = req.headers.get('x-storyblok-signature');
  const timestampHeader = req.headers.get('x-storyblok-request-timestamp');

  let signatureVerified = false;
  if (signatureHeader && timestampHeader) {
    const timestamp = Number(timestampHeader);
    if (!Number.isFinite(timestamp)) {
      return NextResponse.json({ error: 'Invalid timestamp' }, { status: 401 });
    }

    const nowSeconds = Date.now() / 1000;
    if (Math.abs(nowSeconds - timestamp) > MAX_REQUEST_AGE_SECONDS) {
      return NextResponse.json({ error: 'Stale webhook' }, { status: 401 });
    }

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

    signatureVerified = true;
  }

  let payload: StoryblokWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  let didRevalidateRootLayout = false;
  let didRevalidateHomePage = false;

  // Publishing Storyblok site-config should update navigation/logo site-wide.
  // Revalidate the (pages) layout at the root so all routes pick up the new config
  // without needing to republish every page.
  const publishedSlug = (payload.story?.full_slug ?? payload.slug ?? payload.text ?? '').trim();
  if (publishedSlug === SITE_CONFIG_SLUG || publishedSlug.endsWith(`/${SITE_CONFIG_SLUG}`)) {
    revalidatePath('/', 'layout');
    revalidatePath('/', 'page');
    didRevalidateRootLayout = true;
    didRevalidateHomePage = true;
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

  return NextResponse.json({
    revalidated: true,
    signatureVerified,
    didRevalidateRootLayout,
    didRevalidateHomePage,
    slugs: Array.from(slugs),
  });
}
