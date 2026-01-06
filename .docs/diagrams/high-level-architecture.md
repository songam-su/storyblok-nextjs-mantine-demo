# Architecture — Storyblok + Next.js (App Router) + Mantine

End-to-end view of content flow, runtime paths, theming, and freshness.

Key ideas

- Storyblok as the source of truth; Visual Editor for preview with live Bridge events.
- Next.js App Router segments for published and preview, sharing providers (SiteConfig, Mantine, editor context).
- CDN/Edge for ISR-cached published traffic; preview bypasses cache.
- Webhooks to invalidate ISR; site-config drives chrome/theme tokens.

```mermaid
flowchart TB
  subgraph CMS
    SB[Storyblok CDN/API]
    VE[Storyblok Visual Editor]
    CFG[site-config story
  (theme, header/footer, nav)]
  end

  subgraph Runtime
    APP[Next.js App Router
  (layouts + providers)]
    RENDER[Storyblok Renderer
  (lazy registry + Suspense/ErrorBoundary)]
    THEME[Mantine Theme + CSS vars
  from site-config]
    BRIDGE[Storyblok Bridge
  (live updates in preview)]
  end

  subgraph Delivery
    CDN[CDN/Edge
  ISR cache]
    USERS[End Users]
    EDITORS[Editors (preview iframe)]
  end

  %% Published flow
  USERS --> CDN
  CDN -->|hit| USERS
  CDN -->|miss| APP
  APP --> SB
  SB --> APP
  APP --> RENDER
  RENDER --> CDN
  CDN --> USERS

  %% Preview flow
  VE --> EDITORS
  EDITORS --> APP
  APP -->|draft| SB
  SB --> APP
  APP --> RENDER
  BRIDGE -. live updates .-> APP

  %% Theming / chrome
  SB --> CFG
  CFG --> THEME
  THEME --> APP
  THEME --> RENDER

  %% Webhooks / freshness
  SB -. publish/update webhook .-> WH[/api/webhooks/revalidate]
  WH -. revalidatePath .-> CDN
```
