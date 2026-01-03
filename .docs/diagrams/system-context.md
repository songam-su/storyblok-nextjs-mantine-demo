# System Context — Storyblok + Next.js + Mantine

Purpose: show how content flows between Storyblok, the Next.js App Router runtime, CDN/edge caching, and preview/webhook paths.

Notes
- Published traffic: user → CDN (hit/miss) → Next.js → Storyblok CDN/API → backfill CDN → user.
- Preview traffic: Storyblok Visual Editor iframe → preview route with preview cookie → Storyblok CDN/API; Storyblok Bridge pushes live updates to the iframe.
- Webhooks: Storyblok publish/update → /api/webhooks/revalidate (HMAC + timestamp) → revalidatePath on affected slugs; exit-preview clears preview mode.
- Site-config story supplies header/footer/theme tokens to layouts and Mantine theme.
- ISR window ~10 minutes on published routes; local dev uses self-signed HTTPS certs.

```mermaid
flowchart LR
  U[End User\nBrowser]
  CDN[CDN / Edge\nISR cache]
  NX[Next.js App\nApp Router]
  SB[Storyblok CDN/API]
  VE[Storyblok Visual Editor\nPreview iframe]
  PR[Preview route\n/api/preview + cookie]
  EP[/api/exit-preview/\nclear preview]
  WH[/api/webhooks/revalidate\nHMAC + timestamp/]
  RV[revalidatePath\n(invalidate slugs)]
  CFG[site-config story\nheader/footer/theme]

  U --> CDN
  CDN -- hit --> U
  CDN -- miss --> NX
  NX --> SB
  SB --> NX
  NX --> CDN
  NX --> U

  VE --> PR
  PR --> SB
  SB --> PR
  VE -. Bridge events .-> PR
  PR -. exit .-> EP

  SB -. publish/update webhook .-> WH
  WH -. triggers .-> RV

  SB -. fetch .-> CFG
  CFG -. theming/header/footer .-> NX
```
