import { PrismaClient } from '@prisma/client';

// Reuse the same client across hot reloads in development to avoid
// exhausting the DB connection pool.
const globalForPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient({ log: ['error'] });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
