# Storyblok Mantine Demo

A Next.js App Router demo that showcases Storyblok-driven page building, Mantine UI theming, preview mode parity, and ISR-friendly published routes.

## Table of Contents

- [Storyblok Mantine Demo](#storyblok-mantine-demo)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Tech Stack \& Features](#tech-stack--features)
  - [Getting Started](#getting-started)
  - [Local SSL Setup](#local-ssl-setup)
  - [Storyblok Visual Editor](#storyblok-visual-editor)
  - [Environment Variables](#environment-variables)
  - [Webhooks](#webhooks)
    - [ISR cache bust](#isr-cache-bust)
    - [Algolia reindex (scaffold)](#algolia-reindex-scaffold)
  - [Future Enhancements](#future-enhancements)

## Overview

- Renders Storyblok stories through a typed component registry and Mantine.
- Published routes use ISR (10-minute window) while `/sb-preview` honors draft mode.
- Helper scripts under `.dev/storyblok` regenerate components, datasources, and types.

## Tech Stack & Features

- **Framework**: Next.js 16 App Router with TypeScript.
- **UI**: Mantine + custom theme tokens.
- **CMS**: Storyblok (live preview bridge, generated typings, ISR friendly fetching).
- **Tooling**: pnpm, mkcert-powered HTTPS dev server, Storyblok CLI scripts.

## Getting Started

1. Install dependencies: `pnpm install`.
2. Copy `.env.local` from the provided sample and fill in Storyblok tokens + secrets.
3. Run the dev server (HTTP): `pnpm dev`. For HTTPS, see [Local SSL Setup](#local-ssl-setup).
4. Visit `http://localhost:3000` for published content or `/sb-preview/...` for draft mode.

## Local SSL Setup

Some Storyblok integrations expect HTTPS (especially inside the visual editor iframe).

1. Install mkcert globally:
   - Windows: `choco install mkcert`
   - macOS: `brew install mkcert`
2. Trust the local CA once: `mkcert -install`.
3. Run `pnpm dev-setup` (see `package.json`) to generate certificates consumed by the dev server.

## Storyblok Visual Editor

- Default visual editor environment: <https://d6a698f5.me.storyblok.com/>.
- Preview URLs should point to `/sb-preview/<slug>` so the visual editor loads draft content with the live bridge.
- Storyblok demo space domain: <https://d6a698f5.me.storyblok.com>

## Environment Variables

| Variable                              | Description                                                       | Scope  |
| ------------------------------------- | ----------------------------------------------------------------- | ------ |
| `NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN` | Public token for client-side bridge preview requests.             | Client |
| `NEXT_PUBLIC_STORYBLOK_PUBLIC_TOKEN`  | Public token for client-side published requests (if ever needed). | Client |
| `STORYBLOK_PREVIEW_TOKEN`             | Private token for server-side fetches (`fetchStory`).             | Server |
| `STORYBLOK_THEME_TOKEN`               | Token for server-side theme fetching (`fetchTheme`).              | Server |
| `STORYBLOK_SPACE_ID`                  | Space identifier for Storyblok CLI tooling.                       | Server |
| `STORYBLOK_WEBHOOK_SECRET`            | Shared secret for ISR webhook authentication.                     | Server |
| `ALGOLIA_WEBHOOK_SECRET`              | Shared secret for the Algolia scaffold endpoint.                  | Server |

> Tip: Secrets can be reused across webhooks, but rotating them independently keeps integrations isolated.

## Webhooks

### ISR cache bust

- Endpoint: `POST /api/webhooks/revalidate?secret=STORYBLOK_WEBHOOK_SECRET`.
- Subscribe Storyblok “Story published / unpublished / moved / deleted” events to this URL.
- Payload parsing collects the primary slug plus alternates/cached URLs and calls `revalidatePath` to purge ISR cache immediately.

### Algolia reindex (scaffold)

- Endpoint: `POST /api/webhooks/reindex?secret=ALGOLIA_WEBHOOK_SECRET`.
- Currently validates the secret and echoes the payload; hook in Algolia indexing later.
- Recommended Storyblok events: publish/unpublish/move once the search pipeline is live.

## Future Enhancements

- Wire `fetchTheme('draft')` into preview layouts for Storyblok-driven theming.
- Implement Algolia indexing, including partial updates and retry logic.
- Consolidate webhook handlers under `/api/webhooks/*` if additional integrations are introduced.
