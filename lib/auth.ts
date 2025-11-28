import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'
import { env } from './env'
import { APP_CONFIG } from './constants'
import { AuthUser } from '@/types/user'

export interface TokenPayload {
  userId: string
  email: string
  role: 'USER' | 'ADMIN'
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: APP_CONFIG.JWT_EXPIRES_IN })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET)
    return decoded as TokenPayload
  } catch {
    return null
  }
}

export async function getUserFromToken(token: string): Promise<AuthUser | null> {
  const payload = verifyToken(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true }
  })

  if (!user) return null

  // Cast role to UserRole type since Prisma returns string
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as AuthUser['role']
  }
}

