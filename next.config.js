/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  },
  experimental: {
    serverActions: {},
  },
  serverRuntimeConfig: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  },
  publicRuntimeConfig: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  },
  webpack: (config) => {
    config.externals = [...config.externals, 'canvas', 'jsdom'];
    return config;
  },
};

module.exports = nextConfig