import 'server-only';

import StoryblokClient, {
  type ISbCustomFetch,
  type ISbStoriesParams,
  type ISbStoryData,
  type ISbStoryParams,
} from 'storyblok-js-client';

export type StoryblokVersion = 'published' | 'draft';

const DEFAULT_RELATIONS = [
  'featured-articles-section.articles',
  'banner-reference.banners',
  'article-page.call_to_action',
  'article-page.categories',
  'testimonials-section.testimonials',
];

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function looksLikeUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_REGEX.test(value);
}

function getStoryblokToken(version: StoryblokVersion): string {
  const previewToken = process.env.STORYBLOK_PREVIEW_TOKEN;
  const publicToken = process.env.STORYBLOK_PUBLIC_TOKEN;

  if (version === 'draft') {
    if (!previewToken) throw new Error('Missing Storyblok preview token env var (STORYBLOK_PREVIEW_TOKEN)');
    return previewToken;
  }

  if (publicToken) return publicToken;
  if (previewToken) return previewToken;
  throw new Error('Missing Storyblok public/preview token env var (STORYBLOK_PUBLIC_TOKEN or STORYBLOK_PREVIEW_TOKEN)');
}

function createServerClient(version: StoryblokVersion) {
  const accessToken = getStoryblokToken(version);
  const region = process.env.STORYBLOK_REGION;

  return new StoryblokClient({
    accessToken,
    ...(region ? { region } : null),
  });
}

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function getErrorStatusCode(error: unknown): number | null {
  if (!isPlainObject(error)) return null;

  const directStatus = error.status;
  if (typeof directStatus === 'number') return directStatus;

  const response = error.response;
  if (isPlainObject(response) && typeof response.status === 'number') return response.status;

  return null;
}

function isNotFoundError(error: unknown): boolean {
  const status = getErrorStatusCode(error);
  if (status === 404) return true;

  const message = error instanceof Error ? error.message : null;
  if (typeof message === 'string' && message.toLowerCase().includes('could not be found')) return true;

  if (isPlainObject(error)) {
    const maybeMessage = error.message;
    if (typeof maybeMessage === 'string' && maybeMessage.toLowerCase().includes('could not be found')) return true;
  }

  return false;
}

function collectMultilinkStoryUuids(root: unknown, uuids: Set<string>) {
  if (Array.isArray(root)) {
    for (const item of root) collectMultilinkStoryUuids(item, uuids);
    return;
  }

  if (!isPlainObject(root)) return;

  const fieldtype = root.fieldtype;
  const linktype = root.linktype;

  if (fieldtype === 'multilink' && linktype === 'story') {
    const story = root.story;
    if (isPlainObject(story) && looksLikeUuid(story.uuid)) {
      uuids.add(story.uuid);
    } else if (looksLikeUuid(root.id)) {
      uuids.add(root.id);
    }
  }

  for (const value of Object.values(root)) {
    collectMultilinkStoryUuids(value, uuids);
  }
}

function applyMultilinkStoryUrls(root: unknown, byUuid: Map<string, { full_slug: string }>) {
  if (Array.isArray(root)) {
    for (const item of root) applyMultilinkStoryUrls(item, byUuid);
    return;
  }

  if (!isPlainObject(root)) return;

  const fieldtype = root.fieldtype;
  const linktype = root.linktype;

  if (fieldtype === 'multilink' && linktype === 'story') {
    const story = root.story;
    const uuid =
      (isPlainObject(story) && looksLikeUuid(story.uuid) ? story.uuid : null) ??
      (looksLikeUuid(root.id) ? root.id : null);

    if (uuid) {
      const resolved = byUuid.get(uuid);
      if (resolved?.full_slug) {
        root.cached_url = resolved.full_slug;

        if (isPlainObject(story)) {
          story.full_slug = resolved.full_slug;
        } else {
          root.story = { uuid, full_slug: resolved.full_slug } as any;
        }
      }
    }
  }

  for (const value of Object.values(root)) {
    applyMultilinkStoryUrls(value, byUuid);
  }
}

async function fetchStoriesByUuids(
  client: StoryblokClient,
  uuids: string[],
  version: StoryblokVersion,
  fetchOptions?: ISbCustomFetch
) {
  if (!uuids.length) return [] as ISbStoryData[];

  const chunks: string[][] = [];
  const CHUNK_SIZE = 50;
  for (let i = 0; i < uuids.length; i += CHUNK_SIZE) {
    chunks.push(uuids.slice(i, i + CHUNK_SIZE));
  }

  const allStories: ISbStoryData[] = [];

  for (const chunk of chunks) {
    const params: ISbStoriesParams = {
      version,
      by_uuids: chunk.join(','),
      resolve_links: '0',
    };

    const res = await client.getStories(params, fetchOptions);
    const stories = Array.isArray(res?.data?.stories) ? (res.data.stories as ISbStoryData[]) : [];
    allStories.push(...stories);
  }

  return allStories;
}

export async function getStory(
  slug: string,
  options: { version: StoryblokVersion; relations?: string[]; fetchOptions?: any }
) {
  const { version } = options;
  const relations = options.relations ?? DEFAULT_RELATIONS;

  try {
    const client = createServerClient(version);

    // We intentionally disable built-in link resolution and fix links *after* relation resolution.
    const params: ISbStoryParams = {
      version,
      resolve_relations: relations,
      resolve_links: '0',
      ...(version === 'draft' ? { cv: Date.now() } : null),
    };

    const fetchOptions: ISbCustomFetch | undefined = options.fetchOptions as any;

    const res = await client.getStory(slug, params, fetchOptions);
    const story = res?.data?.story as ISbStoryData | undefined;
    if (!story) return null;

    // Deep-resolve multilink story URLs throughout the tree (including inside resolved relations).
    const uuids = new Set<string>();
    collectMultilinkStoryUuids(story as unknown as JsonValue, uuids);

    if (uuids.size) {
      const linkedStories = await fetchStoriesByUuids(client, Array.from(uuids), version, fetchOptions);
      const byUuid = new Map<string, { full_slug: string }>();
      for (const s of linkedStories) {
        if (s?.uuid && s?.full_slug) byUuid.set(s.uuid, { full_slug: s.full_slug });
      }

      applyMultilinkStoryUrls(story as unknown as JsonValue, byUuid);
    }

    return story;
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const isConfigError = typeof message === 'string' && message.includes('Missing Storyblok');

    // Bubble up configuration errors; swallow transient fetch issues to avoid user-facing 500s.
    if (isConfigError) throw error;

    // A missing Storyblok story is an expected outcome for unknown slugs (404 page rendering).
    // Don't log it as an error (Next dev overlays console.error).
    if (isNotFoundError(error)) return null;

    console.error('Storyblok getStory failed', { slug, version, error });
    return null;
  }
}

export async function getStories(options: {
  version: StoryblokVersion;
  startsWith?: string;
  perPage?: number;
  relations?: string[];
  fetchOptions?: any;
  sortBy?: string;
}) {
  const {
    version,
    startsWith,
    perPage = 100,
    relations = DEFAULT_RELATIONS,
    fetchOptions,
    sortBy = 'first_published_at:desc',
  } = options;

  try {
    const client = createServerClient(version);

    const allStories: ISbStoryData[] = [];
    let page = 1;

    while (true) {
      const params: ISbStoriesParams = {
        version,
        page,
        per_page: perPage,
        resolve_relations: relations,
        resolve_links: '0',
        ...(startsWith ? { starts_with: startsWith } : null),
        ...(sortBy ? { sort_by: sortBy } : null),
        ...(version === 'draft' ? { cv: Date.now() } : null),
      };

      const res = await client.getStories(params, fetchOptions as ISbCustomFetch | undefined);
      const stories = Array.isArray(res?.data?.stories) ? (res.data.stories as ISbStoryData[]) : [];

      allStories.push(...stories);

      if (stories.length < perPage) break;
      page += 1;
    }

    return allStories;
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const isConfigError = typeof message === 'string' && message.includes('Missing Storyblok');

    if (isConfigError) throw error;

    console.error('Storyblok getStories failed', { version, startsWith, error });
    return [] as ISbStoryData[];
  }
}

export async function getLinks(options: {
  version: StoryblokVersion;
  startsWith?: string;
  perPage?: number;
  fetchOptions?: any;
}) {
  const { version, startsWith, perPage = 100, fetchOptions } = options;

  try {
    const client = createServerClient(version);

    const collected: any[] = [];
    let page = 1;

    while (true) {
      const query: any = {
        version,
        per_page: perPage,
        page,
        ...(startsWith ? { starts_with: startsWith } : null),
        ...(version === 'draft' ? { cv: Date.now() } : null),
      };

      // storyblok-js-client supports arbitrary endpoints via `get()`.
      const res = await (client as any).get('cdn/links', query, fetchOptions as ISbCustomFetch | undefined);
      const linksObj = res?.data?.links ?? {};
      const links = Object.values(linksObj);

      if (!links.length) break;
      collected.push(...(links as any[]));

      const total = res?.data?.total;
      if (typeof total === 'number' && collected.length >= total) break;
      if (links.length < perPage) break;

      page += 1;
    }

    return collected;
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const isConfigError = typeof message === 'string' && message.includes('Missing Storyblok');

    if (isConfigError) throw error;

    console.error('Storyblok getLinks failed', { version, startsWith, error });
    return [] as any[];
  }
}
