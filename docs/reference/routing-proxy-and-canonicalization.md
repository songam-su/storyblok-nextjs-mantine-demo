# Routing Proxy, Redirects, and Canonicalization

Purpose: document the request-level routing logic that keeps **published** traffic fast (ISR/static) while still supporting Storyblok **Visual Editor** preview, plus URL canonicalization rules.

## Where this runs

- Next.js Middleware entrypoint: [middleware.ts](../../middleware.ts)
- Implementation: [src/proxy.ts](../../src/proxy.ts)

Important: Next.js Middleware runs in the **Edge runtime**. Keep middleware dependencies Edge-safe (no Node-only APIs).

## Visual Editor → preview rewrite

When Storyblok opens a URL inside the Visual Editor, it appends query params like `_storyblok` / `_storyblok_tk`.

Middleware detects those params and rewrites requests into the preview route:

- `/` → `/sb-preview/home`
- `/<any-path>` → `/sb-preview/<any-path>`

This keeps:

- Published routes under `app/(pages)/...` ISR-friendly
- Preview routes under `app/(preview)/sb-preview/...` draft-friendly (Bridge + live updates)

## Preview cookies

For requests that are already under `/sb-preview/*`, middleware sets the standard Next draft-mode cookies:

- `__prerender_bypass`
- `__next_preview_data`

This helps keep draft mode consistent across navigation while previewing.

## Vanity + canonical redirects

Middleware enforces a few “nice URL” redirects (308):

- `/home` and `/home/` → `/`
- `/index`, `/index/`, `/index.html`, `/index.html/` → `/`
- Trailing slashes are stripped (except for root `/`)

### Optional lowercase redirect

There is an opt-in lowercase redirect:

- Env var: `ENFORCE_LOWERCASE_PATHS=true`
- Effect: if a request path contains uppercase characters, redirect to the lowercase variant.

Warning: only enable this once your Storyblok slugs are already consistently lowercase.

## Canonical URLs (metadata)

Published routes emit canonical URLs via Next.js metadata `alternates.canonical`.

Rules:

- `/home` canonicalizes to `/`
- Trailing slashes are stripped (except `/`)

Preview routes under `/sb-preview/*` intentionally do **not** emit canonical URLs.

See:

- Canonical helper: [src/lib/site/canonicalPath.ts](../../src/lib/site/canonicalPath.ts)
- URL builder: [src/lib/site/canonicalUrl.ts](../../src/lib/site/canonicalUrl.ts)
