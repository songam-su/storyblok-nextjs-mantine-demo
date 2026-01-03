# Storyblok Component Resolution & Rendering Chain

Purpose: show how a fetched Storyblok story becomes rendered React components with lazy registry, Suspense, and edit attributes.

Notes
- Server fetches story JSON; StoryblokRenderer walks `content.body`.
- StoryblokComponentRenderer resolves blok type from lazy registry, dynamically imports the component, wraps with Suspense + ErrorBoundary.
- storyblokEditable attributes are applied in preview/visual editor to enable click-to-edit.
- Mantine theme + SiteConfig vars already applied by providers/layout.

```mermaid
sequenceDiagram
  participant Route as Route (page.tsx)
  participant Renderer as StoryblokRenderer
  participant CompR as StoryblokComponentRenderer
  participant Registry as Lazy Registry
  participant BlokComp as Blok Component

  Route->>Renderer: story.content.body[]
  loop for each blok
    Renderer->>CompR: render blok
    CompR->>Registry: resolve blok.component
    Registry-->>CompR: dynamic import (lazy)
    CompR->>BlokComp: render within Suspense + ErrorBoundary
    BlokComp-->>CompR: React tree w/ storyblokEditable attrs (preview only)
    CompR-->>Renderer: rendered blok
  end
```
