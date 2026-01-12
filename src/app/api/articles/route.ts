import { getStories, type StoryblokVersion } from '@/lib/storyblok/api/storyblokServer';
import type { ArticlePage, Category } from '@/lib/storyblok/resources/types/storyblok-components';
import getSbImageData from '@/lib/storyblok/utils/image';
import type { ISbStoryData } from 'storyblok-js-client';

export const revalidate = 600;

type NormalizedCategory = {
  key: string;
  name: string;
  url?: string;
  icon?: { src: string; alt?: string };
};

type NormalizedArticle = {
  key: string;
  title: string;
  url: string;
  image?: { src: string; alt?: string; width?: number; height?: number };
  excerpt?: string;
  categories: NormalizedCategory[];
};

function isCategoryStory(story: ISbStoryData<unknown>): story is ISbStoryData<Category> {
  const content = story?.content as Category | undefined;
  return Boolean(content && content.component === 'category');
}

function parseVersion(value: string | null): StoryblokVersion {
  return value === 'draft' ? 'draft' : 'published';
}

function normalizeCategory(input: ISbStoryData<Category> | string, index: number): NormalizedCategory | null {
  if (!input || typeof input === 'string') return null;

  const slug = input.full_slug ?? input.slug;
  const url = slug ? `/${slug}` : undefined;

  const content = input.content as Category | undefined;
  const displayName = content?.headline || input.name || input.slug;
  if (!displayName) return null;

  const iconData = getSbImageData(content?.icon || null);

  return {
    key: input.uuid || input.id?.toString?.() || input.slug || `${index}`,
    name: displayName,
    url,
    icon: iconData?.src ? { src: iconData.src, alt: iconData.alt || '' } : undefined,
  };
}

function normalizeArticle(story: ISbStoryData<ArticlePage>, index: number): NormalizedArticle | null {
  const content = story.content as ArticlePage | undefined;
  if (!content || content.component !== 'article-page') return null;

  const slug = story.full_slug ?? story.slug;
  if (!slug) return null;

  const url = `/${slug}`;

  const title =
    (typeof content.meta_title === 'string' && content.meta_title.trim().length ? content.meta_title.trim() : null) ||
    (typeof content.headline === 'string' && content.headline.trim().length ? content.headline.trim() : null) ||
    story.name ||
    story.slug;

  if (!title) return null;

  const imageData = getSbImageData(content.image || null);
  const imageWidth = typeof imageData?.width === 'number' ? imageData.width : undefined;
  const imageHeight = typeof imageData?.height === 'number' ? imageData.height : undefined;

  const categoriesRaw = Array.isArray(content.categories) ? content.categories : [];
  const categories = categoriesRaw
    .map((cat, catIndex) => normalizeCategory(cat as any, catIndex))
    .filter(Boolean) as NormalizedCategory[];

  const excerpt =
    typeof content.meta_description === 'string' && content.meta_description.trim().length
      ? content.meta_description.trim()
      : undefined;

  return {
    key: story.uuid || story.id?.toString?.() || story.slug || `${index}`,
    title,
    url,
    image: imageData?.src
      ? {
          src: imageData.src,
          alt: imageData.alt || '',
          width: imageWidth,
          height: imageHeight,
        }
      : undefined,
    excerpt,
    categories,
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const version = parseVersion(url.searchParams.get('version'));

  const fetchOptions: any =
    version === 'draft'
      ? { cache: 'no-store' }
      : {
          cache: 'force-cache',
          next: { revalidate },
        };

  const stories = await getStories({
    version,
    startsWith: 'articles/',
    relations: ['article-page.categories'],
    fetchOptions,
  });

  const categoryStories = await getStories({
    version,
    startsWith: 'categories/',
    relations: [],
    fetchOptions,
    // Use Storyblok-defined ordering within the folder.
    sortBy: 'position:asc',
  });

  const articles = stories
    .map((story, index) => normalizeArticle(story as ISbStoryData<ArticlePage>, index))
    .filter(Boolean) as NormalizedArticle[];

  const categoriesByKey = new Map<string, NormalizedCategory>();
  for (const article of articles) {
    for (const category of article.categories) {
      if (!categoriesByKey.has(category.key)) categoriesByKey.set(category.key, category);
    }
  }

  // Build an ordering index from Storyblok categories folder.
  const categoryOrderIndex = new Map<string, number>();
  categoryStories.filter(isCategoryStory).forEach((story, index) => {
    const normalized = normalizeCategory(story as any, index);
    if (normalized) categoryOrderIndex.set(normalized.key, index);
  });

  const categories = Array.from(categoriesByKey.values()).sort((a, b) => {
    const aIdx = categoryOrderIndex.get(a.key);
    const bIdx = categoryOrderIndex.get(b.key);
    if (typeof aIdx === 'number' && typeof bIdx === 'number') return aIdx - bIdx;
    if (typeof aIdx === 'number') return -1;
    if (typeof bIdx === 'number') return 1;
    return a.name.localeCompare(b.name);
  });

  return Response.json({
    version,
    articles,
    categories,
  });
}
