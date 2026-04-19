/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Required for Prisma to work correctly in Next.js 15+ / App Router
  serverExternalPackages: ['@prisma/client', 'prisma'],

  // Path alias for @/ imports
  experimental: {},

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
    ],
  },

  turbopack: {},
};

module.exports = nextConfig;
