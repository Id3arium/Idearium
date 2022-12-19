/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

// module.exports = nextConfig
module.exports = {
  env: {
    MONGO_URI: process.env.IDEARIUM_URI
  }
}
