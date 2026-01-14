# Project Architecture (Tech Stack)

Focus: Next.js App Router + Storyblok + Mantine. This diagram intentionally omits hosting/domains.

Notes

- Published route: `app/(pages)/...` (ISR/static)
- Preview route: `app/(preview)/sb-preview/...` (draft + bridge)
- Editor requests are rewritten to preview via `next.config.mjs` rewrites
- Publish events should call `/api/webhooks/revalidate`

```mermaid
flowchart LR
  %% Core systems
  subgraph Client[Clients]
    U[Users]
    E["Editors (Storyblok Visual Editor)"]
  end

  subgraph Next[Next.js App Router]
    Proxy["Edge proxy (src/proxy.ts)"]

    Pub["Published routes"]
    Prev["Preview routes"]

    ApiPreview["GET /api/preview"]
    ApiExit["GET /api/exit-preview"]

    Renderer["StoryblokRenderer (registry + lazy loading)"]
    Theme["SiteConfigProvider (CSS vars + Mantine theme)"]

    Webhook["POST /api/webhooks/revalidate"]
    Auth["Auth middleware example (src/middleware/auth.ts)"]
  end

  subgraph CMS[Storyblok]
    SB[(Storyblok CDN Content API)]
    VE[(Visual Editor + Bridge events)]
    PubHook[(Publish webhook)]
  end

  %% Entry points
  U --> Proxy
  E --> Proxy

  %% Routing decisions
  Proxy --> Prev
  Proxy --> Pub
  Proxy --> Auth

  %% Preview control endpoints
  U --> ApiPreview --> Prev
  U --> ApiExit --> Pub

  %% Data + render pipeline
  Pub --> SB
  Prev --> SB
  SB --> Renderer
  Theme --> Renderer
  Pub --> Renderer
  Prev --> Renderer
  VE -.-> Renderer

  %% Freshness
  PubHook --> Webhook
```
