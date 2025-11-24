# 🏗 Project Architecture Overview: Next.js App Router + Storyblok + Mantine

This document explains the architectural style of your project, why it’s structured this way, and the benefits compared to simpler alternatives. If you’re onboarding or just curious about how everything fits together, this is your guide.

---

## ✅ Core Principles

- **Next.js App Router** for modern routing and server components.
- **Storyblok** as the headless CMS for dynamic content.
- **Mantine** for UI theming and component styling.
- **Dynamic component resolution** for scalability and type safety.

---

## 🗂 Folder Structure & Routing

Routes live under the `app/` directory, segmented by purpose:

- `(pages)/` → Published site routes.
- `(preview)/sb-preview` → Draft preview routes with Storyblok Bridge.
- `(sub-domain-a)/` → Experimental or custom domain routes.
- `api/` → API handlers.

Each segment has its own `layout.tsx` (server component) and `providers.tsx` (client component).

---

## 🔗 Rendering Chain: From Layout to Components

### Flow:

1. **`layout.tsx` (Server Component)**
   - Wraps HTML structure for the route segment.
   - Keeps server-rendered HTML lean.

2. **`providers.tsx` (Client Component)**
   - Applies:
     - Mantine theme
     - Global styles
     - StoryblokEditorProvider
   - Then hands off to `StoryblokClientRenderer`.

### Page Rendering

- `page.tsx` fetches Storyblok stories via `fetchStory()`.
- Toggles draft/published based on `draftMode()` or preview cookies.
- Passes story JSON to `StoryblokRenderer`.

### Component Resolution

- `StoryblokRenderer` iterates over `story.content.body`.
- Each blok is resolved by `StoryblokComponentRenderer`:
  - Looks up the blok in the lazy registry.
  - Lazy-loads the matching React component.
  - Shows a Mantine spinner while loading.
  - Wraps blok with Storyblok metadata in preview mode for live editing.

---

## 🧩 Why This Structure?

1. **Server Components for Layout**
   - `layout.tsx` and `page.tsx` are server components → minimal JS on initial load.
   - Downstream components can be client or hybrid, giving flexibility.

2. **Segmented Routes**
   - `(pages)` for production HTML.
   - `(preview)` for draft previews with Bridge and editor context.
   - Keeps concerns separate while sharing the same provider stack.

3. **Providers Near Routes**
   - Each segment can tweak theme/editor behavior independently.
   - Still shares the same rendering chain for consistency.

4. **Dynamic Component Loading**
   - Lazy-load Storyblok blocks → smaller initial bundles.
   - Registry is the single source of truth.
   - Adding new components doesn’t require touching the core renderer.

---

## ✅ Benefits Over a Simpler Approach

A simpler setup might hardcode all components and providers globally, but that comes with trade-offs:

- **Bundle Size:** Static imports force all components into the server layer.
- **Tree-Shaking:** Breaks for client-only components.
- **Scalability:** Hard to manage dozens of components.
- **Editor Experience:** Manual redeploys for new components.
- **Flexibility:** No easy way to customize behavior per route segment.

### Our approach solves these by:

- Keeping server-rendered HTML lean.
- Supporting previews without bloating production.
- Enabling dynamic, type-safe component resolution.
- Maintaining a clean separation of concerns.

---

## TL;DR

This architecture balances performance, scalability, and editor experience:

- Server components for layouts.
- Client providers for theming and CMS integration.
- Dynamic component registry for Storyblok blocks.
- Segmented routes for production vs preview.
