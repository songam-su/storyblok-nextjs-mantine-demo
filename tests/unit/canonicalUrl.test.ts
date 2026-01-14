import { canonicalizePathname } from '@/lib/site/canonicalPath';
import { describe, expect, it } from 'vitest';

describe('canonicalizePathname', () => {
  it('maps /home to /', () => {
    expect(canonicalizePathname('/home')).toBe('/');
    expect(canonicalizePathname('/home/')).toBe('/');
  });

  it('strips trailing slashes', () => {
    expect(canonicalizePathname('/about/')).toBe('/about');
    expect(canonicalizePathname('/about///')).toBe('/about');
  });

  it('preserves root', () => {
    expect(canonicalizePathname('/')).toBe('/');
    expect(canonicalizePathname('')).toBe('/');
  });

  it('removes query/hash if accidentally provided', () => {
    expect(canonicalizePathname('/home?x=1')).toBe('/');
    expect(canonicalizePathname('/about#team')).toBe('/about');
  });
});
