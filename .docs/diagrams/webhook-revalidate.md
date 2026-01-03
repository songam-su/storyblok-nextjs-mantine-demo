# Webhook Revalidation Sequence

Purpose: illustrate Storyblok publish/update webhook handling, signature/timestamp checks, slug collection, and Next.js revalidation calls.

Notes
- Webhook hits `/api/webhooks/revalidate?secret=...` with headers `x-storyblok-signature` (HMAC SHA1) and `x-storyblok-request-timestamp`.
- We accept if: secret matches, signature matches raw body, timestamp is fresh (± tolerated skew), then revalidate collected slugs.
- Slugs come from `story.full_slug`, `story.alternates[].full_slug`, and `cached_urls`.
- Fail fast on invalid secret/signature/stale timestamp; no revalidation on failure.

```mermaid
sequenceDiagram
  participant SB as Storyblok
  participant API as /api/webhooks/revalidate
  participant Guard as Verify secret + HMAC + timestamp
  participant Collect as Collect slugs
  participant Cache as revalidatePath(slug)

  SB->>API: POST body + signature + timestamp + secret query
  API->>Guard: validate secret + HMAC(rawBody) + timestamp freshness
  Guard-->>API: ok / 401 error
  alt valid
    API->>Collect: story.full_slug + alternates + cached_urls
    Collect-->>API: slugs array
    loop for each slug
      API->>Cache: revalidatePath(slug)
    end
    API-->>SB: 200 { revalidated: true, slugs }
  else invalid
    API-->>SB: 401 { error: "Invalid signature" | "Stale webhook" }
  end
```
