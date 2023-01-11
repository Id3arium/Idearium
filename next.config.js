/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

// module.exports = nextConfig
module.exports = {
  env: {
    IDEARIUM_URI: process.env.IDEARIUM_URI,
    TEST_URI: process.env.TEST_URI,
  }
}
