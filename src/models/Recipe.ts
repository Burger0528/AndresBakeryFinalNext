import mongoose, { Document, Model, Schema } from 'mongoose';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface IRecipe extends Document {
  // List-level fields (needed for recipe cards)
  name: string;
  image: string;           // Cloudinary URL
  prepTimeMinutes: number;
  difficulty: Difficulty;
  // Detail-level fields (only needed on the recipe detail page)
  description: string;
  servings: number;
  ingredients: string[];
  steps: string[];         // ordered instruction steps
  createdAt: Date;
  updatedAt: Date;
}

const RecipeSchema = new Schema<IRecipe>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    prepTimeMinutes: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'] satisfies Difficulty[],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    servings: {
      type: Number,
      required: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    steps: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

// Hot-reload guard (see User.ts for why this pattern is necessary)
const Recipe: Model<IRecipe> =
  mongoose.models.Recipe ?? mongoose.model<IRecipe>('Recipe', RecipeSchema);

export default Recipe;
