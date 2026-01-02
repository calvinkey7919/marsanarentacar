/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // App Router is enabled by default in Next.js 14+. The `experimental.appDir` option
  // is no longer needed and has been removed to avoid warnings.
  // Opt into dynamic generation for PWA: the service worker will be generated at build time.
  // If you wish to enable PWA caching you can install next-pwa and configure it here.
};

module.exports = nextConfig;
