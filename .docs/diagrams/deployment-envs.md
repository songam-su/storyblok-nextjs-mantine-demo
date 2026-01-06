# Deployment & Environments

Purpose: outline environments, secrets, and HTTPS dev setup for running the app.

Notes

- Environments: local dev (self-signed HTTPS), staging/preview, production.
- Secrets: Storyblok tokens, webhook secret, canonical site URL.
- Preview enables draft fetch; production uses published + ISR.

```mermaid
flowchart LR
  Dev[Local Dev
HTTPS self-signed
.env.local] --> Staging[Staging/Preview
ENV: Storyblok preview token]
  Staging --> Prod[Production
ENV: Storyblok tokens]

  Secrets[Env vars:
NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN
STORYBLOK_PREVIEW_TOKEN
STORYBLOK_THEME_TOKEN
STORYBLOK_WEBHOOK_SECRET
SITE_URL] -.-> Dev
  Secrets -.-> Staging
  Secrets -.-> Prod

  Dev --> Users[Developers]
  Prod --> EndUsers[End Users]
```
