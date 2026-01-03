# ISR Cache Lifecycle (Published Routes)

Purpose: depict how ISR populates/serves content, and how webhooks invalidate stale pages.

Notes
- ISR window ~10 minutes; first miss triggers render and cache fill.
- Webhooks call revalidatePath to invalidate affected slugs.

```mermaid
flowchart LR
  U[User request] --> CDN[CDN/Edge cache]
  CDN -- hit (fresh) --> U
  CDN -- miss/stale --> NX[Next.js render]
  NX --> SB[Storyblok CDN/API
  published content]
  SB --> NX
  NX --> CDN
  CDN --> U

  SB -. publish/update webhook .-> WH[/api/webhooks/revalidate/]
  WH -. revalidatePath(slugs) .-> CDN
```
