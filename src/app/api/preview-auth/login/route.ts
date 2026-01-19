import crypto from 'crypto';
import { draftMode } from 'next/headers';
import { NextResponse } from 'next/server';

function base64Url(input: Buffer) {
  return input.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function createPreviewAuthToken(secret: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = base64Url(crypto.randomBytes(16));
  const payload = `${timestamp}.${nonce}`;
  const sig = base64Url(crypto.createHmac('sha256', secret).update(payload).digest());
  return `${payload}.${sig}`;
}

export async function POST(req: Request) {
  const passwordEnv = process.env.PREVIEW_GATE_PASSWORD;
  const secret = process.env.PREVIEW_AUTH_SECRET;

  if (!passwordEnv || !secret) {
    return NextResponse.json({ ok: false, error: 'Preview login is not configured.' }, { status: 500 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  const password = typeof body?.password === 'string' ? body.password : '';
  const nextPath = typeof body?.next === 'string' ? body.next : '/sb-preview';

  if (password !== passwordEnv) {
    return NextResponse.json({ ok: false, error: 'Invalid password.' }, { status: 401 });
  }

  // Enable Next draft mode (helps in cases where other routes rely on it).
  const dm = await draftMode();
  dm.enable();

  const cookieName = process.env.PREVIEW_AUTH_COOKIE_NAME ?? 'preview_auth';
  const token = createPreviewAuthToken(secret);

  const res = NextResponse.json({ ok: true, next: nextPath });
  res.cookies.set({
    name: cookieName,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}
