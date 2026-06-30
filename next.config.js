/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['zlib'],
  },
};

module.exports = nextConfig;
