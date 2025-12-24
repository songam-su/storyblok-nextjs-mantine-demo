import type { StoryblokAsset } from '@/lib/storyblok/resources/types/storyblok';

export type SbImageData = {
  src: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  objectPosition?: string; // e.g. '50% 30%'
};

export function parseFocus(
  focus?: string | null,
  width?: number | null,
  height?: number | null,
): { x: number; y: number } | null {
  if (!focus) return null;

  const cleaned = focus.trim();
  if (!cleaned) return null;

  // Storyblok may emit values like "50x50", "50,50", or "50 50" (percents or pixels)
  const parts = cleaned.split(/[\s,xX]+/).filter(Boolean);
  if (parts.length < 2) return null;

  const rawX = parseFloat(parts[0]);
  const rawY = parseFloat(parts[1]);
  if (!Number.isFinite(rawX) || !Number.isFinite(rawY)) return null;

  const normalize = (value: number, size?: number | null) => {
    if (value > 1) {
      // Storyblok focus values are typically percentages (0-100+); clamp later
      return value / 100;
    }
    return value;
  };

  const x = normalize(rawX, width);
  const y = normalize(rawY, height);

  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

  return { x, y };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

/*
  getSbImageData now accepts an optional `cropRatio` parameter.
  - cropRatio: { x: number; y: number } representing target aspect ratio.
    e.g. { x: 16, y: 9 } or { x: 1, y: 1 }.

  When a crop ratio is provided and the asset has width/height, the function
  adjusts the computed `objectPosition` so the Storyblok focal point remains
  correctly positioned when the image is cropped to the target aspect.
*/
export function getSbImageData(
  asset?: StoryblokAsset | null,
  cropRatio?: { x: number; y: number } | null,
): SbImageData | null {
  if (!asset) return null;

  const src = asset.filename || asset.src || '';
  if (!src) return null;

  const width = asset.width ?? null;
  const height = asset.height ?? null;

  // Default focal point is center if not provided
  const parsedFocus = parseFocus(asset.focus, width, height) || { x: 0.5, y: 0.5 };
  const normalizedFocus = {
    x: clamp(parsedFocus.x, 0, 1),
    y: clamp(parsedFocus.y, 0, 1),
  };

  let objectPosX = normalizedFocus.x; // 0..1
  let objectPosY = normalizedFocus.y; // 0..1

  if (cropRatio && width && height) {
    const desiredAspect = cropRatio.x / cropRatio.y;
    const imageAspect = width / height;

    // If the image is wider than the desired aspect, cropping happens horizontally
    if (imageAspect > desiredAspect) {
      const neededWidth = height * desiredAspect; // in px
      const maxOffsetX = width - neededWidth;
      const focalX = parsedFocus.x * width;
      let cropLeft = focalX - neededWidth / 2;
      cropLeft = clamp(cropLeft, 0, maxOffsetX);
      const focalXInCrop = (focalX - cropLeft) / neededWidth;
      objectPosX = clamp(focalXInCrop, 0, 1);
      // Y unaffected because height is fully used
      objectPosY = parsedFocus.y;
    } else if (imageAspect < desiredAspect) {
      // cropping happens vertically
      const neededHeight = width / desiredAspect;
      const maxOffsetY = height - neededHeight;
      const focalY = parsedFocus.y * height;
      let cropTop = focalY - neededHeight / 2;
      cropTop = clamp(cropTop, 0, maxOffsetY);
      const focalYInCrop = (focalY - cropTop) / neededHeight;
      objectPosY = clamp(focalYInCrop, 0, 1);
      objectPosX = parsedFocus.x;
    } else {
      // equal aspect, no extra adjustments
      objectPosX = parsedFocus.x;
      objectPosY = parsedFocus.y;
    }
  }

  const objectPosition = `${Math.round(objectPosX * 100)}% ${Math.round(objectPosY * 100)}%`;

  return {
    src,
    alt: asset.alt || asset.title || null,
    width: width ?? null,
    height: height ?? null,
    objectPosition,
  };
}

export default getSbImageData;
