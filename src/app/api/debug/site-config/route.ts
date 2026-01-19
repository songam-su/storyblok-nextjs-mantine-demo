import { fetchStory } from '@/lib/storyblok/api/client';
import type { StoryblokAsset } from '@/lib/storyblok/resources/types/storyblok';
import { NextResponse } from 'next/server';

function summarizeAsset(asset: unknown) {
  const a = asset as Partial<StoryblokAsset> | null | undefined;
  return {
    filename: typeof a?.filename === 'string' ? a.filename : null,
    alt: typeof a?.alt === 'string' ? a.alt : null,
    title: typeof a?.title === 'string' ? a.title : null,
  };
}

function summarizeSiteConfigContent(content: any) {
  return {
    header_logo: summarizeAsset(content?.header_logo),
    header_logo_text: summarizeAsset(content?.header_logo_text),
    header_logo_dark: summarizeAsset(content?.header_logo_dark),
    header_logo_text_dark: summarizeAsset(content?.header_logo_text_dark),
  };
}

export async function GET() {
  const nodeEnv = process.env.NODE_ENV;
  const vercelEnv = process.env.VERCEL_ENV;

  // Safety: never expose debug endpoints in production.
  if (nodeEnv === 'production' || vercelEnv === 'production') {
    return new Response(null, { status: 404 });
  }

  const [published, draft] = await Promise.all([
    fetchStory('site-config', 'published'),
    fetchStory('site-config', 'draft'),
  ]);

  return NextResponse.json({
    env: { nodeEnv, vercelEnv },
    published: published
      ? {
          id: (published as any).id ?? null,
          uuid: (published as any).uuid ?? null,
          full_slug: (published as any).full_slug ?? null,
          name: (published as any).name ?? null,
          content: summarizeSiteConfigContent((published as any).content),
        }
      : null,
    draft: draft
      ? {
          id: (draft as any).id ?? null,
          uuid: (draft as any).uuid ?? null,
          full_slug: (draft as any).full_slug ?? null,
          name: (draft as any).name ?? null,
          content: summarizeSiteConfigContent((draft as any).content),
        }
      : null,
  });
}
