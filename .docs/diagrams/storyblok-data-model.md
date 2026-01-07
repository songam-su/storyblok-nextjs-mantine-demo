# Storyblok Data Model (Key Bloks)

Purpose: map core content types and how pages compose them.

Notes

- Focused on page composition and shared config; not exhaustive of every field.

```mermaid
flowchart TB
  SC["site-config<br/>(theme, header, footer, nav items)"]
  Page["page story<br/>(default-page)"]
  Body[body (bloks array)]

  Page --> Body
  SC --> Header["header nav<br/>(nav-item list)"]
  SC --> Footer[footer nav + meta]
  SC --> Theme["theme tokens<br/>(CSS vars + Mantine)"]

  subgraph Sections
    Grid["grid-section<br/>→ grid-card*"]
    Tabs["tabbed-content-section<br/>→ tabbed-content-entry*"]
    Testimonial["testimonials-section<br/>→ testimonial*"]
    Featured[featured-articles-section]
    Forms[form-section / contact-form-section / newsletter-form-section]
    Text[text-section]
    TwoCol[two-columns-section]
    ImgText[image-text-section]
    Hero[hero-section]
    Logo[logo-section]
    Banner[banner]
    Faq["faq-section<br/>→ faq-entry*"]
    Personalized["personalized-section<br/>(branching children)"]
  end

  Body --> Grid
  Body --> Tabs
  Body --> Testimonial
  Body --> Featured
  Body --> Forms
  Body --> Text
  Body --> TwoCol
  Body --> ImgText
  Body --> Hero
  Body --> Logo
  Body --> Banner
  Body --> Faq
  Body --> Personalized
```
