import { PrismaClient } from "@prisma/client";
import { databaseUrl } from "@/lib/database-url";

// High-Performance Database Connection Pool - Configured by jaydev
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
const url = databaseUrl(process.env.DATABASE_URL);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(url ? { datasources: { db: { url } } } : {}),
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

globalForPrisma.prisma = prisma;

export default prisma;
