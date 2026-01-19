import { execSync } from 'node:child_process';

function getStoryblokUserOutput() {
  // Intentionally lightweight:
  // - no token/credential parsing
  // - just ask the Storyblok CLI for current user status
  // - rely on output parsing because the CLI sometimes exits 0 even on failure
  try {
    return execSync('storyblok user --verbose', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    const stdout = typeof error?.stdout === 'string' ? error.stdout : '';
    const stderr = typeof error?.stderr === 'string' ? error.stderr : '';
    return `${stdout}\n${stderr}`;
  }
}

export function ensureStoryblokCliLoggedIn() {
  const output = getStoryblokUserOutput();
  const isLoggedIn = /currently\s+logged\s+in/i.test(output);
  const isNotLoggedIn = /currently\s+not\s+logged\s+in/i.test(output);

  if (!isLoggedIn || isNotLoggedIn) {
    throw new Error(
      [
        'Storyblok CLI is not logged in (cannot verify user session).',
        'Fix:',
        '- Run: pnpm sb:login',
        '- Then rerun: pnpm sb:pull',
      ].join('\n')
    );
  }

  return true;
}
