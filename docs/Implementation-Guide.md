# Implementation Guide

This repository is a **proof-of-concept boilerplate** built around a **Storyblok demo space**, **Next.js (App Router)**, and **Mantine UI**.

Use this guide to adapt the project to a **clean Storyblok space you own**.

Related docs:

- Project overview and setup: [`README.md`](../README.md)
- Conventions for implementing bloks: [`.docs/component-guide.md`](../.docs/component-guide.md)

## 1) Create your Storyblok space

- Create a new Storyblok space in your organization.
- Create the content structure you need (stories, folders, bloks/components, datasources).
- If you want to use this repo as a baseline, you can replicate the demo space models and then evolve them.

## 2) Configure environment variables

- Copy `.env.example` to `.env.local`.
- Fill in the required tokens/secrets (see the table in the root `README.md`).

Notes:

- `NEXT_PUBLIC_*` variables are exposed to the browser. Do not put private credentials there.
- Server-only variables are read by the App Router route handlers and server utilities.

## 3) Connect the repo to your space

The Storyblok CLI scripts under `.dev/storyblok` can help keep local types/resources in sync.

Common flows:

- Login: `pnpm sb:login`
- Pull resources + regenerate blok union type: `pnpm sb:pull`
- Pull component schemas only: `pnpm sb:pull-components`
- Pull datasources only: `pnpm sb:pull-datasources`
- Pull typings only: `pnpm sb:pull-types`

If your Storyblok region differs, update the login script in `package.json`.

## 4) Preview vs published behavior

This project intentionally separates:

- **Published** routes (ISR/static-friendly)
- **Preview** routes (draft + Visual Editor bridge)

When you set up your Visual Editor preview URL in Storyblok, you can use the published URL; the middleware will route editor requests to the preview pipeline.

## 5) Webhooks (recommended)

To keep ISR pages fresh on publish/unpublish/move:

- Configure the Storyblok webhook to call `POST /api/webhooks/revalidate?secret=...`.
- Set `STORYBLOK_WEBHOOK_SECRET` in `.env.local`.

Optional:

- This repo also includes a scaffold endpoint for future Algolia indexing: `POST /api/webhooks/reindex?secret=...`.
- It is intentionally not a full Algolia integration (no Algolia client, no indexing logic, no search UI). It only validates `ALGOLIA_WEBHOOK_SECRET` and echoes the payload.
- Only configure this webhook in Storyblok if you plan to implement indexing later.

When you implement Algolia for real, you will typically add additional dependencies such as:

- `algoliasearch` for indexing and query operations
- `search-insights` for Algolia Insights (click/conversion analytics)

`search-insights` is **not** related to Vercel Analytics / Speed Insights.

## 6) Production readiness checklist (high level)

Before going live, review:

- Secrets management and environment separation
- Caching strategy (ISR windows, webhook coverage)
- Performance (image sizing, component loading, third-party scripts)
- Security and compliance requirements for your org

## 7) Vercel observability

This repo includes:

- Vercel Speed Insights: `@vercel/speed-insights` via `<SpeedInsights />`
- Vercel Analytics: `@vercel/analytics` via `<Analytics />`

Both are currently mounted in the published layout: `src/app/(pages)/layout.tsx`.

## 8) Auto-formatting (VS Code)

Workspace settings in `.vscode/settings.json` enable:

- Format on save using the Prettier VS Code extension (`esbenp.prettier-vscode`) and `prettier.config.js`.
- ESLint validation, with fix-on-save configured as `"explicit"` by default.

If you want ESLint to auto-fix on every save, change:

- `"source.fixAll.eslint": "explicit"` → `true`
- `"source.organizeImports": "explicit"` → `true`

This repo is provided "as is" and should be treated as a starting point, not a final production implementation.

## 9) Troubleshooting

### Hydration mismatch in dev (LastPass / password managers)

#### Symptoms

- Next.js shows a recoverable error: “Hydration failed because the server rendered HTML didn't match the client”.
- The error stack often points into Mantine input components (e.g. `TextInput`).
- The diff can include an unexpected node like `data-lastpass-icon-root`.

#### Root cause

Some browser extensions (notably password managers like LastPass) inject DOM nodes into inputs before React hydrates.
That injected markup is not present in the server-rendered HTML, causing a mismatch.

#### Mitigation in this repo

We opt the newsletter form and its email input out of password-manager injection by adding ignore attributes:

- `data-lpignore="true"` (LastPass)
- `data-1p-ignore="true"` (1Password)

See the implementation in [src/components/Storyblok/Forms/NewsletterFormSection/NewsletterFormSection.tsx](../src/components/Storyblok/Forms/NewsletterFormSection/NewsletterFormSection.tsx).

#### If you still see it

- Disable the extension for `localhost` (most reliable), or test in a clean profile/incognito without extensions.
