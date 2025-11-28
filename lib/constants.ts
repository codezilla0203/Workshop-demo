// Application constants
export const APP_CONFIG = {
  JWT_EXPIRES_IN: '7d',
  COOKIE_MAX_AGE: 60 * 60 * 24 * 7, // 7 days in seconds
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden - Admin access required',
  INVALID_TOKEN: 'Invalid or expired token',
  USER_NOT_FOUND: 'User not found',
  EMAIL_EXISTS: 'User with this email already exists',
  INVALID_CREDENTIALS: 'Invalid email or password',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_INPUT: 'Invalid input',
  VALIDATION_ERROR: 'Validation failed',
  DATABASE_NOT_INITIALIZED: 'Database not initialized. Please run: npx prisma db push',
  DATABASE_ERROR: 'Database error occurred',
} as const

