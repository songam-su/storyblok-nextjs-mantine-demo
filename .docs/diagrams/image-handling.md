# Image Handling & Focal Points

Purpose: illustrate how Storyblok assets are turned into responsive images with focus awareness.

Notes
- getSbImageData reads asset metadata, focus, and size prefs; returns URL + sizes for <Image>.
- Components (logo grids, cards, hero, image-text) consume this helper to respect focal points and aspect constraints.

```mermaid
flowchart LR
  SB[Storyblok asset
  + focal point] --> Helper[getSbImageData
  (url, width/height, sizes)]
  Helper --> Components[Hero / Grid Card / Logo Section / Image-Text]
  Components --> NextImage[Next/Image or <img>
  with sizes + object-fit]
```
