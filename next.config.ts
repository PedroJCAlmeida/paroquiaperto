import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // ESLint runs separately; skipped here to avoid ESLint v9 / FlatCompat serialization issues during build
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      // Parish images uploaded by admins (common hosting services)
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
    // Allow unoptimized images for URLs that don't match the above patterns
    unoptimized: process.env.NODE_ENV !== 'production',
  },
};

export default nextConfig;
