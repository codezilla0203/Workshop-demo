// Database utility functions
import { prisma } from './prisma'

/**
 * Check if database is accessible
 * Returns true if database connection is working
 */
export async function checkDatabaseConnection(): Promise<{
  connected: boolean
  error?: string
}> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { connected: true }
  } catch (error) {
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase()
      
      if (
        errorMessage.includes('unable to open the database file') ||
        errorMessage.includes('no such file or directory')
      ) {
        return {
          connected: false,
          error: 'Database not initialized. Run: npx prisma db push'
        }
      }
      
      if (errorMessage.includes('database is locked')) {
        return {
          connected: false,
          error: 'Database is locked. Please try again.'
        }
      }
      
      return {
        connected: false,
        error: `Database error: ${error.message}`
      }
    }
    
    return {
      connected: false,
      error: 'Unknown database error'
    }
  }
}

/**
 * Wrap Prisma operations with database connection check
 */
export async function withDatabaseCheck<T>(
  operation: () => Promise<T>,
  errorMessage?: string
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase()
      
      // Check for database file errors
      if (
        errorMsg.includes('unable to open the database file') ||
        errorMsg.includes('no such file or directory') ||
        (errorMsg.includes('database') && errorMsg.includes('not found'))
      ) {
        throw new Error(
          errorMessage || 
          'Database not initialized. Please run: npx prisma db push'
        )
      }
    }
    throw error
  }
}

