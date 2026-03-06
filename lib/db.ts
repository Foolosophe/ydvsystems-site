import path from "path"
import { PrismaClient } from "@/lib/generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function createPrismaClient() {
  let url = process.env.DATABASE_URL
  if (!url) {
    // Fallback: chemin absolu vers la DB
    url = `file:${path.resolve(process.cwd(), "data/blog.db")}`
  }
  const adapter = new PrismaBetterSqlite3({ url })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
