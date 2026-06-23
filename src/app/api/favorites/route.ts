import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { getFavoritesByUser, addFavorite, removeFavorite } from '@/services/favorite.service';

// Server-side auth gate. The client UI also hides favorite actions for guests,
// but the server is the real enforcement point — a missing or invalid session
// cookie means no access, regardless of what the client sends.
async function authenticate() {
  return getSession();
}

export async function GET() {
  const session = await authenticate();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const recipes = await getFavoritesByUser(session.userId);
  return NextResponse.json({ recipes });
}

export async function POST(req: NextRequest) {
  const session = await authenticate();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { recipeId } = body as { recipeId?: string };
  if (!recipeId) return NextResponse.json({ error: 'recipeId is required' }, { status: 400 });

  try {
    await connectDB();
    await addFavorite(session.userId, recipeId);
    return NextResponse.json({ favorited: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// recipeId is sent in the JSON body (same pattern as POST) so the request
// stays consistent — query params on DELETE are technically valid but unusual.
export async function DELETE(req: NextRequest) {
  const session = await authenticate();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { recipeId } = body as { recipeId?: string };
  if (!recipeId) return NextResponse.json({ error: 'recipeId is required' }, { status: 400 });

  try {
    await connectDB();
    await removeFavorite(session.userId, recipeId);
    return NextResponse.json({ favorited: false });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
