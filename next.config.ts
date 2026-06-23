import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Allow next/image to optimize images served from Cloudinary.
        // Without this, next/image throws a configuration error for any
        // external hostname not explicitly whitelisted here.
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
