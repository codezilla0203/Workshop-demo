import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/middleware'
import { prisma } from '@/lib/prisma'
import { createUserSchema } from '@/lib/validation'
import { successResponse, errorResponse, handleApiError, ApiError } from '@/lib/api-response'
import { HTTP_STATUS, ERROR_MESSAGES } from '@/lib/constants'
import { hashPassword } from '@/lib/auth'
import { withDatabaseCheck } from '@/lib/db-utils'

// GET /api/users - List all users (Admin only)
export const GET = requireAdmin(async (req: NextRequest) => {
  try {
    const users = await withDatabaseCheck(
      () => prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      'Unable to fetch users. Please ensure the database is initialized.'
    )

    return successResponse({ users })
  } catch (error) {
    return handleApiError(error)
  }
})

// POST /api/users - Create user (Admin only)
export const POST = requireAdmin(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const validatedData = createUserSchema.parse(body)

    const hashedPassword = await hashPassword(validatedData.password)

    const user = await withDatabaseCheck(
      () => prisma.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          name: validatedData.name,
          role: validatedData.role
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        }
      }),
      'Unable to create user. Please ensure the database is initialized.'
    )

    return successResponse({ user }, HTTP_STATUS.CREATED)
  } catch (error: unknown) {
    // Check for Prisma unique constraint violation
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      return errorResponse(
        new ApiError(HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.EMAIL_EXISTS)
      )
    }

    return handleApiError(error)
  }
})
