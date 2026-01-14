export function canonicalizePathname(input: string): string {
  let pathname = (input ?? '').trim();

  if (!pathname.startsWith('/')) pathname = `/${pathname}`;

  // Defensive: callers should pass only the pathname, but strip query/hash if present.
  pathname = pathname.split('?')[0]?.split('#')[0] ?? '/';

  // Normalize repeated slashes.
  pathname = pathname.replace(/\/{2,}/g, '/');

  // Strip trailing slashes (except for root).
  if (pathname.length > 1) pathname = pathname.replace(/\/+$/, '');

  // Canonicalize legacy home paths.
  if (pathname === '/home') return '/';
  if (pathname.startsWith('/home/')) {
    const rest = pathname.slice('/home'.length);
    return rest.length ? rest : '/';
  }

  return pathname || '/';
}
