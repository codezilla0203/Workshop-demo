import { NextResponse } from 'next/server'
import { HTTP_STATUS, ERROR_MESSAGES } from './constants'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  details?: any
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function successResponse<T>(
  data: T,
  status: number = HTTP_STATUS.OK
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  )
}

export function errorResponse(
  error: string | Error | ApiError,
  status?: number,
  details?: any
): NextResponse<ApiResponse> {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.details,
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details,
      },
      { status: status || HTTP_STATUS.INTERNAL_SERVER_ERROR }
    )
  }

  return NextResponse.json(
    {
      success: false,
      error: error || ERROR_MESSAGES.INTERNAL_ERROR,
      details,
    },
    { status: status || HTTP_STATUS.INTERNAL_SERVER_ERROR }
  )
}

export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('API Error:', error)

  if (error instanceof ApiError) {
    return errorResponse(error)
  }

  if (error instanceof Error) {
    return errorResponse(
      error.message || ERROR_MESSAGES.INTERNAL_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    )
  }

  return errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR)
}

