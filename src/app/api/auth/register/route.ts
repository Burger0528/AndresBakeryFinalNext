import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { createUser } from '@/services/user.service';
import { signToken, COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/mailer';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, password } = body as Record<string, unknown>;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 },
      );
    }
    if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }
    if (typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 },
      );
    }
    if (typeof name !== 'string' || name.trim().length < 1) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await connectDB();
    const user = await createUser({
      name: name.trim(),
      email: email.trim(),
      password,
    });

    // sendWelcomeEmail never throws — failures are logged internally.
    await sendWelcomeEmail(user.email, user.name);

    const token = signToken({ userId: user.id });
    const res = NextResponse.json({ user }, { status: 201 });
    res.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    if (message === 'Email already registered') {
      return NextResponse.json({ error: message }, { status: 409 });
    }
    console.error('[register]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
