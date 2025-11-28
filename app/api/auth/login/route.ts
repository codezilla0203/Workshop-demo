import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'
import { loginSchema } from '@/lib/validation'
import { successResponse, errorResponse, handleApiError, ApiError } from '@/lib/api-response'
import { HTTP_STATUS, ERROR_MESSAGES, APP_CONFIG } from '@/lib/constants'
import { UserRole } from '@/types/user'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS)
    }

    // Verify password
    const isValid = await verifyPassword(validatedData.password, user.password)
    if (!isValid) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS)
    }

    // Generate token
    const userRole = user.role as UserRole
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: userRole
    })

    const response = successResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: userRole
      },
      token
    })

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: APP_CONFIG.COOKIE_MAX_AGE
    })

    return response
  } catch (error) {
    if (error instanceof ApiError) {
      return errorResponse(error)
    }

    return handleApiError(error)
  }
}
