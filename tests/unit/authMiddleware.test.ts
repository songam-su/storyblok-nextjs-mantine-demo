import crypto from 'crypto';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { verifyAuthToken } from '@/middleware/auth';

const sign = (payload: Record<string, any>, secret: string) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encode = (obj: any) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const raw = `${encode(header)}.${encode(payload)}`;
  const sig = crypto.createHmac('sha256', secret).update(raw).digest('base64url');
  return `${raw}.${sig}`;
};

const signRs256 = (payload: Record<string, any>, privateKey: crypto.KeyObject, kid = 'test-kid') => {
  const header = { alg: 'RS256', typ: 'JWT', kid };
  const encode = (obj: any) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const raw = `${encode(header)}.${encode(payload)}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(raw);
  signer.end();
  const sig = signer.sign(privateKey).toString('base64url');
  return `${raw}.${sig}`;
};

describe('verifyAuthToken', () => {
  const secret = 'test-secret';
  const now = Math.floor(Date.now() / 1000);
  const basePayload = { sub: 'user-1', exp: now + 300 };
  let rsaPrivate: crypto.KeyObject;
  let rsaPublicJwk: any;

  beforeEach(() => {
    // no-op per test isolation
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicExponent: 0x10001,
    });
    rsaPrivate = privateKey;
    rsaPublicJwk = publicKey.export({ format: 'jwk' });
  });

  it('accepts a valid token with matching audience/issuer/role', async () => {
    const token = sign({ ...basePayload, aud: 'app', iss: 'issuer', roles: ['admin'] }, secret);
    const payload = await verifyAuthToken(token, secret, { audience: 'app', issuer: 'issuer', requiredRole: 'admin' });
    expect(payload.sub).toBe('user-1');
  });

  it('rejects invalid signature', async () => {
    const token = sign(basePayload, 'wrong-secret');
    await expect(verifyAuthToken(token, secret)).rejects.toThrow(/Invalid signature/);
  });

  it('rejects expired token', async () => {
    const token = sign({ ...basePayload, exp: now - 10 }, secret);
    await expect(verifyAuthToken(token, secret)).rejects.toThrow(/expired/);
  });

  it('rejects missing required role', async () => {
    const token = sign({ ...basePayload, roles: ['user'] }, secret);
    await expect(verifyAuthToken(token, secret, { requiredRole: 'admin' })).rejects.toThrow(/Insufficient role/);
  });

  it('accepts a valid RS256 token with JWKS', async () => {
    const token = signRs256({ ...basePayload, aud: 'app' }, rsaPrivate, 'kid-1');

    const jwks = { keys: [{ ...rsaPublicJwk, kid: 'kid-1', use: 'sig', alg: 'RS256' }] };
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response(JSON.stringify(jwks), { status: 200 })) as any));

    const payload = await verifyAuthToken(token, 'unused', {
      algorithm: 'RS256',
      jwksUrl: 'https://example.com/.well-known/jwks.json',
      audience: 'app',
    });
    expect(payload.sub).toBe('user-1');
  });

  it('rejects RS256 token with bad signature', async () => {
    const token = signRs256({ ...basePayload }, rsaPrivate, 'kid-1');
    const jwks = { keys: [{ ...rsaPublicJwk, kid: 'kid-1', use: 'sig', alg: 'RS256' }] };
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response(JSON.stringify(jwks), { status: 200 })) as any));

    // mutate token signature
    const tampered = token.slice(0, -2) + 'aa';

    await expect(
      verifyAuthToken(tampered, 'unused', {
        algorithm: 'RS256',
        jwksUrl: 'https://example.com/.well-known/jwks.json',
      })
    ).rejects.toThrow(/Invalid signature/);
  });
});
