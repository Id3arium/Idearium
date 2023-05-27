/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
    };
  },
  experimental: {
    appDir: true,
  },
};