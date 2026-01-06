# Storyblok Mantine Demo

A Next.js App Router demo that showcases Storyblok-driven page building, Mantine UI theming, and an enterprise-style integration that keeps published routes ISR/static while still supporting a great Storyblok Visual Editor experience.

## Table of Contents

- [Storyblok Mantine Demo](#storyblok-mantine-demo)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Purpose](#purpose)
  - [Disclaimer](#disclaimer)
  - [What's Included (and What's Not)](#whats-included-and-whats-not)
  - [Tech Stack \& Features](#tech-stack--features)
  - [Enterprise Architecture](#enterprise-architecture)
    - [Published vs Preview Routes](#published-vs-preview-routes)
    - [Rendering Chain](#rendering-chain)
    - [Lazy Component Loading](#lazy-component-loading)
    - [Relations \& Link Resolution](#relations--link-resolution)
    - [Editor Navigation Behavior](#editor-navigation-behavior)
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

For a guided adaptation, see [docs/Implementation-Guide.md](docs/Implementation-Guide.md).

## What's Included (and What's Not)

- ✅ Integration patterns (routing, preview, component registry, performance-minded defaults)
- ✅ Example bloks/components mapped from a demo space
- ❌ Production credentials (see `.env.example`)
- ❌ A ready-to-ship site (replace demo models/content for your space)

## Tech Stack & Features

- **Framework**: Next.js App Router with TypeScript.
- **UI**: Mantine + custom theme tokens.
- **CMS**: Storyblok (live preview bridge, generated typings).
- **Performance**: Lazy-loaded blok components with targeted preloading of the root + first body bloks to reduce Suspense latency.
- **Tooling**: pnpm, mkcert-powered HTTPS dev server, Storyblok CLI scripts.

## Enterprise Architecture

This repo intentionally differs from the “standard” `@storyblok/react` approach in a few key places to optimize for:

- published traffic that is ISR/static and cache-friendly
- a predictable server-side data layer (relations + deep link fixes)
- lazy component loading (avoid client-side eager imports)
- editor-first UX in preview (bridge enabled, no accidental navigation)

### Published vs Preview Routes

- **Published pages**: `src/app/(pages)/[...slug]/page.tsx`
  - Always fetches `published` stories.
  - Forced static/ISR: `dynamic = 'force-static'`, `revalidate = 600`.
- **Preview pages**: `src/app/(preview)/sb-preview/[...slug]/page.tsx`
  - Always fetches `draft` stories.
  - Dynamic by design (`force-dynamic`), and enables the Storyblok bridge.
- **Editor request routing**: `src/middleware.ts`
  - Requests containing `?_storyblok` / `?_storyblok_tk` are rewritten to `/sb-preview/...`.
  - This allows the Visual Editor to use published URLs while still hitting the preview+bridge pipeline.

### Rendering Chain

At runtime, rendering is intentionally simple and centralized:

1. Route fetches story via `fetchStory` (`src/lib/storyblok/api/client.ts`).
2. Page renders `StoryblokRenderer` (`src/lib/storyblok/rendering/StoryblokRenderer.tsx`).
3. `StoryblokRenderer`:
   - in preview: attaches the bridge via `useStoryblokBridge` (`src/lib/storyblok/hooks/useStoryblokBridge.tsx`)
   - selects the root blok (story content) and preloads likely components
4. `StoryblokComponentRenderer` (`src/lib/storyblok/rendering/StoryblokComponentRenderer.tsx`) picks the React component by blok name and renders it via Suspense.

In preview mode, `StoryblokComponentRenderer` also wraps each blok with `storyblokEditable(blok)` attributes (using `display: contents`) so bloks remain clickable/selectable in the Visual Editor even if the component itself doesn’t spread edit props.

### Lazy Component Loading

- Component registry is the single source of truth: `src/lib/storyblok/registry/loaders.ts`
- Lazy renderer map:
  - `src/lib/storyblok/registry/lazy.tsx` uses `React.lazy()` over the registry loaders.
- Small proactive preloading:
  - `StoryblokRenderer` preloads the root component + the first few body components to reduce Suspense “spinner flashes”.

Important: the refactor intentionally removed `storyblokInit(...)` component registration because it required eagerly importing the full component map on the client, which defeats lazy loading.

### Relations & Link Resolution

This project resolves Storyblok relations and fixes deeply-nested Story links centrally on the server.

- Server data layer: `src/lib/storyblok/api/storyblokServer.ts`
  - Uses `storyblok-js-client`.
  - Relations are resolved using `resolve_relations` (see `DEFAULT_RELATIONS`).
  - Built-in link resolution is disabled (`resolve_links: '0'`) and then Story links are fixed *after* relations resolve by:
    - traversing the story to collect multilink story UUIDs
    - fetching those stories via `getStories(by_uuids=...)`
    - backfilling `cached_url` / `story.full_slug` so links inside resolved relations have correct URLs

Caching behavior:

- Published: route is ISR/static; Storyblok fetches are `force-cache` with `revalidate = 600`.
- Draft: Storyblok fetches are `no-store` and include `cv` to ensure fresh preview data.

### Editor Navigation Behavior

In the Visual Editor, clicking a link should select a blok — not navigate away.

The app detects editor context via `StoryblokEditorProvider` (`src/lib/storyblok/context/StoryblokEditorContext.tsx`).
When `isEditor === true`, navigation is prevented via `event.preventDefault()` in components that render real links.

Currently guarded:

- `src/components/Storyblok/Button/Button.tsx`
- `src/components/Storyblok/FeaturedArticlesSection/FeaturedArticlesSection.tsx`
- `src/components/Storyblok/NavItem/NavItem.tsx`

## Component & Layout Highlights

| Blok | Description | Path | Notes |
| --- | --- | --- | --- |
| `default-page` | Story-level wrapper that renders nested body bloks without extra layout chrome. | `src/components/Storyblok/DefaultPage/DefaultPage.tsx` | Uses `display: contents` via CSS module to stay DOM-neutral; meta title/description surfaced via `generateMetadata`. |
| `banner` | Hero-style CTA wrapper with buttons, color & background-image controls. | `src/components/Storyblok/Banner/Banner.tsx` | Uses Mantine `Paper`, Storyblok color + alignment helpers, supports full-bleed background with constrained inner content. |
| `button` | Storyblok-configurable CTA rendered as Mantine `Button`. | `src/components/Storyblok/Button/Button.tsx` | Shares palette utilities; ghost/default variants honor Storyblok color swatches. |
| `hero-section` | Layout-aware hero with stacked/split variants, optional image decoration, and headline segments. | `src/components/Storyblok/HeroSection/HeroSection.tsx` | Supports Storyblok palette for background/accent, centers text by default, respects focus points and aspect toggles. |
| `grid-section` | Configurable grid of cards with optional lead and CTAs. | `src/components/Storyblok/GridSection/GridSection.tsx` | Supports Storyblok palette, headline segments, and `grid-card` children; caps columns between 1–4. |
| `grid-card` | Grid cell with optional image, icon, CTA, background image. | `src/components/Storyblok/GridCard/GridCard.tsx` | Light-themed by default; background images get a lightening overlay for contrast, no-image cards get a soft fill. |
| `logo-section` | Responsive grid of logos from a multi-asset field with optional lead. | `src/components/Storyblok/LogoSection/LogoSection.tsx` | Uses `getSbImageData` to respect focal points; displays nothing if no assets and no lead. |
| `faq-entry`, `faq-section` | Accordion-based FAQ section with Storyblok-managed entries. | `src/components/Storyblok/FaqSection` | Mantine `Accordion` + `Paper`, inherits global spacing system, edit attributes preserved per entry. |
| `headline-segment` | Inline headline fragment with optional highlight color. | `src/components/Storyblok/HeadlineSegment/HeadlineSegment.tsx` | Used by banner/FAQ headlines to render multi-colored titles via `renderHeadlineSegments`. |
| `tabbed-content-section` / `tabbed-content-entry` | Tabs with rich content cards. | `src/components/Storyblok/TabbedContentSection/TabbedContentSection.tsx` | Light pill tabs, full-card links, and light cards by default. |
| `testimonials-section` / `testimonial` | Cards for quotes + person meta. | `src/components/Storyblok/TestimonialsSection/TestimonialsSection.tsx` | Uses light surfaces/borders with hover lift; respects site text colors. |
| `featured-articles-section` | Grid of linked articles. | `src/components/Storyblok/FeaturedArticlesSection/FeaturedArticlesSection.tsx` | Full-card links, consistent heights, light surfaces with hover lift. |
| `form-section`, `contact-form-section`, `newsletter-form-section` | CTA/lead + form shell. | `src/components/Storyblok/Forms/*` | Light-friendly surfaces, accessible label/placeholder contrast; newsletter has accent button styling. |
| `text-section` | Rich text/lead section with optional headline segments and palette background. | `src/components/Storyblok/TextSection/TextSection.tsx` | Uses shared rich-text renderer and headline segments; omits empty wrappers. |
| `two-columns-section` | Dual-column content with optional buttons and palette backgrounds per column. | `src/components/Storyblok/TwoColumnsSection/TwoColumnsSection.tsx` | Supports per-column decoration color and headline segments; skips empty columns. |
| `image-text-section` | Side-by-side media + rich text with reversible layout. | `src/components/Storyblok/ImageTextSection/ImageTextSection.tsx` | Supports palette background, focus-aware images, headline segments, buttons, and per-device layout reversal. |
| `nav-item` | Navigation link used by menus and site config. | `src/components/Storyblok/NavItem/NavItem.tsx` | Uses multilink resolver, preserves edit attributes, falls back to a muted span when missing href. |
| `personalized-section` | Wrapper that swaps child bloks based on visitor state. | `src/components/Storyblok/PersonalizedSection/PersonalizedSection.tsx` | Supports new/returning visitor branches with arbitrary child bloks. |
| `site-config` | Story-level config for theme, header, footer. | `src/components/Storyblok/SiteConfig/SiteConfig.tsx` | Normalizes colors/fonts into CSS vars + Mantine theme; shows editor badge only in Visual Editor. |

Additional Storyblok bloks can follow the same pattern. See [Component Implementation Guide](.docs/component-guide.md) for conventions, utilities, and checklist.

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

## Testing

- Unit: `pnpm test` (Vitest, uses alias `@` → `src/`, specs in `tests/unit`).
- E2E: `pnpm cy:open` / `pnpm cy:run` (Cypress config at `tests/e2e/cypress.config.ts`, specs in `tests/e2e/specs`). Set `CYPRESS_BASE_URL` if your dev server URL differs (for example, `https://localhost:3010`).

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
- You can also use the normal published URL as the Visual Editor preview URL; the middleware rewrites Storyblok editor requests (those with `_storyblok` params) to `/sb-preview/...` automatically.
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

Additional:

| Variable   | Description                                                                 | Scope  |
| ---------- | --------------------------------------------------------------------------- | ------ |
| `SITE_URL` | Canonical base URL for metadata (used for `metadataBase`, OG URLs, etc.).   | Server |

## Indexing / SEO (Demo Subdomain)

This repository is commonly deployed as a **demo** on a subdomain. If you intend for the demo to be publicly accessible but **not indexed** by search engines (recommended for boilerplate/demo content), the app enforces:

- `robots.txt` route via `src/app/robots.ts` (disallows `/sb-preview/*` and `/api/*`)
- Global `noindex, nofollow` via Next.js metadata on the published + preview layouts
- `X-Robots-Tag: noindex, nofollow` response header (configured in `next.config.mjs`) as defense-in-depth

If you want the site to be indexed, remove/adjust these rules before launch.

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

## License

This repository is licensed under the GNU General Public License version 3, or any later version. See [LICENSE](LICENSE) for the full text.

For third-party notices, see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
