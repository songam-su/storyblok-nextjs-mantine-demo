# Storyblok Mantine Demo

A Next.js App Router demo that showcases Storyblok-driven page building, Mantine UI theming, preview mode parity, and ISR-friendly published routes.

## Table of Contents

- [Storyblok Mantine Demo](#storyblok-mantine-demo)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Tech Stack \& Features](#tech-stack--features)
  - [Component \& Layout Highlights](#component--layout-highlights)
    - [Layout \& spacing system](#layout--spacing-system)
    - [Shared utilities](#shared-utilities)
  - [Getting Started](#getting-started)
  - [Testing](#testing)
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
- Storyblok `meta_title` / `meta_description` flow into `<title>` + meta description via `generateMetadata` on published and preview routes.
- Helper scripts under `.dev/storyblok` regenerate components, datasources, and types.

## Tech Stack & Features

- **Framework**: Next.js 16 App Router with TypeScript.
- **UI**: Mantine + custom theme tokens.
- **CMS**: Storyblok (live preview bridge, generated typings, ISR friendly fetching).
- **Tooling**: pnpm, mkcert-powered HTTPS dev server, Storyblok CLI scripts.

## Component & Layout Highlights

| Block | Description | Path | Notes |
| --- | --- | --- | --- |
| `default-page` | Story-level wrapper that renders nested body bloks without extra layout chrome. | `src/components/Storyblok/DefaultPage/DefaultPage.tsx` | Uses `display: contents` via CSS module to stay DOM-neutral; meta title/description surfaced via `generateMetadata`. |
| `banner` | Hero-style CTA wrapper with buttons, color & background-image controls. | `src/components/Storyblok/SbBanner/SbBanner.tsx` | Uses Mantine `Paper`, Storyblok color + alignment helpers, supports full-bleed background with constrained inner content. |
| `button` | Storyblok-configurable CTA rendered as Mantine `Button`. | `src/components/Storyblok/Button/Button.tsx` | Shares palette utilities; ghost/default variants honor Storyblok color swatches. |
| `hero` | Media-forward hero that renders Storyblok assets with focal-point aware cropping and buttons. | `src/components/Storyblok/Hero/Hero.tsx` | Uses `getSbImageData` (cropRatio-capable) to honor Storyblok focus points and optional component-defined aspect ratios. |
| `logo-section` | Responsive grid of logos from a multi-asset field with optional lead. | `src/components/Storyblok/LogoSection/LogoSection.tsx` | Uses `getSbImageData` to respect focal points; displays nothing if no assets and no lead. |
| `faq-entry`, `faq-section` | Accordion-based FAQ section with Storyblok-managed entries. | `src/components/Storyblok/FaqSection` | Mantine `Accordion` + `Paper`, inherits global spacing system, edit attributes preserved per entry. |
| `headline-segment` | Inline headline fragment with optional highlight color. | `src/components/Storyblok/HeadlineSegment/HeadlineSegment.tsx` | Used by banner/FAQ headlines to render multi-colored titles via `renderHeadlineSegments`. |

Additional Storyblok blocks can follow the same pattern. See [Component Implementation Guide](.docs/component-guide.md) for conventions, utilities, and checklist.

### Layout & spacing system

- Global max width: **1400 px**, enforced via `.page-shell__content` within `src/app/(pages)/layout.tsx`.
- Responsive gutters: `16px (xs) / 20px (sm) / 24px (md+)`, controlled by CSS variables in `src/styles/globals.scss`.
- Edge-to-edge sections: apply `.edge-to-edge` on the outer wrapper plus `.edge-to-edge__inner` around the textual content to keep full-bleed backgrounds with constrained typography.
- Standard sections (e.g., FAQ) compute their width with `min(1400px, 100% - 2 * gutter)` so background colors never touch the viewport on smaller screens.

### Shared utilities

- `getStoryblokColorClass` / `storyblokColorUtils`: translates Storyblok color pickers into SCSS module classes for consistent palette usage.
- `getStoryblokAlignmentMeta`: maps alignment options to flex/text-alignment metadata.
- `renderHeadlineSegments`: assembles the highlighted headline segments Storyblok editors configure.
- `renderSbRichText`: server-safe rendering helper (see `src/components/Storyblok/utils`).
- `getSbImageData`: normalizes Storyblok asset data, honors focal points, and accepts optional `cropRatio { x, y }` to preserve focus when fitting a fixed aspect (e.g., 16:9 hero). Returns `objectPosition` suitable for `object-fit` images.
- Global styles expose reusable CSS variables and helper classes (`.edge-to-edge`, `.edge-to-edge__inner`) so each blok stays lightweight.

## Getting Started

1. Install dependencies: `pnpm install`.
2. Copy `.env.local` from the provided sample and fill in Storyblok tokens + secrets.
3. Run the dev server (HTTP): `pnpm dev`. For HTTPS, see [Local SSL Setup](#local-ssl-setup).
4. Visit `http://localhost:3000` for published content or `/sb-preview/...` for draft mode.

## Testing

- Unit: `pnpm test` (Vitest, uses alias `@` → `src/`, specs in `tests/unit`).
- E2E: `pnpm cy:open` / `pnpm cy:run` (Cypress config at `tests/e2e/cypress.config.ts`, specs in `tests/e2e/specs`). Set `CYPRESS_BASE_URL` if not using the default `http://localhost:3010`.

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
