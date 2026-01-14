# Testing

Purpose: document the current testing layers, what’s covered, and what’s intentionally scaffolded.

## Unit tests (Vitest)

- Command: `pnpm test` (or `pnpm vitest`)
- Location: `tests/unit/**/*.test.ts`
- Environment: Node

These tests cover shared helpers and critical request handlers (for example webhook verification).

## E2E tests (Cypress)

- Commands:
  - `pnpm cy:open`
  - `pnpm cy:run`
- Config: `tests/e2e/cypress.config.ts`
- Specs: `tests/e2e/specs/**/*.cy.{ts,tsx,js,jsx}`

Notes:

- E2E coverage is currently minimal and includes a sample/spec placeholder.
- If your dev server URL differs, set `CYPRESS_BASE_URL` (default is `http://localhost:3010`).

## Recommended CI baseline

If you’re wiring CI, a reasonable baseline is:

- `pnpm lint`
- `pnpm test`
- `pnpm build`

Optionally:

- `pnpm -s lint:storyblok-slugs` (requires Storyblok credentials; meant for scheduled audits or pre-release checks)
