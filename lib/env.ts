// Environment variable validation
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  DATABASE_URL: z.string().optional(),
})

type Env = z.infer<typeof envSchema>

function getEnv(): Env {
  try {
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV || 'development',
      JWT_SECRET: process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' 
        ? undefined 
        : 'development-secret-key-min-32-chars-required'),
      DATABASE_URL: process.env.DATABASE_URL,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      throw new Error(`Invalid environment variables: ${missingVars}`)
    }
    throw error
  }
}

export const env = getEnv()

