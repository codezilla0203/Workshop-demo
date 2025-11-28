import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiGet } from '@/lib/api-client'
import { AuthUser } from '@/types/user'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiGet<{ user: AuthUser }>('/api/auth/me')
        
        if (response.success && response.data) {
          setUser(response.data.user)
        } else {
          router.push('/')
        }
      } catch (err) {
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  return { user, loading }
}

