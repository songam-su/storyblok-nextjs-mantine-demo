# Project Architecture (Tech Stack)

Focus: Next.js App Router + Storyblok + Mantine. This diagram intentionally omits hosting/domains.

```mermaid
flowchart LR
  %% Core systems
  subgraph Client[Clients]
    U[Users]
    E[Editors (Storyblok Visual Editor)]
  end

  subgraph Next[Next.js App Router]
    Proxy["Request proxy / middleware-style routing<br/>src/proxy.ts"]

    Pub[("Published routes<br/>app/(pages)/[...slug]")]
    Prev[("Preview routes<br/>app/(preview)/sb-preview/[...slug]")]

    ApiPreview[/GET /api/preview<br/>Enable draftMode + redirect to /sb-preview/]
    ApiExit[/GET /api/exit-preview<br/>Disable draftMode + redirect/]

    Renderer["StoryblokRenderer<br/>+ component registry + lazy loading"]
    Theme["SiteConfigProvider<br/>CSS vars + Mantine theme"]

    Webhook[/POST /api/webhooks/revalidate<br/>Verify signature + revalidatePath/]
    Auth["Auth middleware (example)<br/>src/middleware/auth.ts"]
  end

  subgraph CMS[Storyblok]
    SB[(Storyblok CDN Content API)]
    VE[(Visual Editor + Bridge events)]
    PubHook[(Publish webhook)]
  end

  %% Entry points
  U --> Proxy
  E -->|?_storyblok / ?_storyblok_tk| Proxy

  %% Routing decisions
  Proxy -->|rewrite to /sb-preview/*| Prev
  Proxy -->|normal published navigation| Pub
  Proxy -->|/dashboard/* (example)| Auth

  %% Preview control endpoints
  U --> ApiPreview --> Prev
  U --> ApiExit --> Pub

  %% Data + render pipeline
  Pub -->|fetch published story| SB
  Prev -->|fetch draft story| SB
  SB --> Renderer
  Theme --> Renderer
  Pub --> Renderer
  Prev --> Renderer
  VE -. live updates .-> Renderer

  %% Freshness
  PubHook --> Webhook
