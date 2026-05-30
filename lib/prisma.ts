import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prismaInstance: PrismaClient

if (process.env.DATABASE_URL) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10, // Tamanho ideal de pool para VPS de médio porte
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000, // Aumentado para tolerar conexões remotas WAN/Internet
  })
  const adapter = new PrismaPg(pool)
  prismaInstance = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })
} else {
  prismaInstance = new PrismaClient({
    log: ["error"],
  })
}

export const prisma = globalForPrisma.prisma ?? prismaInstance

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
