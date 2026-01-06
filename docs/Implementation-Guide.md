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

## 6) Production readiness checklist (high level)

Before going live, review:

- Secrets management and environment separation
- Caching strategy (ISR windows, webhook coverage)
- Performance (image sizing, component loading, third-party scripts)
- Security and compliance requirements for your org

This repo is provided "as is" and should be treated as a starting point, not a final production implementation.
