import 'server-only';

/**
 * Canonical base URL for metadata (OpenGraph, canonical URLs, etc.).
 *
 * Set one of these environment variables at build/runtime:
 * - `SITE_URL` (recommended)
 * - `NEXT_PUBLIC_SITE_URL`
 */
const rawSiteUrl = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL;

export const SITE_URL = (rawSiteUrl && rawSiteUrl.trim().length ? rawSiteUrl.trim() : 'https://storyblok-nextjs.andrewcaperton.me')
  // normalize: avoid accidental trailing slashes
  .replace(/\/+$/, '');

export const METADATA_BASE = new URL(SITE_URL);
