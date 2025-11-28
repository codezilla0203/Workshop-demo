import { z } from 'zod'
import { APP_CONFIG } from './constants'

// Common validation schemas
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .max(APP_CONFIG.EMAIL_MAX_LENGTH, `Email must be at most ${APP_CONFIG.EMAIL_MAX_LENGTH} characters`)

export const passwordSchema = z
  .string()
  .min(APP_CONFIG.PASSWORD_MIN_LENGTH, `Password must be at least ${APP_CONFIG.PASSWORD_MIN_LENGTH} characters`)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

export const nameSchema = z
  .string()
  .min(APP_CONFIG.NAME_MIN_LENGTH, `Name must be at least ${APP_CONFIG.NAME_MIN_LENGTH} characters`)
  .max(APP_CONFIG.NAME_MAX_LENGTH, `Name must be at most ${APP_CONFIG.NAME_MAX_LENGTH} characters`)
  .trim()

export const userRoleSchema = z.enum(['USER', 'ADMIN'])

// Auth schemas
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  role: userRoleSchema.optional().default('USER'),
})

export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  role: userRoleSchema.optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
)

export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>

