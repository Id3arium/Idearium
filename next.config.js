/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  env: {
    IDEARIUM_URI: process.env.IDEARIUM_URI,
    TEST_URI: process.env.TEST_URI,
  },
  compiler: {
    styledComponents: true,
  },
}

module.exports = nextConfig