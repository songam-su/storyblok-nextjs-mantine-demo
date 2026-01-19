# Troubleshooting

This page centralizes the most common issues when running this repo locally or integrating it with Storyblok + Vercel.

## Preview / Visual Editor issues

### I can’t see updates in the Visual Editor

Check these in order:

1. **You’re actually in preview**

Draft + Bridge lives under `/sb-preview/<slug>`.

This repo also rewrites editor-context requests (with `_storyblok` params) into `/sb-preview/...` automatically.

1. **HTTPS + iframe requirements**

The Visual Editor commonly runs your site in an iframe and expects HTTPS.

Run `pnpm dev-setup` once, then `pnpm dev` (<https://localhost:3010>).

Make sure your browser trusts the generated cert (mkcert).

1. **Bridge not active**

If the Bridge isn’t active, you’ll usually see drafts load but live updates won’t stream in.

See: [../reference/preview-live-update.md](../reference/preview-live-update.md)

### My preview URL in Storyblok is “wrong”

Recommended approach:

- Set the Visual Editor preview URL to your **published** URL.
- When Storyblok opens the preview with editor query params, the middleware routes it into the preview pipeline.

See: [../architecture/published-vs-preview.md](../architecture/published-vs-preview.md)

### I expected a preview login screen, but I don’t see one

In this repo, preview access is typically **allowed** in non-production environments to keep local dev and QA fast.

Preview login is primarily for **production gating**, and it only appears when preview would otherwise be denied.

Related docs:

- Preview flow: [../reference/preview-live-update.md](../reference/preview-live-update.md)
- Gating rules: [../reference/routing-proxy-and-canonicalization.md](../reference/routing-proxy-and-canonicalization.md)

### How can I test preview login locally?

To simulate production gating locally:

1. Ensure preview secrets are configured (see [.env.example](../../.env.example)):

- `PREVIEW_GATE_PASSWORD`
- `PREVIEW_AUTH_SECRET`

1. Run in production mode and force production-like env detection:

- set `NODE_ENV=production`
- set `DEPLOY_ENV=production`

1. In an incognito/private window, visit a preview URL like `/sb-preview/home`.

If preview is denied, you should be redirected to `/sb-preview/login`.

## ISR / content freshness

### I published/unpublished, but the site didn’t update

This is almost always one of:

- **Webhook not configured** in Storyblok (or configured to the wrong URL)
- **Secret mismatch** between Storyblok webhook URL and your deployment
- **Missing env var** in the deployment (`STORYBLOK_WEBHOOK_SECRET`)

Checklist:

- Confirm your Storyblok webhook calls:
  - `POST /api/webhooks/revalidate?secret=STORYBLOK_WEBHOOK_SECRET`
- Confirm `STORYBLOK_WEBHOOK_SECRET` is set in:
  - local `.env.local` (if testing locally)
  - Vercel environment variables (if testing on a deployed URL)
- Confirm you’re hitting the **deployed domain** in the webhook URL.

See: [../reference/webhook-revalidate.md](../reference/webhook-revalidate.md)

## Debug endpoints

### Debugging site-config asset issues

There is a non-production-only endpoint for quickly comparing published vs draft `site-config` values:

- `GET /api/debug/site-config`

In production it returns a `404` by design.

## Vercel verification checklist

After deploying to Vercel (Preview or Production), verify these behaviors on the deployed URL.

Notes:

- In PowerShell, `curl` is an alias for `Invoke-WebRequest`. For reliable header-only checks, use `curl.exe`.

### Unknown slug returns a true 404 (and correct headers)

Run:

- `curl.exe -I https://<your-domain>/asdfasdf`

Expect:

- Status: `404`
- `X-Robots-Tag: noindex, follow, noarchive`
- `Cache-Control: no-store, max-age=0`
- `Link: <https://<your-domain>/asdfasdf>; rel="canonical"`

### Preview routes are always noindex + no-store

Run:

- `curl.exe -I https://<your-domain>/sb-preview/home`

Expect:

- `X-Robots-Tag: noindex, nofollow, noarchive`
- `Cache-Control: no-store, max-age=0`

### API routes are always noindex + no-store

Run:

- `curl.exe -I https://<your-domain>/api/preview`

Expect:

- `X-Robots-Tag: noindex, nofollow, noarchive`
- `Cache-Control: no-store, max-age=0`

## Local dev setup

### The site works, but preview in the Visual Editor breaks on localhost

Common causes:

- **Local SSL isn’t set up** (or the CA isn’t trusted)
- **Certs were regenerated but the browser still distrusts them**

Fix:

- Ensure mkcert is installed and trusted (`mkcert -install`).
- Re-run `pnpm dev-setup`.
- Restart the dev server (`pnpm dev`).

See: [../reference/deployment-envs.md](../reference/deployment-envs.md)

## Storyblok noise / unexpected 404s

### Storyblok 404 for `/.well-known/appspecific/com.chrome.devtools.json`

Some browsers/extensions (notably Chrome DevTools related tooling) may request `/.well-known/appspecific/com.chrome.devtools.json` automatically.

Because this project uses a catch-all route to resolve unknown paths through Storyblok, that probe can otherwise be treated as a Storyblok slug and produce noisy `getStory failed (404)` logs.

Mitigation:

- Serve a static file at `public/.well-known/appspecific/com.chrome.devtools.json` so the request is handled locally (and never forwarded into Storyblok).
- Add `Cache-Control: no-store` for that path via `next.config.mjs` headers so it doesn't get cached.

## Known dev-only warning

### Hydration mismatch (LastPass / password managers)

Some browser extensions inject DOM into inputs before React hydrates, causing a mismatch warning.

Mitigation used in this repo:

- Newsletter form inputs include ignore attributes:
  - `data-lpignore="true"` (LastPass)
  - `data-1p-ignore="true"` (1Password)

See implementation guide section: [implementation-guide.md](implementation-guide.md)
