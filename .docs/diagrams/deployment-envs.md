# Deployment & Environments

Purpose: outline environments, secrets, and HTTPS dev setup for running the app.

Notes
- Environments: local dev (self-signed HTTPS), staging/preview, production.
- Secrets: Storyblok public/preview tokens, webhook secret, site-config slug.
- Preview enables draft fetch; production uses published + ISR.

```mermaid
flowchart LR
  Dev[Local Dev
HTTPS self-signed
.env.local] --> Staging[Staging/Preview
ENV: preview token]
  Staging --> Prod[Production
ENV: public token]

  Secrets[Env vars:
STORYBLOK_TOKEN
STORYBLOK_PREVIEW_TOKEN
STORYBLOK_WEBHOOK_SECRET
SITE_CONFIG_SLUG] -.-> Dev
  Secrets -.-> Staging
  Secrets -.-> Prod

  Dev --> Users[Developers]
  Prod --> EndUsers[End Users]
```
