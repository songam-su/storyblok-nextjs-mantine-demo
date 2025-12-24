import type { StoryblokAsset } from '@/lib/storyblok/resources/types/storyblok';

export type SbImageData = {
  src: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  objectPosition?: string; // e.g. '50% 30%'
};

export function parseFocus(focus?: string | null): { x: number; y: number } | null {
  if (!focus) return null;
  const cleaned = focus.trim();
  const parts = cleaned.split(/[,\s]+/);
  if (parts.length < 2) return null;
  const x = parseFloat(parts[0]);
  const y = parseFloat(parts[1]);
  if (Number.isFinite(x) && Number.isFinite(y)) return { x, y };
  return null;
}

export function getSbImageData(asset?: StoryblokAsset | null): SbImageData | null {
  if (!asset) return null;

  // Prefer `filename` where upstream code expects it, otherwise use `src`.
  const src = asset.filename || asset.src || '';
  if (!src) return null;

  const focus = parseFocus(asset.focus);
  const objectPosition = focus ? `${Math.round(focus.x * 100)}% ${Math.round(focus.y * 100)}%` : undefined;

  return {
    src,
    alt: asset.alt || asset.title || null,
    width: asset.width ?? null,
    height: asset.height ?? null,
    objectPosition,
  };
}

export default getSbImageData;
