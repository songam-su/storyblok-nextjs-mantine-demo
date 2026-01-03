import crypto from 'crypto';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { POST } from '@/app/api/webhooks/revalidate/route';
import { revalidatePath } from 'next/cache';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Storyblok revalidate webhook', () => {
  const secret = 'testsecret';

  beforeEach(() => {
    vi.mocked(revalidatePath).mockReset();
    process.env.STORYBLOK_WEBHOOK_SECRET = secret;
  });

  const buildRequest = (body: any, opts?: { timestampOffset?: number; signatureOverride?: string }) => {
    const rawBody = JSON.stringify(body);
    const timestamp = Math.floor(Date.now() / 1000) + (opts?.timestampOffset ?? 0);
    const signature =
      opts?.signatureOverride ?? crypto.createHmac('sha1', secret).update(rawBody).digest('hex');

    return new Request(`http://localhost/api/webhooks/revalidate?secret=${secret}`, {
      method: 'POST',
      body: rawBody,
      headers: {
        'content-type': 'application/json',
        'x-storyblok-signature': signature,
        'x-storyblok-request-timestamp': String(timestamp),
      },
    });
  };

  it('accepts valid signature and timestamp, revalidates collected slugs', async () => {
    const payload = {
      story: {
        full_slug: 'foo/bar',
        alternates: [{ full_slug: 'foo/de' }],
      },
      cached_urls: ['/foo/bar', '/baz'],
    };

    const req = buildRequest(payload);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toMatchObject({ revalidated: true, slugs: ['/foo/bar', '/foo/de', '/baz'] });
    expect(revalidatePath).toHaveBeenCalledTimes(3);
    expect(revalidatePath).toHaveBeenCalledWith('/foo/bar');
    expect(revalidatePath).toHaveBeenCalledWith('/foo/de');
    expect(revalidatePath).toHaveBeenCalledWith('/baz');
  });

  it('rejects invalid signature', async () => {
    const payload = { story: { full_slug: 'foo' } };
    const req = buildRequest(payload, { signatureOverride: 'deadbeef' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data?.error).toMatch(/Invalid signature/i);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('rejects stale timestamp', async () => {
    const payload = { story: { full_slug: 'foo' } };
    const req = buildRequest(payload, { timestampOffset: -10 * 60 });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data?.error).toMatch(/Stale webhook/i);
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
