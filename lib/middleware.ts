import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, TokenPayload } from './auth'
import { errorResponse } from './api-response'
import { HTTP_STATUS, ERROR_MESSAGES } from './constants'
import { AuthUser } from '@/types/user'

export interface AuthenticatedRequest extends NextRequest {
  user: TokenPayload
}

export interface AuthenticatedUserRequest extends NextRequest {
  user: AuthUser
}

export async function authenticateRequest(request: NextRequest): Promise<{
  user: TokenPayload | null
  error: string | null
}> {
  const token =
    request.headers.get('authorization')?.replace('Bearer ', '') ||
    request.cookies.get('token')?.value

  if (!token) {
    return { user: null, error: ERROR_MESSAGES.UNAUTHORIZED }
  }

  const payload = verifyToken(token)
  if (!payload) {
    return { user: null, error: ERROR_MESSAGES.INVALID_TOKEN }
  }

  return { user: payload, error: null }
}

export function requireAuth(
  handler: (req: NextRequest, user: TokenPayload) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const { user, error } = await authenticateRequest(req)

    if (!user || error) {
      return errorResponse(error || ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED)
    }

    return handler(req, user)
  }
}

export function requireAdmin(
  handler: (req: NextRequest, user: TokenPayload) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const { user, error } = await authenticateRequest(req)

    if (!user || error) {
      return errorResponse(error || ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED)
    }

    if (user.role !== 'ADMIN') {
      return errorResponse(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN)
    }

    return handler(req, user)
  }
}

