import { SignJWT, jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';
import type { JwtPayload } from '@/types';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return new TextEncoder().encode(secret);
}

export async function signJWT(payload: JwtPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(getJwtSecret());
}

export async function verifyJWT(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as JwtPayload;
  } catch (error) {
    console.error('JWT verification failed:', (error as Error).message);
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authorization = request.headers.get('authorization');
  if (authorization?.startsWith('Bearer ')) {
    return authorization.slice(7);
  }
  const cookie = request.cookies?.get?.('token')?.value;
  return cookie ?? null;
}
