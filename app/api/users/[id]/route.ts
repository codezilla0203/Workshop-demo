import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/middleware'
import { prisma } from '@/lib/prisma'
import { updateUserSchema } from '@/lib/validation'
import { successResponse, errorResponse, handleApiError, ApiError } from '@/lib/api-response'
import { HTTP_STATUS, ERROR_MESSAGES } from '@/lib/constants'

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return errorResponse(
        new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND)
      )
    }

    return successResponse({ user })
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH /api/users/[id] - Update user (Admin only)
async function patchHandler(
  req: NextRequest,
  params: Promise<{ id: string }>
) {
  try {
    const { id } = await params
    const body = await req.json()
    const validatedData = updateUserSchema.parse(body)

    const user = await prisma.user.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true
      }
    })

    return successResponse({ user })
  } catch (error: unknown) {
    // Check for Prisma record not found error
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      return errorResponse(
        new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND)
      )
    }

    return handleApiError(error)
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication first
  const authResult = await requireAdmin(async (req: NextRequest) => {
    return patchHandler(req, params)
  })(req)

  if (authResult.status === 401 || authResult.status === 403) {
    return authResult
  }

  return patchHandler(req, params)
}

// DELETE /api/users/[id] - Delete user (Admin only)
async function deleteHandler(
  req: NextRequest,
  params: Promise<{ id: string }>
) {
  try {
    const { id } = await params
    await prisma.user.delete({
      where: { id }
    })

    return successResponse({ message: 'User deleted successfully' })
  } catch (error: unknown) {
    // Check for Prisma record not found error
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      return errorResponse(
        new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND)
      )
    }

    return handleApiError(error)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication first
  const authResult = await requireAdmin(async (req: NextRequest) => {
    return deleteHandler(req, params)
  })(req)

  if (authResult.status === 401 || authResult.status === 403) {
    return authResult
  }

  return deleteHandler(req, params)
}
