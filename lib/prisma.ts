// Prisma Client Singleton Pattern for Next.js
// 
// IMPORTANT: Run `npx prisma generate` before using this file
// This will generate the Prisma Client and its types
//
// The Prisma Client is stored globally in development to prevent
// multiple instances during hot reloading

import { PrismaClient } from '@prisma/client'

// Support both DATABASE_URL and POSTGRES_URL (Vercel provides POSTGRES_URL)
// Prisma expects DATABASE_URL, so we map POSTGRES_URL to DATABASE_URL if needed
if (!process.env.DATABASE_URL && process.env.POSTGRES_URL) {
  process.env.DATABASE_URL = process.env.POSTGRES_URL
}

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a singleton instance of Prisma Client
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

// In development, store the instance globally to prevent multiple instances
// This prevents creating a new Prisma Client on every hot reload
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Export the Prisma client instance
export default prisma
