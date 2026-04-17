/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
    resolveAlias: {
      '@': path.resolve(__dirname),
    },
  },
}

module.exports = nextConfig
