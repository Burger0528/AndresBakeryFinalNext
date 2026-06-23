import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image from a remote URL to Cloudinary and returns the secure_url.
 *
 * Why deterministic publicId + overwrite:true:
 * Every seed run maps the same slug → the same public_id in Cloudinary.
 * With overwrite:true, re-seeding replaces the existing asset in-place instead
 * of creating numbered copies ("dessert-recipes/slug-1", "-2", ...).
 * This keeps the Cloudinary library clean regardless of how many times the seed runs.
 */
export async function uploadImage(source: string, publicId: string): Promise<string> {
  const result = await cloudinary.uploader.upload(source, {
    public_id: publicId,
    overwrite: true,
    resource_type: 'image',
  });
  return result.secure_url;
}
