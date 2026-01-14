# Deployment & Environments

Purpose: outline environments, secrets, and HTTPS dev setup for running the app.

Notes

- Environments: local dev (self-signed HTTPS), staging/preview, production.
- Secrets: Storyblok tokens, webhook secret, canonical site URL.
- Preview enables draft fetch; production uses published + ISR.

```mermaid
flowchart LR
  Dev["Local Dev<br/>HTTPS self-signed<br/>.env.local"] --> Staging["Staging/Preview<br/>ENV: Storyblok preview token"]
  Staging --> Prod["Production<br/>ENV: Storyblok tokens"]

  Secrets["Env vars:<br/>STORYBLOK_PREVIEW_TOKEN<br/>STORYBLOK_PUBLIC_TOKEN<br/>STORYBLOK_THEME_TOKEN<br/>STORYBLOK_WEBHOOK_SECRET<br/>SITE_URL"] -.-> Dev
  Secrets -.-> Staging
  Secrets -.-> Prod

  Dev --> Users[Developers]
  Prod --> EndUsers[End Users]
```
