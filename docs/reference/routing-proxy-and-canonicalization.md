# Routing Proxy, Redirects, and Canonicalization

Purpose: document the request-level routing logic that keeps **published** traffic fast (ISR/static) while still supporting Storyblok **Visual Editor** preview, plus URL canonicalization rules.

## Where this runs

- Routing rules: [next.config.mjs](../../next.config.mjs) (`redirects()` + `rewrites()`)
- Edge request proxy (404 handling + future auth/preview gating): [src/proxy.ts](../../src/proxy.ts)

Important: the proxy runs in the **Edge runtime**. Keep dependencies Edge-safe (no Node-only APIs).

## Visual Editor → preview rewrite

When Storyblok opens a URL inside the Visual Editor, it appends query params like `_storyblok` / `_storyblok_tk`.

Next config rewrites detect those params and route requests into the preview route:

- `/` → `/sb-preview/home`
- `/<any-path>` → `/sb-preview/<any-path>`

This keeps:

- Published routes under `app/(pages)/...` ISR-friendly
- Preview routes under `app/(preview)/sb-preview/...` draft-friendly (Bridge + live updates)

Note: these rewrites do not enable Next.js draft mode by themselves (they can’t set cookies). If you need Next draft mode cookies (recommended for consistent preview behavior), use `GET /api/preview?slug=...`.

## Preview URL normalization

Storyblok slugs are treated as lowercase in this repo.

- The preview route normalizes incoming preview slugs to lowercase when fetching draft stories.
- Mixed-case vanity URLs (for example `/sb-preview/HoMe`) are redirected to the lowercase canonical URL (`/sb-preview/home`) while preserving the query string.

## Preview cookies

Draft mode is enabled via the preview endpoints (for example `GET /api/preview`), which set the standard Next preview cookies. If we later need the Visual Editor iframe to auto-enable draft mode without using `/api/preview`, that would be a good reason to reintroduce Edge middleware using [src/proxy.ts](../../src/proxy.ts) as the shared implementation.

## Unknown published slugs (true 404 + CMS 404 content)

Goal: when a user (or bot) requests an unknown published URL (for example `/asdf`), we want:

- A **true** HTTP `404` response (SEO-correct; not a “soft 404”)
- The **CMS-driven 404 page** experience (Storyblok story)
- Defensive headers: `X-Robots-Tag` and `Cache-Control: no-store`
- A canonical signal for the requested URL via the HTTP `Link` header

How it works:

- The Edge proxy performs a lightweight “does this Storyblok story exist?” check for `GET`/`HEAD` requests.
- If the story does **not** exist, it rewrites to an internal 404 route while keeping the browser URL unchanged.
- The response is returned with a `404` status and defensive headers.

Notes:

- This mechanism intentionally fails open if Storyblok tokens are missing or Storyblok is unreachable (to avoid false 404s).
- The internal 404 route is not intended to be indexed.

## Vanity + canonical redirects

Next config enforces a few “nice URL” redirects:

- `/home` and `/home/` → `/`
- `/index`, `/index/`, `/index.html`, `/index.html/` → `/`
- Trailing slashes are stripped (except for root `/`)

## Canonical URLs (metadata)

Published routes emit canonical URLs via Next.js metadata `alternates.canonical`.

Note on 404s: for **true** HTTP `404` responses, Next.js App Router may omit the HTML canonical tag. In this repo, the canonical signal for 404s is provided via the HTTP `Link` header instead (see [src/proxy.ts](../../src/proxy.ts)).

Rules:

- `/home` canonicalizes to `/`
- Trailing slashes are stripped (except `/`)

Preview routes under `/sb-preview/*` set `alternates.canonical` to the matching **published** URL to avoid duplicate-content signals.

## Preview route gating (prod vs QA)

Preview routes (`/sb-preview/*` and `GET /api/preview`) are intended for local development and non-production environments (for example a QA site like `qa.example.com`). In enterprise setups, you may also allow preview on the production domain when the request originates from the Storyblok Visual Editor or when the user has authenticated.

Behavior:

- In non-production environments (`VERCEL_ENV!=production`, `NODE_ENV!=production`, or `DEPLOY_ENV!=production`), preview is enabled.
- In production, preview is allowed when ANY of the following are true:
  - The request host is explicitly allowlisted (QA host allowlist).
  - The request appears to come from the Storyblok Visual Editor (referrer/origin, and in some cases `_storyblok_tk`).
  - Next.js draft mode is already enabled (after visiting `GET /api/preview?slug=...`).
  - A dedicated preview-auth cookie is present (issued by `/sb-preview/login`), and validates against `PREVIEW_AUTH_SECRET` (if configured).

Configuration:

- `PREVIEW_ALLOWED_HOSTS` (comma-separated), e.g. `localhost:3010,qa.example.com`
- `PREVIEW_AUTH_COOKIE_NAME` (optional), default: `preview_auth`
- `PREVIEW_GATE_PASSWORD` (optional), used by `/sb-preview/login`
- `PREVIEW_AUTH_SECRET` (optional but recommended), HMAC signing key for the preview-auth cookie
- `STORYBLOK_EDITOR_HOST` (optional), default: `app.storyblok.com`
- `DEPLOY_ENV` (optional), explicit deploy-environment override

This approach keeps preview tooling available on QA while reducing the risk of exposing draft-mode surfaces on the production domain.

See:

- Canonical helper: [src/lib/site/canonicalPath.ts](../../src/lib/site/canonicalPath.ts)
- URL builder: [src/lib/site/canonicalUrl.ts](../../src/lib/site/canonicalUrl.ts)
- SEO/indexing + sitemap: [seo-indexing-and-sitemaps.md](seo-indexing-and-sitemaps.md)
