/** @type {import("next").NextConfig} */
const path = require('node:path')

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/products', destination: '/' },
      { source: '/products/:id', destination: '/' },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Use Turbopack configuration (migrated from deprecated experimental.turbo)
  turbopack: {
    // root should point to the workspace root to avoid lockfile inference warnings
    root: path.join(__dirname, '..', '..'),
  }
};

module.exports = nextConfig;