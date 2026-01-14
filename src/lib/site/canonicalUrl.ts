import 'server-only';

import { canonicalizePathname } from '@/lib/site/canonicalPath';
import { METADATA_BASE } from '@/lib/site/siteUrl';

export function getCanonicalUrl(pathname: string): URL {
  return new URL(canonicalizePathname(pathname), METADATA_BASE);
}
