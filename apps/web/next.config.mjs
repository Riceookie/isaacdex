/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pakiety z monorepo (workspace) transpilowane przez Next.
  transpilePackages: ['@isaacdex/core', '@isaacdex/db'],
  // Prisma nie może być bundlowana — musi zostać zewnętrzna (znajduje własny silnik).
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '.prisma/client'],
  },
}

export default nextConfig
