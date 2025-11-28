import { NextRequest } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import { HTTP_STATUS, ERROR_MESSAGES } from '@/lib/constants'

export async function GET(request: NextRequest) {
  const token =
    request.headers.get('authorization')?.replace('Bearer ', '') ||
    request.cookies.get('token')?.value

  if (!token) {
    return errorResponse(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED)
  }

  const user = await getUserFromToken(token)

  if (!user) {
    return errorResponse(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
  }

  return successResponse({ user })
}
