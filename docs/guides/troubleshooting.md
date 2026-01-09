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

## Known dev-only warning

### Hydration mismatch (LastPass / password managers)

Some browser extensions inject DOM into inputs before React hydrates, causing a mismatch warning.

Mitigation used in this repo:

- Newsletter form inputs include ignore attributes:
  - `data-lpignore="true"` (LastPass)
  - `data-1p-ignore="true"` (1Password)

See implementation guide section: [implementation-guide.md](implementation-guide.md)
