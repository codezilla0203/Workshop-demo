// Environment variable validation
import { z } from 'zod'

const nodeEnv = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test'
const isProduction = nodeEnv === 'production'

// Get JWT_SECRET with proper defaults
function getJwtSecret(): string {
  const jwtSecret = process.env.JWT_SECRET

  // In production, JWT_SECRET is required
  if (isProduction && !jwtSecret) {
    throw new Error(
      'JWT_SECRET environment variable is required in production. ' +
      'Please set it in your deployment platform (Vercel, etc.) with at least 32 characters. ' +
      'You can generate one with: openssl rand -base64 32'
    )
  }

  // In development, use default if not provided
  if (!jwtSecret) {
    return 'development-secret-key-min-32-chars-required-for-local-dev-only'
  }

  // Validate length
  if (jwtSecret.length < 32) {
    throw new Error(
      `JWT_SECRET must be at least 32 characters (current: ${jwtSecret.length}). ` +
      'Generate a secure secret with: openssl rand -base64 32'
    )
  }

  return jwtSecret
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(32),
  DATABASE_URL: z.string().optional(),
})

type Env = z.infer<typeof envSchema>

function getEnv(): Env {
  // Support both DATABASE_URL and POSTGRES_URL (Vercel provides POSTGRES_URL)
  // Use POSTGRES_URL as fallback if DATABASE_URL is not set
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL

  try {
    return envSchema.parse({
      NODE_ENV: nodeEnv,
      JWT_SECRET: getJwtSecret(),
      DATABASE_URL: databaseUrl,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      throw new Error(`Invalid environment variables: ${missingVars}`)
    }
    // Re-throw our custom error messages
    throw error
  }
}

export const env = getEnv()

