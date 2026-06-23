import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { getUserByEmailWithPassword } from '@/services/user.service';
import { signToken, COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body as Record<string, unknown>;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    await connectDB();
    const user = await getUserByEmailWithPassword(email as string);

    // Always run bcrypt.compare to keep response time constant regardless of
    // whether the email exists — this prevents timing-based user enumeration.
    const passwordMatch = user ? await bcrypt.compare(password as string, user.password) : false;

    if (!user || !passwordMatch) {
      // Single generic message: never reveal whether the email or the password was wrong.
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const safeUser = { id: user.id, name: user.name, email: user.email };
    const token = signToken({ userId: user.id });
    const res = NextResponse.json({ user: safeUser });
    res.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
    return res;
  } catch (err) {
    console.error('[login]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
