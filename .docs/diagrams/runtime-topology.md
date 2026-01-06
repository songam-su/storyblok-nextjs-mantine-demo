# Runtime Topology — Published vs Preview

Purpose: visualize runtime components (Next.js App Router, CDN/edge cache) and how published vs preview traffic flow.

Notes

- Published: ISR (~10 min) on CDN/edge; Storyblok CDN/API backs data fetches.
- Preview: Visual Editor iframe + preview cookie; no ISR, always fresh draft fetch.
- Webhooks invalidate published cache via /api/webhooks/revalidate.

```mermaid
flowchart TB
  subgraph Published Flow
    U[End User] --> CDN[CDN/Edge\nISR cache]
    CDN -- hit --> U
    CDN -- miss --> NX[Next.js App\nApp Router]
    NX --> SB[Storyblok CDN/API]
    SB --> NX
    NX --> CDN
    NX --> U
  end

  subgraph Preview Flow
    VE[Storyblok Visual Editor\niframe] --> PR[Preview Route\n/api/preview sets cookie]
    PR --> SB2[Storyblok CDN/API\n(draft mode)]
    SB2 --> PR
    VE -. Storyblok Bridge events .-> PR
  end

  SB -. publish/update webhook .-> WH[/api/webhooks/revalidate\nHMAC + timestamp/]
  WH -. calls .-> RV[revalidatePath(slugs)]

  SB -. fetch .-> CFG[site-config story\nheader/footer/theme]
  CFG -. vars .-> NX
```
