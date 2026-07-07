import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pakiety z monorepo (workspace) transpilowane przez Next.
  transpilePackages: ['@isaacdex/core', '@isaacdex/db'],
  // Prisma nie może być bundlowana — musi zostać zewnętrzna (znajduje własny silnik).
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '.prisma/client'],
  },
  // W monorepo bundler nie kopiuje silnika Prismy — ten plugin robi to za nas
  // (fix na „Query Engine not found" na Vercelu).
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }
    return config
  },
}

export default nextConfig
