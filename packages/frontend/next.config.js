/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    ],
  },
  // Use Turbopack configuration (migrated from deprecated experimental.turbo)
  turbopack: {
    // root should point to the workspace root to avoid lockfile inference warnings
    root: '../../'
  }
};

module.exports = nextConfig;