# Technical Documentation for the Enterprise Framework

This README focuses on architecture, flows, and extension patterns for the Storyblok + Next.js (App Router) + Mantine framework. The root README can remain install-focused; use this one for system understanding and onboarding.

## Overview

- Headless CMS: Storyblok (published + preview) with Visual Editor and Bridge.
- Runtime: Next.js App Router with server layouts, client providers, lazy blok registry, Suspense/ErrorBoundary per blok.
- Theming/Chrome: Storyblok `site-config` drives header/footer, CSS vars, and Mantine theme.
- Delivery: Published uses ISR (~10 min) at CDN/edge; preview bypasses cache and reflects drafts instantly.
- Freshness: Webhooks invalidate ISR via `revalidatePath`; preview cookie controls draft mode.

## Architecture (pick SVG/PNG or Mermaid as needed)

- High-level architecture: see [diagrams/high-level-architecture.md](architecture/high-level-architecture.md).
- System context: see [diagrams/system-context.md](architecture/system-context.md).
- Runtime topology (published vs preview): see [diagrams/runtime-topology.md](architecture/runtime-topology.md).
- Published vs preview flow (focused): see [diagrams/published-vs-preview.md](architecture/published-vs-preview.md).

### Viewing Mermaid diagrams in VS Code

These diagrams are authored as Mermaid fenced blocks (e.g. ` ```mermaid `). To view them rendered (not as plain text) in VS Code:

1. Install the recommended extension `bierner.markdown-mermaid` (it’s in `.vscode/extensions.json`).
2. Open a diagram Markdown file and run **Markdown: Open Preview to the Side**.

## Rendering Pipeline

- Blok resolution: Storyblok JSON → lazy registry → Suspense + ErrorBoundary → editable attributes in preview. Diagram: [diagrams/component-resolution.md](reference/component-resolution.md).
- Error containment: see [diagrams/error-boundaries.md](reference/error-boundaries.md).

## Theming & Chrome

- Site-config story normalizes colors/fonts into CSS vars + Mantine theme; header/footer/nav come from site-config bloks (links sanitized with getSbLink). Diagram: [diagrams/site-config-theming.md](reference/site-config-theming.md).
- Form/light UX: see [diagrams/form-ux.md](reference/form-ux.md).
- Link safety: [diagrams/navigation-link-resolution.md](reference/navigation-link-resolution.md).
- Images/focal points: [diagrams/image-handling.md](reference/image-handling.md).

## Data Freshness & Preview

- ISR lifecycle: [diagrams/isr-cache-lifecycle.md](reference/isr-cache-lifecycle.md).
- Webhook verification and revalidation: [diagrams/webhook-revalidate.md](reference/webhook-revalidate.md).
- Preview/editor live updates: [diagrams/preview-live-update.md](reference/preview-live-update.md).

## Content Model & Components

- Key Storyblok bloks and composition: [diagrams/storyblok-data-model.md](reference/storyblok-data-model.md).
- Registry pattern: lazy typed registry (see decision record [decisions/dynamicComponentRegistration.md](decisions/dynamicComponentRegistration.md)).
- How to add a blok:
  1. Define schema in Storyblok; pull generated types.
  2. Implement component (typed with generated blok interface).
  3. Register in lazy registry; optionally preload common roots.
  4. Verify in preview and published.

## Environments & Ops

- Env/secrets and HTTPS dev: [diagrams/deployment-envs.md](reference/deployment-envs.md).
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
