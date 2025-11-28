'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/LoginForm'
import SignupForm from '@/components/SignupForm'
import { apiGet } from '@/lib/api-client'
import { AuthUser } from '@/types/user'

export default function Home() {
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    let mounted = true
    
    // Helper to check if token exists in cookies (client-side only)
    const hasToken = () => {
      if (typeof document === 'undefined') return false
      return document.cookie.split(';').some(c => c.trim().startsWith('token='))
    }
    
    // Only make request if token exists to avoid unnecessary 401 errors
    if (!hasToken()) {
      return
    }
    
    // Use apiGet helper which handles errors gracefully
    apiGet<{ user: AuthUser }>('/api/auth/me')
      .then(response => {
        if (!mounted) return
        
        // If successful and user exists, redirect
        if (response.success && response.data?.user) {
          if (response.data.user.role === 'ADMIN') {
            router.push('/admin')
          } else {
            router.push('/dashboard')
          }
        }
        // If not successful (401, etc.), user is not logged in - this is expected
      })
      .catch(() => {
        // Silently handle - user is not logged in or network error
        // This is expected behavior, no need to log
      })
    
    return () => {
      mounted = false
    }
  }, [router])

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '40px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '8px',
          textAlign: 'center',
          color: '#333'
        }}>
          AI-Augmented Dev Demo
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '32px',
          fontSize: '14px'
        }}>
          Sign in or create an account to continue
        </p>

        {isLogin ? <LoginForm /> : <SignupForm />}

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#666'
        }}>
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => setIsLogin(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '14px'
                }}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setIsLogin(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '14px'
                }}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

