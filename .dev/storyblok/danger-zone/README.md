# Danger Zone: Storyblok space cloning scripts

This folder contains **destructive / high-impact** scripts used to clone (copy) Storyblok content and assets between spaces.

If you point these at the wrong space, you can overwrite content. Treat these like production-grade migration tooling.

## Scripts are intentionally disabled

These scripts may be renamed to include a `.disabled` suffix (for example: `clone-space.js.disabled`) to prevent accidental execution.

To run them, you must **manually rename the files back** to their runnable names (for example: `clone-space.js`).

Important: `clone-space.js` imports `./copy-assets.js`, so you must restore **both** filenames (and any other imported scripts) or Node will error on import.

## What these scripts do

The primary script is:

- `clone-space.js` — clones **folders + stories** from a **SOURCE** space into a **TARGET** space, then:
  - preflights components into the target (and ensures the target has the right `is_root` flags)
  - optionally publishes pages depending on `PUBLISH_MODE`
  - copies **assets** from an **ASSET ORIGIN** space into the target
  - rewrites references in target stories:
  - story UUID references (e.g. blok/stories relationships)
  - asset IDs and asset `filename` URLs

Other scripts (typically not needed if you use `clone-space.js`):

- `copy-assets.js` — asset folder + asset copy + reference rewrite (used by `clone-space.js`)
- `clone-all-stories.js` — older/alternate approach to cloning stories; kept for reference

## The “three space” model (why there’s an ASSET ORIGIN)

You will usually have:

1. **SOURCE**: where stories (content) are read from
2. **TARGET**: where stories/assets are written to
3. **ASSET ORIGIN**: where assets (and asset folders) are read from

`ASSET ORIGIN` exists because the space you want to clone content from isn’t always the space that contains the “canonical” demo assets you want to reuse.

If you don’t set `ASSET_ORIGIN_*`, the scripts default asset origin to SOURCE.

## Safety guarantees (and non-guarantees)

What it **does**:

- Creates missing folders/pages in TARGET
- Updates existing TARGET stories when a matching `full_slug` already exists
- Copies components from SOURCE to TARGET when missing
- Copies asset folders/assets to TARGET and rewrites references in TARGET stories

What it **does not** do:

- It does **not** delete stories or assets in the target
- It does **not** attempt to reconcile “what changed” (it may update/publish broadly)

Important detail: `PUBLISH_MODE` currently behaves like a boolean switch:

- `none` => do not publish
- anything else => publish on create/update

## Prerequisites

- Node.js `>= 20` (repo enforces this in `package.json`)
- Dependencies installed (`pnpm install` at repo root)
- These scripts may require you to temporarily install dependencies that are not kept in the repo:
  - `pnpm i axios`
  - `pnpm i form-data`
- Storyblok **Management API** tokens with access to the relevant spaces
- You know the correct region for each space: `eu | us | ca | ap | cn`

## Configuration (.env)

Copy the example env file and add values to your repo-root `.env` (the scripts use `dotenv` and read from the current working directory):

1. Start from: `.dev/storyblok/danger-zone/.env.example`
2. Copy the variables into: `.env` at the repo root

### Required env vars

Content source (read from):

- `SOURCE_SPACE_ID`
- `SOURCE_REGION`
- `SOURCE_TOKEN`

Target (write to):

- `TARGET_SPACE_ID`
- `TARGET_REGION`
- `TARGET_TOKEN`

### Behavior env vars

- `DRY_RUN` (`true`/`false`) — when `true`, logs intended actions without writing
- `PUBLISH_MODE` (`none` | `published-with-changes` | `all`) — see note above
- `PER_PAGE` (number, optional) — page size for story listing in `clone-space.js` (defaults to `100`)

### Asset copy env vars

- `ASSET_ORIGIN_SPACE_ID` (optional; defaults to `SOURCE_SPACE_ID`)
- `ASSET_ORIGIN_REGION` (optional; defaults to `SOURCE_REGION`)
- `ASSET_ORIGIN_TOKEN` (optional; defaults to `SOURCE_TOKEN`)

- `ASSET_PER_PAGE` (number; defaults to `100`)
- `ASSET_DOWNLOAD_DIR` (path; defaults to `./.tmp/assets`)
- `ASSET_CONCURRENCY` (number; defaults to `4`)
- `ASSET_VALIDATE_UPLOAD` (`true`/`false`; defaults to `true`) — if `true`, calls `finish_upload`

## Recommended workflow

1. **Create/choose the TARGET space**
   - Ideally a fresh space to avoid accidental overwrites.
2. **Confirm regions**
   - Regions must match the space’s region in Storyblok (EU vs US vs etc).
3. **Set `DRY_RUN=true` and run once**
   - Inspect the log output carefully.
4. **Run the real clone**
   - Set `DRY_RUN=false`.
5. **Validate in Storyblok**
   - Spot-check key routes, relations, and assets.

## Running the scripts

1. Rename scripts back to runnable names (remove the `.disabled` suffix).
2. Ensure the one-off dependencies are installed:

```bash
pnpm i axios
pnpm i form-data
```

Run from the repo root (so `.env` is discovered):

```bash
node ./.dev/storyblok/danger-zone/clone-space.js
```

### What to expect

`clone-space.js` runs in passes:

1. Component preflight (create missing components in TARGET, fix `is_root`)
2. Folder pass (create/update folders first, shallow → deep)
3. Page pass (create/update pages)
4. Asset copy (copy folders/assets from ASSET ORIGIN to TARGET, then rewrite asset refs)
5. UUID rewrite pass (rewrite story UUID references in TARGET content)

## Troubleshooting notes

- If you see errors about root components / invalid root component:
  - The script tries to mark required root components as `is_root=true` in TARGET, but if components are missing entirely, verify that the component schemas exist in TARGET.
- If you hit rate limits (429):
  - The scripts retry with exponential backoff.
  - Reduce `ASSET_CONCURRENCY` if uploads are failing.
- If assets download but do not appear in TARGET:
  - Ensure `ASSET_VALIDATE_UPLOAD=true` and that the token has permission to upload assets.

## “I really don’t want to accidentally run this”

Suggestions:

- Keep `DRY_RUN=true` as the default in your local `.env`
- Use a clearly-named TARGET space like `DELETE-ME-CLONE-TEST`
- Never reuse production tokens/spaces unless you intend to overwrite
