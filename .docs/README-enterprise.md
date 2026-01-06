# Technical Documentation for the Enterprise Framework

This README focuses on architecture, flows, and extension patterns for the Storyblok + Next.js (App Router) + Mantine framework. The root README can remain install-focused; use this one for system understanding and onboarding.

## Overview

- Headless CMS: Storyblok (published + preview) with Visual Editor and Bridge.
- Runtime: Next.js App Router with server layouts, client providers, lazy blok registry, Suspense/ErrorBoundary per blok.
- Theming/Chrome: Storyblok `site-config` drives header/footer, CSS vars, and Mantine theme.
- Delivery: Published uses ISR (~10 min) at CDN/edge; preview bypasses cache and reflects drafts instantly.
- Freshness: Webhooks invalidate ISR via `revalidatePath`; preview cookie controls draft mode.

## Architecture (pick SVG/PNG or Mermaid as needed)

- High-level architecture: see [.docs/diagrams/high-level-architecture.md](.docs/diagrams/high-level-architecture.md).
- System context: see [.docs/diagrams/system-context.md](.docs/diagrams/system-context.md).
- Runtime topology (published vs preview): see [.docs/diagrams/runtime-topology.md](.docs/diagrams/runtime-topology.md).

## Rendering Pipeline

- Blok resolution: Storyblok JSON → lazy registry → Suspense + ErrorBoundary → editable attributes in preview. Diagram: [.docs/diagrams/component-resolution.md](.docs/diagrams/component-resolution.md).
- Error containment: see [.docs/diagrams/error-boundaries.md](.docs/diagrams/error-boundaries.md).

## Theming & Chrome

- Site-config story normalizes colors/fonts into CSS vars + Mantine theme; header/footer/nav come from site-config bloks (links sanitized with getSbLink). Diagram: [.docs/diagrams/site-config-theming.md](.docs/diagrams/site-config-theming.md).
- Form/light UX: see [.docs/diagrams/form-ux.md](.docs/diagrams/form-ux.md).
- Link safety: [.docs/diagrams/navigation-link-resolution.md](.docs/diagrams/navigation-link-resolution.md).
- Images/focal points: [.docs/diagrams/image-handling.md](.docs/diagrams/image-handling.md).

## Data Freshness & Preview

- ISR lifecycle: [.docs/diagrams/isr-cache-lifecycle.md](.docs/diagrams/isr-cache-lifecycle.md).
- Webhook verification and revalidation: [.docs/diagrams/webhook-revalidate.md](.docs/diagrams/webhook-revalidate.md).
- Preview/editor live updates: [.docs/diagrams/preview-live-update.md](.docs/diagrams/preview-live-update.md).

## Content Model & Components

- Key Storyblok bloks and composition: [.docs/diagrams/storyblok-data-model.md](.docs/diagrams/storyblok-data-model.md).
- Registry pattern: lazy typed registry (see decision record [.docs/decisions/dynamicComponentRegistration.md](.docs/decisions/dynamicComponentRegistration.md)).
- How to add a blok:
  1) Define schema in Storyblok; pull generated types.
  2) Implement component (typed with generated blok interface).
  3) Register in lazy registry; optionally preload common roots.
  4) Verify in preview and published.

## Environments & Ops

- Env/secrets and HTTPS dev: [.docs/diagrams/deployment-envs.md](.docs/diagrams/deployment-envs.md).
- Published uses public token + ISR; preview uses preview token + draft fetch; webhooks secured by HMAC + timestamp + shared secret.

## Testing

- Unit coverage includes webhook verification and shared helpers (links, images). Run: `pnpm test` or `pnpm vitest`.

## For Clean Architecture-style visuals

If you prefer a Clean Architecture framing for stakeholders, create or export a diagram that layers:

- Interface layer: Next.js routes/layouts, Mantine UI, Storyblok editable attrs.
- Application layer: rendering pipeline (registry, Suspense/ErrorBoundary), preview/draft controls, link/image helpers.
- Domain/content layer: Storyblok schemas (site-config, sections, cards, forms, tabs, testimonials, personalization).
- Infrastructure layer: Storyblok CDN/API, webhooks, CDN/ISR, environment secrets.

## Getting Started (concise)

- Install deps: `pnpm install`
- Run dev (HTTPS with self-signed certs): `pnpm dev`
- Preview mode: hit `/api/preview?slug=...` to enable draft mode and redirect into `/sb-preview/...`; exit via `/api/exit-preview`.

Note: In this repo, `/api/preview` does not validate a token by default (it relies on Next draft mode cookies + the dedicated preview route). If you deploy this publicly and want to restrict preview enabling, add your own auth/secret check.

Use this README as the “enterprise framework” reference; keep the root README minimal for quick start. Feel free to swap in exported PNG/SVGs from Whimsical or Mermaid for the diagram links above.
