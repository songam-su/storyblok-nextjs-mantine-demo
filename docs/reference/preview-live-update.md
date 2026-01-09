# Preview & Visual Editor Live Update

Purpose: show how the Storyblok Visual Editor iframe interacts with the app, sets preview mode, and receives live updates via the Storyblok Bridge.

Notes

- `/api/preview` sets the preview cookie; `/sb-preview/...` routes render draft stories.
- Storyblok Bridge listens for content changes and triggers rerenders inside the iframe.
- `storyblokEditable` attributes enable click-to-edit in the Visual Editor.

```mermaid
sequenceDiagram
  participant Editor as Storyblok Visual Editor
  participant Iframe as Preview iframe (/sb-preview/...)
  participant API as /api/preview
  participant App as Next.js App Router
  participant SB as Storyblok CDN/API (draft)

  Editor->>API: Open preview (spaceId + slug)
  API-->>Editor: Set preview cookie + redirect to /sb-preview/slug
  Editor->>Iframe: Load iframe with preview cookie
  Iframe->>App: Request draft story
  App->>SB: Fetch story (draft)
  SB-->>App: Story JSON
  App-->>Iframe: Render via StoryblokRenderer (with editable attrs)

  loop live edits
    Editor-->>Iframe: Bridge event (content updated)
    Iframe->>App: Refetch story (draft)
    App->>SB: Fetch updated story
    SB-->>App: Updated JSON
    App-->>Iframe: Rerender updated blok tree
  end
```
