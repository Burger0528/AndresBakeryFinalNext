import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IFavorite extends Document {
  user: Types.ObjectId;
  recipe: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipe: {
      type: Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true,
    },
  },
  { timestamps: true }
);

// Compound unique index: one user can favorite a given recipe only once.
// Without this, race conditions (double-click, parallel requests) could
// insert duplicate rows that are hard to deduplicate later.
FavoriteSchema.index({ user: 1, recipe: 1 }, { unique: true });

// Hot-reload guard (see User.ts for why this pattern is necessary)
const Favorite: Model<IFavorite> =
  mongoose.models.Favorite ?? mongoose.model<IFavorite>('Favorite', FavoriteSchema);

export default Favorite;
