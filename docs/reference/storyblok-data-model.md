# Storyblok Data Model (Key Bloks)

Purpose: map core content types and how pages compose them.

Notes

- Focused on page composition and shared config; not exhaustive of every field.

```mermaid
flowchart TB
  SC["site-config<br/>(theme, header, footer, nav items)"]
  DefaultPage["page story<br/>(default-page)"]
  DefaultBody["body<br/>(bloks array)"]

  ArticleOverview["page story<br/>(article-overview-page)<br/>slug: articles/"]
  ArticlePage["page story<br/>(article-page)<br/>slug: articles/*"]
  Category["category story<br/>(category)<br/>slug: categories/*"]

  DefaultPage --> DefaultBody
  SC --> Header["header nav<br/>(nav-item list)"]
  SC --> Footer[footer nav + meta]
  SC --> Theme["theme tokens<br/>(CSS vars + Mantine)"]

  subgraph Sections
    Grid["grid-section<br/>→ grid-card*"]
    Tabs["tabbed-content-section<br/>→ tabbed-content-entry*"]
    Testimonial["testimonials-section<br/>→ testimonial*"]
    Featured[featured-articles-section]
    Products[products-section]
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

  DefaultBody --> Grid
  DefaultBody --> Tabs
  DefaultBody --> Testimonial
  DefaultBody --> Featured
  DefaultBody --> Products
  DefaultBody --> Forms
  DefaultBody --> Text
  DefaultBody --> TwoCol
  DefaultBody --> ImgText
  DefaultBody --> Hero
  DefaultBody --> Logo
  DefaultBody --> Banner
  DefaultBody --> Faq
  DefaultBody --> Personalized

  ArticleOverview --> ArticlesApi["API route<br/>GET /api/articles"]
  ArticlesApi --> ArticlePage
  ArticlePage --> Category
```

## Articles (overview + detail)

- Article listing is driven by Storyblok folders:
  - `articles/` contains `article-page` stories (detail pages)
  - `categories/` contains `category` stories (used as relations on articles)
- The Article Overview page (`article-overview-page`) fetches from `GET /api/articles` and supports:
  - Search (title/excerpt/category names)
  - Category filtering
  - Category ordering based on the Storyblok folder order (`categories/` sorted by `position:asc`)

## Products (plugin-driven)

- The `products-section` blok renders cards from a Storyblok **plugin field** (demo plugin: `sb-fake-ecommerce`).
- Items are rendered directly from the plugin payload; a small demo SKU catalog is used to fill gaps and to mark sold-out items.
