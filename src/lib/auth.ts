import jwt, { type SignOptions } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export interface SessionPayload {
  userId: string;
}

const SECRET = process.env.JWT_SECRET!;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const COOKIE_NAME = 'auth_token';

// httpOnly prevents JS running in the browser from reading this cookie,
// which mitigates XSS token theft — an attacker script cannot exfiltrate it.
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days in seconds — keep in sync with EXPIRES_IN
};

export function signToken(payload: SessionPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN as SignOptions['expiresIn'] });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, SECRET) as SessionPayload;
  } catch {
    // Expired, tampered, or malformed — callers always get null, never a throw.
    return null;
  }
}

// Reads the auth cookie from the current request. Works in both Server
// Components and Route Handlers because next/headers injects the request scope.
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
