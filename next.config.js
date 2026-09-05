/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable strict mode for better development experience
  reactStrictMode: true,

  // Image domains (add more as needed)
  images: {
    remotePatterns: [],
  },

  // Experimental features
  experimental: {
    // Server Actions are stable in Next.js 15
  },
};

module.exports = nextConfig;
