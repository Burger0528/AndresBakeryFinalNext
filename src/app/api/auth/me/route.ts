import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { getUserById } from '@/services/user.service';

// Returns { user } on success or { user: null } when not authenticated.
// This is intentionally not an error response — the client polls this endpoint
// on mount to hydrate auth state; 200 with null is cleaner than catching 401.
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  await connectDB();
  const user = await getUserById(session.userId);
  return NextResponse.json({ user: user ?? null });
}
