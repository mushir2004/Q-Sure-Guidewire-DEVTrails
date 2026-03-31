// next.config.ts
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: false, // Force PWA to be active in dev mode!
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Whitelist your phone's specific IP address
  allowedDevOrigins: ["10.3.99.184", "localhost"],
};

module.exports = withPWA(nextConfig);