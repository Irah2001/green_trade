/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use Turbopack configuration (migrated from deprecated experimental.turbo)
  turbopack: {
    // root should point to the workspace root to avoid lockfile inference warnings
    root: '../../'
  }
};

module.exports = nextConfig;