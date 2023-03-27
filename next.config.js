/** @type {import('next').NextConfig} */

module.exports = {
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
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/nodes': { page: '/nodes' },
      // Add more pages here if needed
    };
  },
}
