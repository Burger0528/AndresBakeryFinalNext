// Run with: npm run seed
// Uploads each recipe image to Cloudinary, then upserts the recipe in MongoDB.
// Safe to re-run: Cloudinary uses overwrite + deterministic public_id,
// and MongoDB uses findOneAndUpdate with upsert:true (keyed on recipe name).
import mongoose from 'mongoose';
import { connectDB } from '../lib/db';
import { uploadImage } from '../lib/cloudinary';
import Recipe from '../models/Recipe';
// Register all models so the mongoose.models map is complete before any query
import '../models/User';
import '../models/Favorite';
import { recipesData } from './recipes.data';

async function seed() {
  await connectDB();
  console.log('Connected to MongoDB Atlas\n');

  for (const data of recipesData) {
    const publicId = `dessert-recipes/${data.slug}`;

    process.stdout.write(`Uploading image for "${data.name}"… `);
    const imageUrl = await uploadImage(data.sourceImage, publicId);
    console.log('done');

    const { slug: _slug, sourceImage: _src, ...recipeFields } = data;

    await Recipe.findOneAndUpdate(
      { name: data.name },
      { $set: { ...recipeFields, image: imageUrl } },
      { upsert: true, new: true },
    );

    console.log(`  ✓ Seeded: ${data.name}`);
  }

  console.log('\nAll recipes seeded successfully.');
  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error('\nSeed failed:', err);
  process.exit(1);
});
