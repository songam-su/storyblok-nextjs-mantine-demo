# System Context — Storyblok + Next.js + Mantine

Purpose: show how content flows between Storyblok, the Next.js App Router runtime, CDN/edge caching, preview, and webhooks.

Notes

- Published: user → CDN (hit/miss) → Next.js → Storyblok CDN/API → CDN fill → user.
- Preview: Visual Editor iframe → preview route (cookie) → Storyblok CDN/API; Bridge events live-update the iframe.
- Webhooks: publish/update → /api/webhooks/revalidate (HMAC + timestamp) → revalidatePath; /api/exit-preview clears preview mode.
- Site-config story supplies header/footer/theme tokens and Mantine theme overrides.
- ISR window ~10 minutes on published routes; local dev uses self-signed HTTPS certs.

```mermaid
flowchart LR
  U["End User<br/>Browser"]
  CDN["CDN / Edge<br/>ISR cache"]
  NX["Next.js App<br/>App Router"]
  SB[Storyblok CDN/API]
  VE["Storyblok Visual Editor<br/>Preview iframe"]
  PR["Preview route<br/>/api/preview + cookie"]
  EP["/api/exit-preview/<br/>clear preview"]
  WH["/api/webhooks/revalidate<br/>HMAC + timestamp"]
  RV["revalidatePath<br/>(invalidate slugs)"]
  CFG["site-config story<br/>header/footer/theme"]

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
