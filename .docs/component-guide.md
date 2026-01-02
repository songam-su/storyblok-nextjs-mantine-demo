## Render tree overview

```text
app/(pages)/layout.tsx
└─ page-shell (outer max-width + padding wrapper)
   └─ page-shell__content (1400px cap + vertical stacking)
  └─ StoryblokRenderer (root blok) → StoryblokComponentRenderer → <Blok component>
```

- `StoryblokRenderer` renders the root blok (page) and passes it to `StoryblokComponentRenderer`; page-level bloks (e.g., default-page) render their body children.
- `StoryblokComponentRenderer` lazy-loads the Mantine component, wraps it with Suspense + ErrorBoundary, and applies `data-blok-*` attributes in preview mode.

## Layout & spacing rules

- **Max width:** 1400 px everywhere (`--page-shell-max-width`).
- **Horizontal gutters:** 16 px `<48em`, 20 px `48–62em`, 24 px `≥62em`. These values live in `src/styles/globals.scss` as CSS variables.
- **Standard sections:** default to the page-shell width so their background color never touches the viewport on smaller screens.
- **Edge-to-edge sections:** add the `.edge-to-edge` class to the outer wrapper and wrap inner content in `.edge-to-edge__inner`. Example from `Banner`:

```tsx
<Paper component="section" className={classNames(styles.banner, 'edge-to-edge', backgroundClass)}>
  <div className="edge-to-edge__inner">
    {/* text/buttons constrained to 1400px + gutters */}
  </div>
</Paper>
```

## Shared utilities

| Helper | Location | Purpose |
| --- | --- | --- |
| `getStoryblokColorClass` | `src/lib/storyblok/utils/styles/color/storyblokColorUtils.ts` | Returns the SCSS module class that maps Storyblok color pickers to CSS custom properties. |
| `getStoryblokAlignmentMeta` | `src/lib/storyblok/utils/styles/alignment/storyblokAlignment.ts` | Converts alignment select fields into `textAlign`, `justifyContent`, and `alignItems` values. |
| `renderHeadlineSegments` | `src/components/Storyblok/utils/renderHeadlineSegments.tsx` | Builds highlighted headlines from the segment array editors manage. |
| `renderSbRichText` | `src/components/Storyblok/utils/renderSbRichText.tsx` | Renders rich-text fields consistently with typography defaults. |

Whenever possible, rely on these helpers instead of duplicating alignment or color logic inside each blok.

## Component checklist

1. **Type safety** – Import the generated blok interface from `src/lib/storyblok/resources/types/storyblok-components.d.ts` and type your component as `React.FC<SbComponentProps<YourBlok>>`.
2. **Storyblok edit bridge** – Call `storyblokEditable(blok as any)` and spread the returned attributes on your root element so editors can click-to-edit in the visual editor.
3. **Preload common blok types** – When you can inspect the story, preload the root blok and the first few body blok component types once (via `lazyRegistry.preload`) to reduce Suspense latency. Avoid per-render preloads inside individual components.
4. **Layout decision** – Decide whether the blok is full-bleed (`edge-to-edge`) or standard (inherits page-shell width). Apply the helper classes accordingly.
5. **Spacing** – Use Mantine `Stack`, `Group`, and spacing tokens instead of hard-coded pixel values. Favor `gap` props over manual margins when possible.
6. **Conditional rendering** – Guard against empty blok fields so unused sections don’t render blank wrappers.
7. **Buttons/links** – Reuse the shared `Button` component when editors can attach CTAs; it already understands Storyblok button fields and theme colors.
8. **Testing** – Validate the blok in both published (`/`) and preview (`/sb-preview/...`) routes to ensure draft data and the Storyblok bridge work.

## Examples

- **Banner (`banner`)** – Demonstrates full-bleed backgrounds with constrained inner content, background image cover/contain toggles, and alignment helpers.
- **FAQ Section (`faq-section`)** – Shows how to compose nested bloks (entries) with Mantine `Accordion`, including edit attributes at the item level.
- **Default Page (`default-page`)** – DOM-neutral wrapper that renders the story body while exposing Storyblok edit attributes; metadata pulled via route `generateMetadata`.
- **Headline Segment (`headline-segment`)** – Inline fragment used by headline renderers; applies highlight classes via `getStoryblokHighlightClass`.
- **Hero Section (`hero-section`)** – Stacked/split hero with palette-aware backgrounds, optional image decoration, and headline segments rendered via `renderHeadlineSegments`.
- **Grid Section (`grid-section`)** – Multi-column card grid (1–4 cols) with headline segments, optional lead/CTAs, and `grid-card` children.
- **Text Section (`text-section`)** – Headline/lead plus rich text content, rendered via `renderSbRichText` with palette background support.

Use these as references when building new sections such as grids, testimonials, or hero variations.
