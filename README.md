# Storyblok Mantine Demo

[![License: GPLv3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
![Next.js](https://img.shields.io/badge/Next.js-16.x-black?logo=next.js)
![Storyblok](https://img.shields.io/badge/Storyblok-CMS-blue?logo=storyblok)
![Mantine](https://img.shields.io/badge/Mantine-UI-purple)

Quick links: [Live demo](https://storyblok-demo.andrewcaperton.me) · [Implementation guide](docs/guides/implementation-guide.md) · [Getting started](#getting-started) · [Contact](#contact)

> **Docs refresh marker**: Updated on **2026-01-11**. Previous reference point: Commit `f342c20ac36441945a4606478dac5c084bb83a3f`.

A Next.js App Router demo that showcases Storyblok-driven page building, Mantine UI theming, and an enterprise-style integration that keeps published routes ISR/static while still supporting a great Storyblok Visual Editor experience.

## About This Project

A modern Next.js demo integrating Storyblok CMS and Mantine UI, showcasing enterprise-grade architecture patterns, ISR/static rendering, and Visual Editor support. Built with TypeScript for maintainability and optimized for performance.

## Why This Matters

This project demonstrates how to build scalable, CMS-driven applications using modern frameworks and a design system. It highlights patterns that matter in real teams: performance-first rendering (ISR/static where possible), a clean server-side content layer, and an editor-friendly preview workflow that supports fast iteration without sacrificing production stability.

## Table of Contents

- [Storyblok Mantine Demo](#storyblok-mantine-demo)
  - [About This Project](#about-this-project)
  - [Why This Matters](#why-this-matters)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Purpose](#purpose)
  - [Disclaimer](#disclaimer)
  - [What's Included (and What's Not)](#whats-included-and-whats-not)
  - [Tech Stack \& Features](#tech-stack--features)
    - [Auto-formatting (VS Code)](#auto-formatting-vs-code)
    - [Mermaid diagrams (VS Code)](#mermaid-diagrams-vs-code)
    - [Documentation](#documentation)
  - [Prerequisites](#prerequisites)
  - [Enterprise Architecture](#enterprise-architecture)
    - [Architecture Diagram](#architecture-diagram)
    - [Published vs Preview Routes](#published-vs-preview-routes)
    - [Rendering Chain](#rendering-chain)
    - [Lazy Component Loading](#lazy-component-loading)
    - [Relations \& Link Resolution](#relations--link-resolution)
    - [Editor Navigation Behavior](#editor-navigation-behavior)
  - [Component \& Layout Highlights](#component--layout-highlights)
    - [Layout \& spacing system](#layout--spacing-system)
    - [Shared utilities](#shared-utilities)
  - [Getting Started](#getting-started)
  - [Key Scripts](#key-scripts)
  - [Testing](#testing)
  - [Known Warnings](#known-warnings)
    - [React peer dependency warning (React \<= 18)](#react-peer-dependency-warning-react--18)
  - [Local SSL Setup](#local-ssl-setup)
  - [Storyblok Visual Editor](#storyblok-visual-editor)
    - [Preview troubleshooting (compact)](#preview-troubleshooting-compact)
  - [Environment Variables](#environment-variables)
    - [Required vs optional (at a glance)](#required-vs-optional-at-a-glance)
  - [Deploying on Vercel (short)](#deploying-on-vercel-short)
  - [Indexing / SEO (Demo Subdomain)](#indexing--seo-demo-subdomain)
  - [Webhooks](#webhooks)
    - [ISR cache bust](#isr-cache-bust)
    - [Algolia reindex (scaffold)](#algolia-reindex-scaffold)
  - [Future Enhancements](#future-enhancements)
  - [Contact](#contact)
  - [License](#license)

## Overview

- Renders Storyblok stories through a typed component registry and Mantine.
- Published routes use ISR (10-minute window) while `/sb-preview` is dedicated to draft/preview.
- Storyblok `meta_title` / `meta_description` flow into `<title>` + meta description via `generateMetadata` on published and preview routes.
- Helper scripts under `.dev/storyblok` regenerate components, datasources, and types.
- Site chrome (header/footer) and theming are driven by a Storyblok `site-config` story, including CSS vars for background/text and Mantine theme overrides.
- Default typography stack is Inter/Segoe UI/system to keep headings and body copy consistent across all blok components.

## Purpose

- Showcase stack feasibility for stakeholders.
- Provide a clean starting point for teams adopting Storyblok + Next.js + Mantine.
- Not a drop-in production site; adapt this for your own Storyblok space.

## Disclaimer

This repository provides an **enterprise-grade boilerplate** integrating a **Storyblok demo space**, **Next.js**, and **Mantine UI**. It is intended as a **starting point** and **proof of concept** demonstrating feasibility of the stack — not a ready-made, production site.

- **Not a final implementation**: You must adapt components, content models, and configuration for a **clean, new Storyblok space** you own.
- **No secrets**: The repository does not include operational credentials. Example environment variables are provided via `.env.example`.
- **No warranty**: Provided "as is" without warranties of any kind. Use at your own risk; review security, performance, and compliance needs before production.

For a guided adaptation, see [docs/guides/implementation-guide.md](docs/guides/implementation-guide.md).

## What's Included (and What's Not)

- ✅ Integration patterns (routing, preview, component registry, performance-minded defaults)
- ✅ Example bloks/components mapped from the Storyblok Demo Space
- ❌ Production credentials (see `.env.example`)
- ❌ A ready-to-ship site (replace demo models/content for your space)

## Tech Stack & Features

- **Framework**: Next.js App Router with TypeScript.
- **UI**: Mantine + custom theme tokens.
- **CMS**: Storyblok (live preview bridge, generated typings).
- **Performance**: Lazy-loaded blok components with targeted preloading of the root + first body bloks to reduce Suspense latency.
- **Tooling**: pnpm, mkcert-powered HTTPS dev server, Storyblok CLI scripts.
- **Observability**: Vercel Speed Insights + Vercel Analytics (wired in `src/app/(pages)/layout.tsx`).

### Auto-formatting (VS Code)

This repo includes workspace defaults to keep formatting consistent:

- Format on save via Prettier (`.vscode/settings.json` + `prettier.config.js`).
- ESLint is configured for linting; fix-on-save is set to `"explicit"` by default (only runs when you explicitly invoke it).

Recommended extensions are listed in `.vscode/extensions.json`.

### Mermaid diagrams (VS Code)

Many docs in this repo include Mermaid diagrams (fenced blocks like ` ```mermaid `).

To render them in VS Code:

- Install the recommended extension `bierner.markdown-mermaid` (listed in `.vscode/extensions.json`).
- Open a Markdown file and run **Markdown: Open Preview to the Side**.

Note: the built-in Markdown preview may show Mermaid blocks as plain text unless you have a Mermaid-capable Markdown preview extension installed.

### Documentation

- Docs index: [docs/README.md](docs/README.md)
- Enterprise architecture deep dive: [docs/README-enterprise.md](docs/README-enterprise.md)
- Implementation guide (adapting to your own Storyblok space): [docs/guides/implementation-guide.md](docs/guides/implementation-guide.md)
- Contributing: [CONTRIBUTING.md](CONTRIBUTING.md)
- Security policy: [SECURITY.md](SECURITY.md)

## Prerequisites

- Node.js (LTS recommended)
- pnpm
- Local HTTPS support (this repo runs `pnpm dev` with Next.js experimental HTTPS)
  - Run `pnpm dev-setup` once to generate local certs
  - If you don’t already have it, install and trust mkcert (see [Local SSL Setup](#local-ssl-setup))
- A Storyblok account + space (or access to a Storyblok Demo Space)

## Enterprise Architecture

This repo intentionally differs from the “standard” `@storyblok/react` approach in a few key places to optimize for:

- published traffic that is ISR/static and cache-friendly
- a predictable server-side data layer (relations + deep link fixes)
- lazy component loading (avoid client-side eager imports)
- editor-first UX in preview (bridge enabled, no accidental navigation)

### Architecture Diagram

The canonical architecture diagrams live under `docs/`:

- Enterprise architecture index: [docs/README-enterprise.md](docs/README-enterprise.md)
- Tech stack overview: [docs/architecture/project-architecture.md](docs/architecture/project-architecture.md)
- High-level architecture diagram: [docs/architecture/high-level-architecture.md](docs/architecture/high-level-architecture.md)
- Runtime topology diagram: [docs/architecture/runtime-topology.md](docs/architecture/runtime-topology.md)
- Published vs preview flow: [docs/architecture/published-vs-preview.md](docs/architecture/published-vs-preview.md)

### Published vs Preview Routes

See the dedicated doc: [docs/architecture/published-vs-preview.md](docs/architecture/published-vs-preview.md).

### Rendering Chain

- Rendering + theming overview: [docs/architecture/rendering-and-theming.md](docs/architecture/rendering-and-theming.md)
- Component resolution (registry + lazy loading): [docs/reference/component-resolution.md](docs/reference/component-resolution.md)

### Lazy Component Loading

- Decision record (why + tradeoffs): [docs/decisions/dynamicComponentRegistration.md](docs/decisions/dynamicComponentRegistration.md)
- Component resolution details: [docs/reference/component-resolution.md](docs/reference/component-resolution.md)

### Relations & Link Resolution

See the dedicated docs:

- Link resolution behavior: [docs/reference/navigation-link-resolution.md](docs/reference/navigation-link-resolution.md)
- Storyblok model + relations: [docs/reference/storyblok-data-model.md](docs/reference/storyblok-data-model.md)
- Freshness model (ISR vs preview): [docs/architecture/content-freshness-and-preview.md](docs/architecture/content-freshness-and-preview.md)

### Editor Navigation Behavior

See the dedicated docs:

- Preview live update + editor context: [docs/reference/preview-live-update.md](docs/reference/preview-live-update.md)
- Link behavior and safety: [docs/reference/navigation-link-resolution.md](docs/reference/navigation-link-resolution.md)

## Component & Layout Highlights

| Blok                                                              | Description                                                                                      | Path                                                                           | Notes                                                                                                                     |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `default-page`                                                    | Story-level wrapper that renders nested body bloks without extra layout chrome.                  | `src/components/Storyblok/DefaultPage/DefaultPage.tsx`                         | Uses `display: contents` via CSS module to stay DOM-neutral; meta title/description surfaced via `generateMetadata`.      |
| `banner`                                                          | Hero-style CTA wrapper with buttons, color & background-image controls.                          | `src/components/Storyblok/Banner/Banner.tsx`                                   | Uses Mantine `Paper`, Storyblok color + alignment helpers, supports full-bleed background with constrained inner content. |
| `button`                                                          | Storyblok-configurable CTA rendered as Mantine `Button`.                                         | `src/components/Storyblok/Button/Button.tsx`                                   | Shares palette utilities; ghost/default variants honor Storyblok color swatches.                                          |
| `hero-section`                                                    | Layout-aware hero with stacked/split variants, optional image decoration, and headline segments. | `src/components/Storyblok/HeroSection/HeroSection.tsx`                         | Supports Storyblok palette for background/accent, centers text by default, respects focus points and aspect toggles.      |
| `grid-section`                                                    | Configurable grid of cards with optional lead and CTAs.                                          | `src/components/Storyblok/GridSection/GridSection.tsx`                         | Supports Storyblok palette, headline segments, and `grid-card` children; caps columns between 1–4.                        |
| `grid-card`                                                       | Grid cell with optional image, icon, CTA, background image.                                      | `src/components/Storyblok/GridCard/GridCard.tsx`                               | Light-themed by default; background images get a lightening overlay for contrast, no-image cards get a soft fill.         |
| `logo-section`                                                    | Responsive grid of logos from a multi-asset field with optional lead.                            | `src/components/Storyblok/LogoSection/LogoSection.tsx`                         | Uses `getSbImageData` to respect focal points; displays nothing if no assets and no lead.                                 |
| `faq-entry`, `faq-section`                                        | Accordion-based FAQ section with Storyblok-managed entries.                                      | `src/components/Storyblok/FaqSection`                                          | Mantine `Accordion` + `Paper`, inherits global spacing system, edit attributes preserved per entry.                       |
| `headline-segment`                                                | Inline headline fragment with optional highlight color.                                          | `src/components/Storyblok/HeadlineSegment/HeadlineSegment.tsx`                 | Used by banner/FAQ headlines to render multi-colored titles via `renderHeadlineSegments`.                                 |
| `tabbed-content-section` / `tabbed-content-entry`                 | Tabs with rich content cards.                                                                    | `src/components/Storyblok/TabbedContentSection/TabbedContentSection.tsx`       | Light pill tabs, full-card links, and light cards by default.                                                             |
| `testimonials-section` / `testimonial`                            | Cards for quotes + person meta.                                                                  | `src/components/Storyblok/TestimonialsSection/TestimonialsSection.tsx`         | Uses light surfaces/borders with hover lift; respects site text colors.                                                   |
| `featured-articles-section`                                       | Grid of linked articles.                                                                         | `src/components/Storyblok/FeaturedArticlesSection/FeaturedArticlesSection.tsx` | Full-card links, consistent heights, light surfaces with hover lift.                                                      |
| `article-overview-page`                                           | Dynamic article listing page with search + category filtering.                                   | `src/components/Storyblok/ArticleOverviewPage/ArticleOverviewPage.tsx`         | Fetches `/api/articles`; categories ordered by Storyblok folder order; card heights match per row.                        |
| `products-section`                                                | Product cards powered by a Storyblok plugin field.                                               | `src/components/Storyblok/ProductsSection/ProductsSection.tsx`                 | Renders `sb-fake-ecommerce` plugin items; includes demo SKU pricing + sold-out labeling.                                  |
| `form-section`, `contact-form-section`, `newsletter-form-section` | CTA/lead + form shell.                                                                           | `src/components/Storyblok/Forms/*`                                             | Light-friendly surfaces, accessible label/placeholder contrast; newsletter has accent button styling.                     |
| `text-section`                                                    | Rich text/lead section with optional headline segments and palette background.                   | `src/components/Storyblok/TextSection/TextSection.tsx`                         | Uses shared rich-text renderer and headline segments; omits empty wrappers.                                               |
| `two-columns-section`                                             | Dual-column content with optional buttons and palette backgrounds per column.                    | `src/components/Storyblok/TwoColumnsSection/TwoColumnsSection.tsx`             | Supports per-column decoration color and headline segments; skips empty columns.                                          |
| `image-text-section`                                              | Side-by-side media + rich text with reversible layout.                                           | `src/components/Storyblok/ImageTextSection/ImageTextSection.tsx`               | Supports palette background, focus-aware images, headline segments, buttons, and per-device layout reversal.              |
| `nav-item`                                                        | Navigation link used by menus and site config.                                                   | `src/components/Storyblok/NavItem/NavItem.tsx`                                 | Uses multilink resolver, preserves edit attributes, falls back to a muted span when missing href.                         |
| `personalized-section`                                            | Wrapper that swaps child bloks based on visitor state.                                           | `src/components/Storyblok/PersonalizedSection/PersonalizedSection.tsx`         | Supports new/returning visitor branches with arbitrary child bloks.                                                       |
| `site-config`                                                     | Story-level config for theme, header, footer.                                                    | `src/components/Storyblok/SiteConfig/SiteConfig.tsx`                           | Normalizes colors/fonts into CSS vars + Mantine theme; shows editor badge only in Visual Editor.                          |

Additional Storyblok bloks can follow the same pattern. See [Component Implementation Guide](docs/guides/components/component-guide.md) for conventions, utilities, and checklist.

### Layout & spacing system

- Global max width: **1400 px**, enforced via `.page-shell__content` within `src/app/(pages)/layout.tsx`.
- Responsive gutters: `16px (xs) / 20px (sm) / 24px (md+)`, controlled by CSS variables in `src/styles/globals.scss`.
- Edge-to-edge sections: apply `.edge-to-edge` on the outer wrapper plus `.edge-to-edge__inner` around the textual content to keep full-bleed backgrounds with constrained typography.
- Standard sections (e.g., FAQ) compute their width with `min(1400px, 100% - 2 * gutter)` so background colors never touch the viewport on smaller screens.
- Site chrome: header/footer come from the Storyblok `site-config` story and are rendered in the shared layouts for published and preview routes.

### Shared utilities

- `getStoryblokColorClass` / `storyblokColorUtils`: translates Storyblok color pickers into SCSS module classes for consistent palette usage.
- `getStoryblokAlignmentMeta`: maps alignment options to flex/text-alignment metadata.
- `renderHeadlineSegments`: assembles the highlighted headline segments Storyblok editors configure.
- `renderSbRichText`: server-safe rendering helper (see `src/components/Storyblok/utils`).
- `getSbImageData`: normalizes Storyblok asset data, honors focal points, and accepts optional `cropRatio { x, y }` to preserve focus when fitting a fixed aspect (e.g., 16:9 hero). Returns `objectPosition` suitable for `object-fit` images.
- Global styles expose reusable CSS variables and helper classes (`.edge-to-edge`, `.edge-to-edge__inner`) so each blok stays lightweight.

## Getting Started

1. Install dependencies: `pnpm install`.
2. Copy `.env.example` to `.env.local` and fill in the required Storyblok tokens + secrets.
3. Generate local HTTPS certs once: `pnpm dev-setup` (see [Local SSL Setup](#local-ssl-setup)).
4. Run the dev server: `pnpm dev`.
5. Visit `https://localhost:3010` for published content or `/sb-preview/...` for draft mode.

## Key Scripts

| Command           | What it does                                                                  |
| ----------------- | ----------------------------------------------------------------------------- |
| `pnpm dev-setup`  | Generates local HTTPS certs under `.dev/certs/`                               |
| `pnpm dev`        | Runs Next.js dev server on `https://localhost:3010` using the generated certs |
| `pnpm build`      | Builds the Next.js app                                                        |
| `pnpm start`      | Runs the production server (after `pnpm build`)                               |
| `pnpm test`       | Runs unit tests (Vitest)                                                      |
| `pnpm test:watch` | Runs unit tests in watch mode                                                 |
| `pnpm cy:open`    | Opens Cypress (E2E) UI                                                        |
| `pnpm cy:run`     | Runs Cypress E2E headlessly                                                   |
| `pnpm sb:login`   | Logs into Storyblok CLI (region EU by default)                                |
| `pnpm sb:pull`    | Pulls Storyblok resources and regenerates types                               |
| `pnpm vercel`     | Pulls Vercel env vars into a local `.env` file                                |

### Optional: Storyblok slug lint

This repo includes an **optional** script intended for CI or occasional audits:

- Runs against Storyblok `cdn/links` and fails if any `full_slug` contains uppercase characters.
- Reports underscores and whitespace too, but does **not** fail on them by default.

Usage:

- Default (fail on uppercase only): `pnpm -s lint:storyblok-slugs`
- Strict (also fail on underscores + whitespace): `pnpm -s lint:storyblok-slugs -- --strict`
- Limit scope (example): `pnpm -s lint:storyblok-slugs -- --starts-with=articles`

Notes:

- The script is inert unless you run it (it does not affect `dev`, `build`, or runtime).
- Requires Storyblok tokens only when executed (see [Environment Variables](#environment-variables)).

## Testing

- Unit: `pnpm test` (Vitest, uses alias `@` → `src/`, specs in `tests/unit`).
- E2E: `pnpm cy:open` / `pnpm cy:run` (Cypress config at `tests/e2e/cypress.config.ts`, specs in `tests/e2e/specs`). Set `CYPRESS_BASE_URL` if your dev server URL differs (for example, `https://localhost:3010`).

## Known Warnings

### React peer dependency warning (React <= 18)

When installing dependencies you may see a pnpm peer dependency warning similar to:

- `@mantine/next` → `@mantine/ssr` → `html-react-parser@1.x` expects `react <= 18`, but this repo uses React 19.

This is currently a **warning only** in this project (build + tests pass). Track it for future upgrades; if you hit runtime issues in the SSR integration, the most likely fixes are upgrading the Mantine SSR/Next packages to versions that officially support React 19, or pinning React to 18.

## Local SSL Setup

Some Storyblok integrations expect HTTPS (especially inside the Visual Editor iframe).

1. Install mkcert globally:
   - Windows: `choco install mkcert`
   - macOS: `brew install mkcert`
2. Trust the local CA once: `mkcert -install`.
3. Run `pnpm dev-setup` (see `package.json`) to generate certificates consumed by the dev server.

## Storyblok Visual Editor

- Default Visual Editor environment: <https://d6a698f5.me.storyblok.com/>.
- Preview/editing uses `/sb-preview/<slug>` (draft + bridge).
- You can also use the normal published URL as the Visual Editor preview URL; `next.config.mjs` rewrites Storyblok editor requests (those with `_storyblok` params) to `/sb-preview/...` automatically.
- Storyblok demo space domain: <https://d6a698f5.me.storyblok.com>

### Preview troubleshooting (compact)

For a more complete checklist, see: [docs/guides/troubleshooting.md](docs/guides/troubleshooting.md).

If preview isn’t behaving as expected, these are the common culprits:

- **HTTPS / iframe issues**: ensure local HTTPS is set up (`pnpm dev-setup`) and your browser trusts the cert (see [Local SSL Setup](#local-ssl-setup) and [docs/reference/deployment-envs.md](docs/reference/deployment-envs.md)).
- **Wrong route**: published vs preview behavior is intentionally split; see [docs/architecture/published-vs-preview.md](docs/architecture/published-vs-preview.md).
- **Bridge not updating**: confirm the Storyblok Bridge is active and the page is in preview context; see [docs/reference/preview-live-update.md](docs/reference/preview-live-update.md).
- **ISR not updating after publish**: confirm webhook configuration + secret; see [docs/reference/webhook-revalidate.md](docs/reference/webhook-revalidate.md).

## Environment Variables

### Required vs optional (at a glance)

- **Required (local dev + deployment)**
  - `STORYBLOK_PREVIEW_TOKEN`
- **Recommended (production-quality metadata)**
  - `SITE_URL` (used for canonical URLs and OpenGraph)
- **Required if you enable ISR webhook revalidation**
  - `STORYBLOK_WEBHOOK_SECRET`
- **Optional / future scaffold**
  - `ALGOLIA_WEBHOOK_SECRET` (only if you wire up the reindex webhook)
- **Optional / depends on your usage**
  - `NEXT_PUBLIC_STORYBLOK_PUBLIC_TOKEN` (only if you ever do client-side published requests)
  - `STORYBLOK_PUBLIC_TOKEN` (recommended if you want a separate published token)
  - `STORYBLOK_THEME_TOKEN` (only if you fetch theme separately)
  - `STORYBLOK_REGION` (only if you need a region override)
  - `STORYBLOK_SPACE_ID` (Storyblok CLI tooling)
  - `PREVIEW_ALLOWED_HOSTS`, `PREVIEW_AUTH_COOKIE_NAME`, `STORYBLOK_EDITOR_HOST` (preview route gating for QA/enterprise)

| Variable                             | Description                                                       | Scope  |
| ------------------------------------ | ----------------------------------------------------------------- | ------ |
| `NEXT_PUBLIC_STORYBLOK_PUBLIC_TOKEN` | Public token for client-side published requests (if ever needed). | Client |
| `NEXT_PUBLIC_SITE_URL`               | Optional site base URL fallback (metadata + client access).       | Client |
| `STORYBLOK_PUBLIC_TOKEN`             | Token for server-side published requests.                         | Server |
| `STORYBLOK_PREVIEW_TOKEN`            | Private token for server-side fetches (`fetchStory`).             | Server |
| `STORYBLOK_REGION`                   | Region override for Storyblok client (for non-default regions).   | Server |
| `STORYBLOK_THEME_TOKEN`              | Token for server-side theme fetching (`fetchTheme`).              | Server |
| `STORYBLOK_SPACE_ID`                 | Space identifier for Storyblok CLI tooling.                       | Server |
| `STORYBLOK_WEBHOOK_SECRET`           | Shared secret for ISR webhook authentication.                     | Server |
| `ALGOLIA_WEBHOOK_SECRET`             | Shared secret for the Algolia scaffold endpoint.                  | Server |
| `PREVIEW_ALLOWED_HOSTS`              | Production allowlist for preview routes (e.g. QA hostnames).      | Server |
| `PREVIEW_AUTH_COOKIE_NAME`           | Optional cookie name to allow preview after auth.                 | Server |
| `STORYBLOK_EDITOR_HOST`              | Optional Storyblok editor host override for gating.               | Server |

Preview route gating (quick note): in production, preview surfaces (`/sb-preview/*`, `GET /api/preview`) are blocked by default unless the request originates from the Storyblok Visual Editor, draft mode is already enabled, a preview-auth cookie is present, or the host is allowlisted via `PREVIEW_ALLOWED_HOSTS`.

Additional:

| Variable   | Description                                                               | Scope  |
| ---------- | ------------------------------------------------------------------------- | ------ |
| `SITE_URL` | Canonical base URL for metadata (used for `metadataBase`, OG URLs, etc.). | Server |

## Deploying on Vercel (short)

- Set required env vars in Vercel (see [Environment Variables](#environment-variables)).
- Optional local sync: run `pnpm vercel` to pull env vars locally.
- Webhooks: if you want ISR invalidation on publish/unpublish, configure your Storyblok webhook to call `POST /api/webhooks/revalidate` on your deployed domain.
- Observability: Vercel Analytics + Speed Insights are already mounted in `src/app/(pages)/layout.tsx` and will report when deployed on Vercel.

For the full architecture + operational model, start at [docs/README-enterprise.md](docs/README-enterprise.md).

## Indexing / SEO (Demo Subdomain)

This repository is commonly deployed as a **demo** on a subdomain. If you intend for the demo to be publicly accessible but **not indexed** by search engines (recommended for boilerplate/demo content), the app enforces:

- `robots.txt` route via `src/app/robots.ts` (disallows `/sb-preview/*` and `/api/*`)
- Global `noindex, nofollow` via Next.js metadata on the published + preview layouts
- `X-Robots-Tag: noindex, nofollow` response header (configured in `next.config.mjs`) as defense-in-depth

If you want the site to be indexed, remove/adjust these rules before launch.

### Canonical URLs

Published routes set a canonical URL via Next.js metadata `alternates.canonical`.

- Canonicalization rules: `/home` → `/` and trailing slashes are stripped (except `/`).
- Canonical base URL comes from `SITE_URL` (or `NEXT_PUBLIC_SITE_URL` fallback) via `metadataBase`.
- Preview routes under `/sb-preview/*` intentionally do **not** emit canonical URLs.

> Tip: Secrets can be reused across webhooks, but rotating them independently keeps integrations isolated.

## Webhooks

Important:

- These endpoints do nothing on their own — you must create/enable matching webhooks in your Storyblok space (including the Storyblok demo space) for events to be sent to your app.
- If you're using the demo space “as-is”, webhook configuration is typically the only Storyblok-side change required for this repo’s ISR revalidation integration.

### ISR cache bust

- Endpoint: `POST /api/webhooks/revalidate?secret=STORYBLOK_WEBHOOK_SECRET`.
- In Storyblok: subscribe “Story published / unpublished / moved / deleted” events to this URL.
- Payload parsing collects the primary slug plus alternates/cached URLs and calls `revalidatePath` to purge ISR cache immediately.

### Algolia reindex (scaffold)

- Endpoint: `POST /api/webhooks/reindex?secret=ALGOLIA_WEBHOOK_SECRET`.
- In Storyblok (optional): subscribe events to this URL only if you plan to implement indexing later.
- Currently validates the secret and echoes the payload; hook in Algolia indexing later.
- Recommended events once the search pipeline is live: publish/unpublish/move.

Note: This repo does **not** include Algolia indexing yet. When you implement a real Algolia pipeline, you will typically add additional dependencies such as:

- `algoliasearch` for indexing/query operations
- `search-insights` for Algolia Insights (click/conversion analytics)

## Future Enhancements

- Wire `fetchTheme('draft')` into preview layouts for Storyblok-driven theming.
- Implement Algolia indexing, including partial updates and retry logic.
- Consolidate webhook handlers under `/api/webhooks/*` if additional integrations are introduced.

## Contact

Questions or feedback: [andrew@andrewcaperton.me](mailto:andrew@andrewcaperton.me)

## License

This repository is licensed under the GNU General Public License version 3, or any later version. See [LICENSE](LICENSE) for the full text.

For third-party notices, see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
