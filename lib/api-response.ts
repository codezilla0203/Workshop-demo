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

  // Handle Prisma database errors
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase()
    
    // Database connection errors
    if (
      errorMessage.includes('unable to open the database file') ||
      errorMessage.includes('no such file or directory') ||
      errorMessage.includes('database') && errorMessage.includes('not found')
    ) {
      return errorResponse(
        new ApiError(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          'Database not initialized. Please run: npx prisma db push',
          { 
            hint: 'The database file does not exist. Run "npx prisma db push" to create it.',
            code: 'DATABASE_NOT_INITIALIZED'
          }
        )
      )
    }

    // Database locked errors (SQLite)
    if (errorMessage.includes('database is locked')) {
      return errorResponse(
        new ApiError(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          'Database is currently locked. Please try again in a moment.',
          { code: 'DATABASE_LOCKED' }
        )
      )
    }

    // Generic Prisma errors
    if (errorMessage.includes('prisma') || error.name === 'PrismaClientKnownRequestError') {
      return errorResponse(
        new ApiError(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          'Database error occurred. Please check your database connection.',
          { 
            originalError: error.message,
            code: 'DATABASE_ERROR'
          }
        )
      )
    }

    return errorResponse(
      error.message || ERROR_MESSAGES.INTERNAL_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    )
  }

  return errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR)
}

