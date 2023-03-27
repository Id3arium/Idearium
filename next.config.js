/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Required:
    appDir: true,
  },
  env: {
    IDEARIUM_URI: process.env.IDEARIUM_URI,
    DATABASE_URL: process.env.DATABASE_URL,
    TEST_URI: process.env.TEST_URI,
  },
  compiler: {
    styledComponents: true,
  },
}
module.exports = nextConfig