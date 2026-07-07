// packages/db — warstwa dostępu do danych (Prisma).
//
// Eksportuje jeden współdzielony klient Prisma (singleton) oraz wszystkie typy
// wygenerowane ze schematu (Danie, Zamowienie, StatusZamowienia, ...), żeby reszta
// monorepo (apps/api, packages/core) korzystała z jednego źródła typów.

import { PrismaClient } from '@prisma/client'

// Singleton: jeden PrismaClient na proces. W dev (hot-reload) zapobiega tworzeniu
// wielu połączeń do bazy.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Re-eksport typów i enumów wygenerowanych przez Prisma.
export * from '@prisma/client'
