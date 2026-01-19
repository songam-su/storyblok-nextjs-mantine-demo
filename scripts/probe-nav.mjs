/*
  Probes all nav links rendered by the site header and reports HTTP status.

  Usage:
    node scripts/probe-nav.mjs
    BASE_URL=https://localhost:3010 node scripts/probe-nav.mjs

  Notes:
  - Dev server uses a self-signed cert; this script disables TLS verification.
  - This is an HTTP-level probe (server errors + obvious error pages). It does not execute client JS.
*/

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const DEFAULT_BASE_URL = 'https://localhost:3010';
const baseUrl = (process.env.BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');

const stripQueryHash = (href) => {
  const noQuery = href.split('?')[0] ?? href;
  const noHash = noQuery.split('#')[0] ?? noQuery;
  return noHash;
};

const normalizePath = (href) => {
  const value = stripQueryHash(href).trim();
  if (!value.startsWith('/')) return null;
  if (value.startsWith('//')) return null;
  if (value.startsWith('/_next')) return null;
  if (value.startsWith('/api')) return null;
  return value === '' ? '/' : value;
};

const timeoutFetch = async (url, { timeoutMs = 15000 } = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      redirect: 'manual',
      signal: controller.signal,
      headers: {
        // Encourage HTML payloads
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    return res;
  } finally {
    clearTimeout(timer);
  }
};

const readTextLimited = async (res, limit = 120_000) => {
  const text = await res.text();
  return text.length > limit ? text.slice(0, limit) : text;
};

const extractNavHrefs = (html) => {
  // NavItem renders a Link with data-label. Use that as the "nav-ish" signal.
  const hrefs = new Set();
  const re = /<a\b[^>]*\bhref="([^"]+)"[^>]*\bdata-label="[^"]*"[^>]*>/gi;
  let match;
  while ((match = re.exec(html))) {
    const rawHref = match[1];
    if (!rawHref) continue;
    const path = normalizePath(rawHref);
    if (!path) continue;
    hrefs.add(path);
  }

  // Fallback: if we didn't find any data-label links, just grab internal anchors.
  if (hrefs.size === 0) {
    const reAll = /<a\b[^>]*\bhref="([^"]+)"[^>]*>/gi;
    while ((match = reAll.exec(html))) {
      const rawHref = match[1];
      if (!rawHref) continue;
      const path = normalizePath(rawHref);
      if (!path) continue;
      hrefs.add(path);
    }
  }

  return [...hrefs].sort();
};

const looksLikeNextErrorPage = (html) => {
  const haystack = html.toLowerCase();
  return (
    haystack.includes('application error') ||
    haystack.includes('internal server error') ||
    haystack.includes('error occurred') ||
    haystack.includes('__next_error__') ||
    haystack.includes('nextjs-error')
  );
};

const main = async () => {
  const seedUrls = ['/', '/sb-preview/home'];

  let homeHtml = '';
  let seedUsed = null;

  for (const seedPath of seedUrls) {
    const url = `${baseUrl}${seedPath}`;
    try {
      const res = await timeoutFetch(url, { timeoutMs: 15000 });
      const body = await readTextLimited(res, 80_000);
      if (res.status >= 200 && res.status < 500 && body.includes('<a')) {
        homeHtml = body;
        seedUsed = seedPath;
        break;
      }
    } catch {
      // ignore and try next
    }
  }

  if (!homeHtml) {
    console.error(`[probe-nav] Could not fetch a seed page from ${baseUrl}. Is \"pnpm dev\" running?`);
    process.exit(2);
  }

  const navPaths = extractNavHrefs(homeHtml);

  if (navPaths.length === 0) {
    console.error(`[probe-nav] No nav links found on ${seedUsed}.`);
    process.exit(3);
  }

  // Always include root; nav sometimes omits it.
  if (!navPaths.includes('/')) navPaths.unshift('/');

  console.log(`[probe-nav] Base URL: ${baseUrl}`);
  console.log(`[probe-nav] Seed page: ${seedUsed}`);
  console.log(`[probe-nav] Found ${navPaths.length} candidate nav route(s):`);
  for (const p of navPaths) console.log(`  - ${p}`);

  console.log('');
  const results = [];

  for (const path of navPaths) {
    const url = `${baseUrl}${path}`;
    const started = Date.now();
    try {
      const res = await timeoutFetch(url, { timeoutMs: 20000 });
      const ms = Date.now() - started;
      const ct = res.headers.get('content-type') || '';
      const text = ct.includes('text/html') ? await readTextLimited(res, 60_000) : '';
      const hasErrorMarker = text ? looksLikeNextErrorPage(text) : false;

      results.push({ path, url, status: res.status, ms, contentType: ct, hasErrorMarker });
      const marker = hasErrorMarker ? ' (ERROR_MARKER)' : '';
      console.log(`${String(res.status).padStart(3, ' ')} ${path} ${ms}ms${marker}`);
    } catch (err) {
      const ms = Date.now() - started;
      const name = err && typeof err === 'object' && 'name' in err ? String(err.name) : 'Error';
      const message = err && typeof err === 'object' && 'message' in err ? String(err.message) : String(err);
      results.push({
        path,
        url,
        status: 'FETCH_ERROR',
        ms,
        contentType: '',
        hasErrorMarker: true,
        error: `${name}: ${message}`,
      });
      console.log(`ERR ${path} ${ms}ms (${name}: ${message})`);
    }
  }

  const bad = results.filter(
    (r) => r.status === 'FETCH_ERROR' || (typeof r.status === 'number' && r.status >= 400) || r.hasErrorMarker
  );

  if (bad.length) {
    console.log('\n[probe-nav] Issues detected:');
    for (const r of bad) {
      const status = typeof r.status === 'number' ? String(r.status) : r.status;
      console.log(
        `  - ${status} ${r.path}${r.error ? ` :: ${r.error}` : ''}${r.hasErrorMarker ? ' (error marker)' : ''}`
      );
    }
    process.exit(1);
  }

  console.log('\n[probe-nav] All nav routes look OK (HTTP-level).');
};

main().catch((err) => {
  console.error('[probe-nav] Unhandled error:', err);
  process.exit(1);
});
