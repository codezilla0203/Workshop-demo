// Script to create an admin user
// Run with: npx tsx scripts/seed-admin.ts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const name = process.env.ADMIN_NAME || 'Admin User'

  const hashedPassword = await bcrypt.hash(password, 10)

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      password: hashedPassword
    },
    create: {
      email,
      password: hashedPassword,
      name,
      role: 'ADMIN'
    }
  })

  console.log('Admin user created/updated:', {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

