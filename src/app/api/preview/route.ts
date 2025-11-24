import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug') || 'home';

  // Enable Next.js draft mode
  (await draftMode()).enable();

  // Redirect to your preview page
  redirect(`/preview/${slug}`);
}
