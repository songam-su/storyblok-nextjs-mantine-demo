# SectionHeader

`SectionHeader` is the shared building block for the common **headline + lead (+ optional actions)** pattern across Storyblok sections.

It exists to:

- Keep headline/lead typography consistent.
- Keep spacing consistent.
- Avoid re-implementing `renderHeadlineSegments(...)` in every section.

## Location

- Component: `src/components/Storyblok/SectionHeader/SectionHeader.tsx`
- Styles: `src/components/Storyblok/SectionHeader/SectionHeader.module.scss`

## When to use it

Use `SectionHeader` when your blok has:

- `blok.headline` (headline segments) and/or
- `blok.lead` (plain string lead)

…and you want the standard “section header” layout at the top of a section.

## API summary

- `headline`: Storyblok headline segments array.
- `lead`: lead string.
- `rightSlot`: optional ReactNode (usually a `Group` of CTA buttons) rendered to the right on desktop.
- `align`: `'left' | 'center'`.
- `titleOrder`, `titleSize`, `titleFw`: configure the Mantine `Title`.
- `leadProps`: configure the Mantine `Text` for the lead (avoid for standard sections; prefer the default for consistency).
- `className`: attach additional layout classes.
- `style`: wrapper inline style (useful for setting CSS variables or overriding spacing in edge-to-edge sections).

## Examples

### Headline + lead

```tsx
<SectionHeader headline={blok.headline} lead={blok.lead} />
```

### Headline + lead + actions

```tsx
<SectionHeader headline={blok.headline} lead={blok.lead} rightSlot={<Group gap="sm">{/* buttons */}</Group>} />
```

### Edge-to-edge / dark backgrounds

`SectionHeader` defaults the lead text color using Storyblok section text variables (falls back to `--sb-text` / `#111`).

If the surrounding section uses a dark background and needs inherited text color (e.g. in `Banner`), set the lead color via props or CSS variables.

```tsx
<SectionHeader
  headline={blok.headline}
  lead={blok.lead}
  leadProps={{ c: 'inherit' }}
  style={{ ['--section-header-lead-color' as any]: 'inherit' }}
/>
```

## Intentional exceptions

These components are **not migrated** to `SectionHeader` on purpose because they are not the standard “section header” pattern:

- `HeroSection` (`hero-section`): includes an eyebrow, uses `blok.text` instead of `blok.lead`, and its layout/typography is hero-specific.
- `ImageTextSection` (`image-text-section`): includes eyebrow + rich text + media layout; headline/lead spacing isn’t the shared section-header layout.
- `TwoColumnsSection` (`two-columns-section`): headings are per-column, not a single section header.
- `Footer`: uses headline rendering, but it’s not a section blok and doesn’t follow section spacing rules.

If a future design change needs them aligned, the likely direction is a separate “HeroHeader” / “EyebrowHeader” variant rather than forcing `SectionHeader` to handle all cases.
