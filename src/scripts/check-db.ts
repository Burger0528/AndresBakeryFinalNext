// One-off script to verify the Atlas connection and confirm all models register.
// Run with: npm run check-db
// Node's --env-file flag (v20.6+) loads .env.local without any extra packages.
import mongoose from 'mongoose';
import { connectDB } from '../lib/db';

// Import models so they register on the mongoose.models map before we inspect it
import '../models/User';
import '../models/Recipe';
import '../models/Favorite';

async function main() {
  await connectDB();
  console.log('Connected to MongoDB Atlas');

  const modelNames = Object.keys(mongoose.models);
  console.log('Registered models:', modelNames.join(', '));

  await mongoose.connection.close();
  console.log('Connection closed. All good.');
}

main().catch((err) => {
  console.error('check-db failed:', err);
  process.exit(1);
});
