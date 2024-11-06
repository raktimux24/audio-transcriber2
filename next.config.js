/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  },
  experimental: {
    serverActions: true
  }
};

module.exports = nextConfig;