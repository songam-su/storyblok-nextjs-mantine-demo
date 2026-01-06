# Rendering & Theming Architecture

Focus: how Storyblok bloks become React UI (Mantine), and how site-config drives theme/chrome.

```mermaid
flowchart TB
  subgraph Route[App Router Route]
    Page[page.tsx\n(published or preview)]
    Meta[generateMetadata\n(meta_title/meta_description)]
  end

  subgraph Data[Server Data Layer]
    Fetch[fetchStory\nlib/storyblok/api/client.ts]
    Server[getStory + relations/link fixes\nlib/storyblok/api/storyblokServer.ts]
  end

  subgraph Render[Rendering Layer]
    SBRenderer[StoryblokRenderer\nlib/storyblok/rendering/StoryblokRenderer.tsx]
    CompRenderer[StoryblokComponentRenderer\nlib/storyblok/rendering/StoryblokComponentRenderer.tsx]
    Registry[Lazy registry\nlib/storyblok/registry/*]
    Boundary[Per-blok Suspense + ErrorBoundary]
  end

  subgraph Theme[Theming]
    SiteConfig[site-config story\n(Storyblok content model)]
    Provider[SiteConfigProvider\n+ Mantine Provider]
    CssVars[CSS variables\n+ Mantine theme overrides]
    Chrome[Header/Footer\ncomponents/chrome/*]
  end

  subgraph UI[Blok UI Components]
    Bloks[src/components/Storyblok/*]
    Utils[Shared helpers\n(richtext, links, colors, spacing)]
  end

  Page --> Fetch --> Server
  Server --> SBRenderer
  Meta --> Fetch

  SBRenderer --> CompRenderer
  CompRenderer --> Registry
  Registry --> Boundary --> Bloks
  Bloks --> Utils

  SiteConfig --> Provider --> CssVars
  Provider --> Chrome
  Provider --> SBRenderer
  CssVars --> Bloks

  %% Preview-only behavior
  Preview[Preview mode]\n(bridge + editable attrs)
  Preview -. enable useStoryblokBridge .-> SBRenderer
  Preview -. storyblokEditable wrapper .-> CompRenderer
```