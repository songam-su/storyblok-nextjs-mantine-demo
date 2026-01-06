# 🏗 Architecture Decisions (Current)

This captures how we structure the Storyblok-powered Next.js App Router build, what changed recently, and why.

---

## ✅ Core Principles

- App Router first: server components for layouts/pages; client where needed.
- Storyblok-driven rendering with a typed, lazy component registry.
- Site-config story controls chrome (header/footer), CSS vars, and Mantine theme.
- Light-friendly UI defaults; accessibility and contrast baked into shared styles.
- Preview-friendly: draft mode, Storyblok Bridge, editable guards to avoid hydration issues.

---

## 🗂 Routing & Layouts

- `(pages)/` — Published site (ISR, public token).
- `(preview)/sb-preview/` — Draft/visual editor preview (preview token + Bridge).
- `api/` — Preview/exit-preview + webhooks (revalidate, reindex).

Each segment uses `layout.tsx` (server) + `providers.tsx` (client) to apply theme, globals, Storyblok editor context, and the SiteConfigProvider.

---

## Data Fetch & Theming

- Pages fetch the Storyblok story and the `site-config` story (matching draft/published mode).
- Site-config is normalized into CSS variables + Mantine theme overrides (font stack Inter/Segoe, light surfaces, accent tokens).
- Header/footer/nav render from site-config blok data; links sanitized via `getSbLink`.
- Published routes use ISR (~10 min window); preview bypasses cache.

---

## Rendering Chain

- `StoryblokRenderer` walks the blok tree.
- `StoryblokComponentRenderer` resolves blok types via the lazy registry, wraps each in Suspense + ErrorBoundary, and applies `storyblokEditable` in preview.
- Components lean on shared helpers (headline segments, rich text render, color/alignment utils) and are guarded against empty content.

---

## Why This Structure

- Performance: server components keep initial JS small; lazy registry avoids pulling every blok.
- Editor UX: preview/draft parity with published; Bridge live updates; editable attributes guarded to avoid hydration mismatches.
- Theming at the edges: site-config drives chrome and CSS vars so all sections inherit consistent contrast/spacing without per-blok overrides.
- Maintainability: adding a blok means schema + component + registry entry; no central renderer churn.

---

## TL;DR

- Server layouts + client providers + site-config-driven theme/chrome.
- Typed, lazy Storyblok registry with Suspense/ErrorBoundary around each blok.
- ISR for published, draft mode for preview, webhooks to revalidate on publish.
- Shared helpers for links, colors, typography, and headline/richtext rendering.

---

## Diagrams

- [.docs/diagrams/architecture/project-architecture.md](../diagrams/architecture/project-architecture.md)
- [.docs/diagrams/architecture/rendering-and-theming.md](../diagrams/architecture/rendering-and-theming.md)
- [.docs/diagrams/architecture/content-freshness-and-preview.md](../diagrams/architecture/content-freshness-and-preview.md)
