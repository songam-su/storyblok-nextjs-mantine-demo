import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    specPattern: 'tests/e2e/specs/**/*.cy.{ts,tsx,js,jsx}',
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3010',
    supportFile: 'tests/e2e/support/e2e.ts',
  },
});
