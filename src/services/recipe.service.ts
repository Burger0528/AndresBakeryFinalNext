import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Recipe from '@/models/Recipe';
import type { Difficulty } from '@/models/Recipe';

// Plain serializable shapes returned by every service function.
// Server Components pass this data across the server/client boundary, which
// only accepts JSON — raw Mongoose documents (with ObjectId, Date, prototype
// methods) would silently fail or throw. We convert at the service boundary
// so callers never have to think about it.
export type RecipeListItem = {
  id: string;
  name: string;
  image: string;
  prepTimeMinutes: number;
  difficulty: Difficulty;
  createdAt: string;
};

export type RecipeFull = RecipeListItem & {
  description: string;
  servings: number;
  ingredients: string[];
  steps: string[];
  updatedAt: string;
};

/** Returns list-level fields for every recipe, newest first. */
export async function getAllRecipes(): Promise<RecipeListItem[]> {
  await connectDB();

  const recipes = await Recipe.find({})
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

/** Returns the full recipe or null when id is invalid / not found. */
export async function getRecipeById(id: string): Promise<RecipeFull | null> {
  await connectDB();

  // Validate before querying so Mongoose doesn't throw a CastError on bad ids
  if (!mongoose.isValidObjectId(id)) return null;

  const r = await Recipe.findById(id).lean();
  if (!r) return null;

  return {
    id: r._id.toString(),
    name: r.name,
    image: r.image,
    prepTimeMinutes: r.prepTimeMinutes,
    difficulty: r.difficulty as Difficulty,
    description: r.description,
    servings: r.servings,
    ingredients: r.ingredients,
    steps: r.steps,
    createdAt: (r.createdAt as Date).toISOString(),
    updatedAt: (r.updatedAt as Date).toISOString(),
  };
}
