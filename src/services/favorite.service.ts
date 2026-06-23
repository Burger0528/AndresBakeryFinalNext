import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Favorite from '@/models/Favorite';
import Recipe from '@/models/Recipe';
import type { Difficulty } from '@/models/Recipe';
import type { RecipeListItem } from './recipe.service';

/** Adds a favorite link between a user and a recipe. Idempotent:
 *  if the link already exists (duplicate-key 11000), this is treated as
 *  success so the caller never has to handle "already favorited" errors. */
export async function addFavorite(userId: string, recipeId: string): Promise<void> {
  await connectDB();

  if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(recipeId)) {
    throw new Error('Invalid userId or recipeId');
  }

  try {
    await Favorite.create({ user: userId, recipe: recipeId });
  } catch (err: unknown) {
    // Swallow duplicate-key: the favorite already exists, which is the desired state
    if ((err as { code?: number }).code !== 11000) throw err;
  }
}

/** Removes a favorite link. Idempotent — deleting a non-existent doc is a no-op. */
export async function removeFavorite(userId: string, recipeId: string): Promise<void> {
  await connectDB();

  if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(recipeId)) return;

  await Favorite.deleteOne({ user: userId, recipe: recipeId });
}

/** Returns the list-level recipe fields for every recipe the user has favorited.
 *  Uses a two-step query (favorites → recipe ids → recipes) to avoid the
 *  TypeScript complexity of .populate().lean() and keep the return type explicit. */
export async function getFavoritesByUser(userId: string): Promise<RecipeListItem[]> {
  await connectDB();

  if (!mongoose.isValidObjectId(userId)) return [];

  const favorites = await Favorite.find({ user: userId }).select('recipe').lean();
  if (favorites.length === 0) return [];

  const recipeIds = favorites.map((f) => f.recipe);

  const recipes = await Recipe.find({ _id: { $in: recipeIds } })
    .select('name image prepTimeMinutes difficulty createdAt')
    .sort({ createdAt: -1 })
    .lean();

  return recipes.map((r) => ({
    id: r._id.toString(),
    name: r.name,
    image: r.image,
    prepTimeMinutes: r.prepTimeMinutes,
    difficulty: r.difficulty as Difficulty,
    createdAt: (r.createdAt as Date).toISOString(),
  }));
}

/** Returns true if the given user has favorited the given recipe.
 *  Used to render the filled/empty bookmark icon on recipe cards. */
export async function isFavorited(userId: string, recipeId: string): Promise<boolean> {
  await connectDB();

  if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(recipeId)) return false;

  const exists = await Favorite.exists({ user: userId, recipe: recipeId });
  return exists !== null;
}
