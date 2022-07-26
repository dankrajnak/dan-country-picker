/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // temp
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
