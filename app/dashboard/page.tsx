'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiGet, apiPost } from '@/lib/api-client'
import { AuthUser } from '@/types/user'

export default function Dashboard() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiGet<{ user: AuthUser }>('/api/auth/me')
        
        if (response.success && response.data) {
          setUser(response.data.user)
          if (response.data.user.role === 'ADMIN') {
            router.push('/admin')
            return
          }
        } else {
          router.push('/')
          return
        }
      } catch (err) {
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = async () => {
    try {
      await apiPost('/api/auth/logout', {})
      router.push('/')
    } catch (err) {
      // Even if logout fails, redirect to home
      router.push('/')
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px'
        }}
      >
        Loading...
      </div>
    )
  }

  if (!user) return null

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '40px 20px'
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px'
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#333'
              }}
            >
              Welcome, {user.name}!
            </h1>
            <p style={{ color: '#666', fontSize: '16px' }}>
              {user.email} • {user.role}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#c82333')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#dc3545')}
          >
            Logout
          </button>
        </div>

        <div
          style={{
            background: '#f8f9fa',
            padding: '24px',
            borderRadius: '8px',
            marginTop: '24px'
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '12px',
              color: '#333'
            }}
          >
            User Dashboard
          </h2>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            This is your user dashboard. Regular users can view their profile
            information here. Administrators have access to the admin panel for
            user management.
          </p>
        </div>
      </div>
    </div>
  )
}
