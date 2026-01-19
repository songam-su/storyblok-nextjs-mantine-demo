import { sendNewsletterSignupEmail } from '@/lib/email/m365Mailer';
import { DEMO_FORM_DISABLED_MESSAGE, DISABLE_FORM_SUBMIT } from '@/lib/site/demoFlags';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const NewsletterPayload = z.object({
  email: z.string().trim().email().max(254),
});

export async function POST(req: Request) {
  if (DISABLE_FORM_SUBMIT) {
    return NextResponse.json({ error: DEMO_FORM_DISABLED_MESSAGE }, { status: 403 });
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = NewsletterPayload.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await sendNewsletterSignupEmail(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to send email', message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
