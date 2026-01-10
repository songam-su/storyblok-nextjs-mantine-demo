# Dynamic Component Registration (Decision Record)

We load Storyblok bloks through a lazy, typed registry instead of static imports. This keeps server output lean, lets client-only bloks stay client, and stays in sync with Storyblok schemas.

---

## Why

- App Router + server components: static-importing every blok drags client code into the server graph and bloats render time.
- Bundle hygiene: lazy imports pull only what the current story needs; Suspense keeps UX smooth.
- Type safety: generated `storyblok-components.d.ts` keeps props aligned with the CMS schema.
- Editor velocity: new bloks can ship without touching a monolithic `storyblokInit`; the registry maps type → component in one place.

---

## How we do it

- Lazy registry (`src/lib/storyblok/registry/lazy.tsx`) resolves by `blok.component` and dynamically imports the React module.
- `StoryblokComponentRenderer` wraps each blok in Suspense + ErrorBoundary and adds `storyblokEditable` in preview.
- Preload only when helpful (e.g., root blok + a few common children) to cut first Suspense flashes; avoid per-render preloads.
- Shared helpers (headline segments, rich text, link sanitizer, palette/alignment utils) keep components thin.

---

## Alternatives considered

- **Static registration** in `storyblokInit`: rejected—bundles every blok into server render, hurts tree-shaking, and couples deployment to schema changes.
- **Hybrid (static core + dynamic rest)**: acceptable for legacy, but the fully lazy registry is simpler and keeps behavior consistent across preview/published.

---

## Operational notes

- Keep the registry aligned with generated types (`docs/diagrams` and `storyblok-components.d.ts`).
- When adding a blok: define schema in Storyblok, pull types, add component, add registry entry, and (optionally) add a preload hint.
- Preview/published both use the same registry; draft mode only changes fetch params, not component resolution.
