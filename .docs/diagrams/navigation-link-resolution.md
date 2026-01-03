# Navigation & Link Resolution Flow

Purpose: show how Storyblok multilink fields become safe hrefs for nav/header/footer and CTAs, including fallback behavior.

Notes
- Nav items in site-config use Storyblok multilink; we sanitize via getSbLink and degrade gracefully when href is missing.
- Prefetch disabled for placeholder/unsafe links; edit attrs kept for Visual Editor.

```mermaid
flowchart LR
  SB[Storyblok
  multilink field] --> NavItem[NavItem component]
  NavItem --> Resolver[getSbLink
  (sanitize, strip invalid)]
  Resolver -- valid --> Href[href + target + rel]
  Resolver -- invalid --> Fallback[Muted span / no prefetch]
  Href --> Anchor[Anchor/Button
  prefetch off for placeholders]
  Fallback --> Anchor
```
