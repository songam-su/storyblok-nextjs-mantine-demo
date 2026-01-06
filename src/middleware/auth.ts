import crypto from 'crypto';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type JwtPayload = Record<string, any> & { exp?: number; nbf?: number; aud?: string | string[]; iss?: string };
type JwtHeader = { alg?: string; kid?: string; typ?: string };

const base64UrlDecode = (value: string) => Buffer.from(value.replace(/-/g, '+').replace(/_/g, '/'), 'base64');

type VerifyOptions = { audience?: string; issuer?: string; requiredRole?: string; jwksUrl?: string; algorithm?: 'HS256' | 'RS256' };

type Jwk = { kty: string; n?: string; e?: string; kid?: string; alg?: string; use?: string };

const jwksCache = new Map<string, { key: crypto.KeyObject; expiresAt: number }>();
const JWKS_TTL_MS = 10 * 60 * 1000; // 10 minutes

async function fetchJwkPublicKey(jwksUrl: string, kid?: string): Promise<crypto.KeyObject> {
  const cacheKey = `${jwksUrl}|${kid ?? 'nokid'}`;
  const cached = jwksCache.get(cacheKey);
  const now = Date.now();
  if (cached && cached.expiresAt > now) return cached.key;

  const res = await fetch(jwksUrl, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch JWKS: ${res.status}`);
  const json = (await res.json()) as { keys?: Jwk[] };
  const keys = Array.isArray(json.keys) ? json.keys : [];
  const match = kid ? keys.find((k) => k.kid === kid) : keys[0];
  if (!match || match.kty !== 'RSA' || !match.n || !match.e) {
    throw new Error('No suitable RSA key in JWKS');
  }

  const pub = crypto.createPublicKey({ key: jwkToPem(match), format: 'pem', type: 'spki' });
  jwksCache.set(cacheKey, { key: pub, expiresAt: now + JWKS_TTL_MS });
  return pub;
}

function jwkToPem(jwk: Jwk): string {
  if (!jwk.n || !jwk.e) throw new Error('Invalid JWK');
  const modulus = Buffer.from(jwk.n, 'base64');
  const exponent = Buffer.from(jwk.e, 'base64');

  const makeLength = (buf: Buffer) => {
    if (buf[0] & 0x80) return Buffer.concat([Buffer.from([0x00]), buf]);
    return buf;
  };

  const mod = makeLength(modulus);
  const exp = makeLength(exponent);

  const der = encodeSequence([
    encodeSequence([
      encodeOid('1.2.840.113549.1.1.1'),
      Buffer.from([0x05, 0x00]),
    ]),
    encodeBitString(encodeSequence([encodeInteger(mod), encodeInteger(exp)])),
  ]);

  return `-----BEGIN PUBLIC KEY-----\n${der.toString('base64').match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`;
}

const encodeLength = (len: number) => {
  if (len < 0x80) return Buffer.from([len]);
  const hex = len.toString(16);
  const bytes = Buffer.from(hex.length % 2 ? '0' + hex : hex, 'hex');
  return Buffer.concat([Buffer.from([0x80 + bytes.length]), bytes]);
};

const encodeInteger = (buf: Buffer) => Buffer.concat([Buffer.from([0x02]), encodeLength(buf.length), buf]);
const encodeSequence = (parts: Buffer[]) => {
  const body = Buffer.concat(parts);
  return Buffer.concat([Buffer.from([0x30]), encodeLength(body.length), body]);
};
const encodeBitString = (buf: Buffer) => Buffer.concat([Buffer.from([0x03]), encodeLength(buf.length + 1), Buffer.from([0x00]), buf]);

const encodeOid = (oid: string) => {
  const parts = oid.split('.').map((v) => parseInt(v, 10));
  const first = 40 * parts[0] + parts[1];
  const rest = parts.slice(2).map(encodeBase128);
  const body = Buffer.concat([Buffer.from([first]), ...rest]);
  return Buffer.concat([Buffer.from([0x06]), encodeLength(body.length), body]);
};

const encodeBase128 = (num: number) => {
  const bytes = [] as number[];
  let n = num;
  do {
    bytes.unshift(n & 0x7f);
    n >>= 7;
  } while (n > 0);
  for (let i = 0; i < bytes.length - 1; i++) bytes[i] |= 0x80;
  return Buffer.from(bytes);
};

export async function verifyAuthToken(token: string, secretOrJwks: string, options?: VerifyOptions) {
  const [rawHeader, rawPayload, rawSignature] = token.split('.');
  if (!rawHeader || !rawPayload || !rawSignature) throw new Error('Malformed token');

  const header = JSON.parse(base64UrlDecode(rawHeader).toString('utf-8')) as JwtHeader;
  const alg = options?.algorithm ?? (header.alg as 'HS256' | 'RS256' | undefined) ?? 'HS256';

  if (alg === 'HS256') {
    const data = `${rawHeader}.${rawPayload}`;
    const expected = crypto.createHmac('sha256', secretOrJwks).update(data).digest();
    const provided = base64UrlDecode(rawSignature);
    if (expected.length !== provided.length || !crypto.timingSafeEqual(expected, provided)) {
      throw new Error('Invalid signature');
    }
  } else if (alg === 'RS256') {
    const jwksUrl = options?.jwksUrl;
    if (!jwksUrl) throw new Error('JWKS URL required for RS256');
    const publicKey = await fetchJwkPublicKey(jwksUrl, header.kid);
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(`${rawHeader}.${rawPayload}`);
    verifier.end();
    const sigOk = verifier.verify(publicKey, base64UrlDecode(rawSignature));
    if (!sigOk) throw new Error('Invalid signature');
  } else {
    throw new Error(`Unsupported alg: ${alg}`);
  }

  const payloadJson = base64UrlDecode(rawPayload).toString('utf-8');
  const payload = JSON.parse(payloadJson) as JwtPayload;

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && now >= payload.exp) throw new Error('Token expired');
  if (payload.nbf && now < payload.nbf) throw new Error('Token not yet valid');

  if (options?.audience) {
    const aud = payload.aud;
    const match = Array.isArray(aud) ? aud.includes(options.audience) : aud === options.audience;
    if (!match) throw new Error('Invalid audience');
  }

  if (options?.issuer) {
    if (payload.iss !== options.issuer) throw new Error('Invalid issuer');
  }

  if (options?.requiredRole) {
    const roles = Array.isArray(payload.roles) ? payload.roles : payload.role ? [payload.role] : [];
    if (!roles.includes(options.requiredRole)) throw new Error('Insufficient role');
  }

  return payload;
}

/**
 * Auth Middleware
 * - Validates auth_token as a signed JWT (HS256) with optional audience/issuer/role checks.
 * - Redirects to /login if missing/invalid.
 */
export function authMiddleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  const secret = process.env.AUTH_JWT_SECRET;
  const audience = process.env.AUTH_JWT_AUDIENCE;
  const issuer = process.env.AUTH_JWT_ISSUER;
  const requiredRole = process.env.AUTH_REQUIRED_ROLE;
  const jwksUrl = process.env.AUTH_JWKS_URL;
  const algorithm = (process.env.AUTH_JWT_ALG as 'HS256' | 'RS256' | undefined) ?? (jwksUrl ? 'RS256' : 'HS256');

  if (!token || (!secret && !jwksUrl)) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    verifyAuthToken(token, secret ?? jwksUrl!, { audience, issuer, requiredRole, jwksUrl, algorithm });
  } catch (error) {
    console.warn('[authMiddleware] deny', (error as Error)?.message);
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
