import { SignJWT, jwtVerify } from 'jose';

function getJwtSecret() {
  if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required in production');
  }
  return new TextEncoder().encode(
    process.env.JWT_SECRET || 'paroquiaperto-secret-key-2024'
  );
}

export async function signJWT(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(getJwtSecret());
}

export async function verifyJWT(token) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request) {
  const authorization = request.headers.get('authorization');
  if (authorization?.startsWith('Bearer ')) {
    return authorization.slice(7);
  }
  const cookie = request.cookies?.get?.('token')?.value;
  return cookie || null;
}
