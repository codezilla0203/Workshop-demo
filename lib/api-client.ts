// Client-side API utilities
import { ApiResponse } from './api-response'

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  })

  const data = await response.json()
  return data as ApiResponse<T>
}

export async function apiPost<T>(
  url: string,
  body: unknown
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function apiGet<T>(url: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    method: 'GET',
  })
}

export async function apiPatch<T>(
  url: string,
  body: unknown
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function apiDelete<T>(url: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    method: 'DELETE',
  })
}

