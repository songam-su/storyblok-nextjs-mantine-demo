# Site Config & Theming Flow

Purpose: show how the Storyblok `site-config` story drives header/footer, CSS variables, and Mantine theme for all sections.

Notes

- Layout fetches `site-config` (published or draft depending on mode).
- Colors/fonts are normalized into CSS variables and Mantine theme overrides.
- Header/footer/nav come from site-config bloks (NavItem uses getSbLink sanitizer).
- Page sections inherit theme tokens (light surfaces, text color, button styles) via providers.

```mermaid
flowchart LR
  SB["Storyblok CDN/API<br/>site-config story"] --> Fetch["Fetch in layout/page<br/>(published or draft)"]
  Fetch --> Normalize["Normalize theme<br/>colors/fonts -> CSS vars + Mantine theme"]
  Normalize --> Provider["SiteConfigProvider + MantineProvider<br/>(sets CSS vars, theme)"]
  Provider --> Header["Header/Footer render<br/>nav items via NavItem"]
  Provider --> Sections["Page sections<br/>(grid, tabs, testimonials, forms, etc.)"]
  Nav["NavItem<br/>multilink + getSbLink"] --> Header
  CFG["Palette tokens<br/>text/background/accents"] -.-> Sections
  CFG -.-> Header
```
