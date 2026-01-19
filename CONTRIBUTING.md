# Contributing

Thanks for taking the time to contribute.

## Development setup

- Install dependencies: `pnpm install`
- Create local env file: copy `.env.example` → `.env.local`
- Generate local HTTPS certs once: `pnpm dev-setup`
- Run dev server: `pnpm dev` (<https://localhost:3010>)

## Key commands

- Unit tests: `pnpm test`
- Unit tests (watch): `pnpm test:watch`
- E2E tests: `pnpm cy:open` / `pnpm cy:run`
- Build: `pnpm build`
- Theme token safety check: `pnpm check:sb-tokens`

## Formatting and linting

- Formatting is handled by Prettier on save via workspace settings.
- ESLint is enabled for linting; auto-fix on save is intentionally set to explicit.

## Storyblok resources and types

This repo includes helper scripts under `.dev/storyblok` to keep local Storyblok resources and TypeScript types in sync.

- Log in: `pnpm sb:login` (defaults to EU region; adjust in `package.json` if needed)
- Pull resources + regenerate types: `pnpm sb:pull`
- Pull only schemas: `pnpm sb:pull-components`
- Pull only datasources: `pnpm sb:pull-datasources`
- Pull only typings: `pnpm sb:pull-types`

## Documentation

- Docs index: `docs/README.md`
- Enterprise architecture deep-dive: `docs/README-enterprise.md`

When you move or rename docs, please run a quick relative-link check (the project has been kept intentionally strict about internal doc links).

## Pull requests

- Keep changes focused and avoid drive-by refactors.
- Include screenshots/recordings for UI changes when relevant.
- Add/adjust tests when behavior changes.
- Verify at least:
  - `pnpm test`
  - basic published + preview flow (`/` and `/sb-preview/...`) if your change impacts Storyblok integration.
