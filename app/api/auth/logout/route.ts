import { successResponse } from '@/lib/api-response'
import { HTTP_STATUS } from '@/lib/constants'
import { NextResponse } from 'next/server'

export async function POST() {
  const response = successResponse({ message: 'Logged out successfully' })
  response.cookies.delete('token')
  return response
}
