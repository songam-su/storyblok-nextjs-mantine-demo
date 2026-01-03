# Navigation & Link Resolution Flow

Purpose: show how Storyblok multilink fields become safe hrefs for nav/header/footer and CTAs, including fallback behavior.

Notes
- Nav items in site-config use Storyblok multilink; getSbLink sanitizes and degrades gracefully when href is missing.
- Prefetch is disabled for placeholder/unsafe links; edit attrs remain for the Visual Editor.

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
