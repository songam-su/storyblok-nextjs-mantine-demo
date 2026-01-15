import PreviewPage, { generateMetadata as generateSlugMetadata } from './[...slug]/page';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Awaitable<T> = T | Promise<T>;

type SearchParams = Record<string, string | string[] | undefined>;

type PreviewRootPageProps = {
  searchParams: Awaitable<Record<string, string | string[] | undefined>>;
};

type PreviewDelegatedProps = {
  params: Awaitable<{ slug?: string[] }>;
  searchParams: Awaitable<SearchParams>;
};

export async function generateMetadata(props: PreviewRootPageProps) {
  const delegated: PreviewDelegatedProps = {
    params: Promise.resolve({ slug: [] }),
    searchParams: props.searchParams,
  };

  return generateSlugMetadata(delegated);
}

export default async function PreviewRootPage(props: PreviewRootPageProps) {
  const delegated: PreviewDelegatedProps = {
    params: Promise.resolve({ slug: [] }),
    searchParams: props.searchParams,
  };

  return PreviewPage(delegated);
}
