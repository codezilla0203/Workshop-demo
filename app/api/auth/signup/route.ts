import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { signupSchema } from '@/lib/validation'
import { successResponse, errorResponse, handleApiError, ApiError } from '@/lib/api-response'
import { HTTP_STATUS, ERROR_MESSAGES, APP_CONFIG } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGES.EMAIL_EXISTS
      )
    }

    // Create user
    const hashedPassword = await hashPassword(validatedData.password)
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        role: 'USER'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    const response = successResponse(
      {
        user,
        token
      },
      HTTP_STATUS.CREATED
    )

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: APP_CONFIG.COOKIE_MAX_AGE
    })

    return response
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return errorResponse(error)
    }

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
}
