import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

// Safe user shape — never includes the password hash.
// See getUserByEmailWithPassword below for the one exception and why.
export type SafeUser = {
  id: string;
  name: string;
  email: string;
};

type UserWithPassword = SafeUser & { password: string };

/** Creates a new user, hashing the password before storing it.
 *  Throws "Email already registered" if the email is taken. */
export async function createUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}): Promise<SafeUser> {
  await connectDB();

  // Hashing is a data-layer concern: by the time we return, no other layer
  // ever sees the plain-text password again.
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ name, email, password: hashedPassword });

    // Never return the hash — expose only what callers are allowed to see
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  } catch (err: unknown) {
    // MongoDB duplicate-key error: translate to a user-friendly message
    if ((err as { code?: number }).code === 11000) {
      throw new Error('Email already registered');
    }
    throw err;
  }
}

/** Returns the user WITH the password hash — used ONLY in the login flow to
 *  compare the candidate password with the stored bcrypt hash.
 *  Do not call this function anywhere else. */
export async function getUserByEmailWithPassword(
  email: string,
): Promise<UserWithPassword | null> {
  await connectDB();

  const user = await User.findOne({ email: email.toLowerCase().trim() }).lean();
  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    password: user.password,
  };
}

/** Returns the safe user (no password) or null when id is invalid / not found. */
export async function getUserById(id: string): Promise<SafeUser | null> {
  await connectDB();

  if (!mongoose.isValidObjectId(id)) return null;

  const user = await User.findById(id).select('-password').lean();
  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}
