'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api-client'
import { AuthUser, PublicUser } from '@/types/user'

export default function AdminPanel() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [users, setUsers] = useState<PublicUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUser, setEditingUser] = useState<PublicUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiGet<{ user: AuthUser }>('/api/auth/me')
        
        if (!response.success || !response.data) {
          router.push('/')
          return
        }

        if (response.data.user.role !== 'ADMIN') {
          router.push('/dashboard')
          return
        }

        setUser(response.data.user)
        await loadUsers()
      } catch (err) {
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const loadUsers = async () => {
    try {
      const response = await apiGet<{ users: PublicUser[] }>('/api/users')
      if (response.success && response.data) {
        setUsers(response.data.users)
        setError('')
      } else {
        setError(response.error || 'Failed to load users')
      }
    } catch (err) {
      setError('Failed to load users')
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const response = await apiDelete<{ message: string }>(`/api/users/${userId}`)
      if (response.success) {
        await loadUsers()
      } else {
        alert(response.error || 'Failed to delete user')
      }
    } catch (err) {
      alert('Failed to delete user')
    }
  }

  const handleLogout = async () => {
    try {
      await apiPost('/api/auth/logout', {})
      router.push('/')
    } catch (err) {
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
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          [data-admin-container] {
            padding: 20px 12px !important;
          }
          [data-admin-card] {
            padding: 24px 16px !important;
            border-radius: 8px !important;
          }
          [data-admin-header] {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
          [data-admin-title] {
            font-size: 24px !important;
          }
          [data-admin-subtitle] {
            font-size: 14px !important;
          }
          [data-admin-actions] {
            flex-direction: column !important;
            gap: 12px !important;
          }
          [data-admin-actions] button {
            width: 100% !important;
          }
          [data-user-table] {
            display: none !important;
          }
          [data-user-cards] {
            display: block !important;
          }
          [data-form-grid] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) {
          [data-user-cards] {
            display: none !important;
          }
        }
      `}} />
      <div
        data-admin-container
        style={{
          minHeight: '100vh',
          padding: '40px 20px'
        }}
      >
        <div
          data-admin-card
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            background: 'white',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}
        >
          <div
            data-admin-header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px',
              flexWrap: 'wrap'
            }}
          >
            <div>
              <h1
                data-admin-title
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: '#333'
                }}
              >
                Admin Panel
              </h1>
              <p data-admin-subtitle style={{ color: '#666', fontSize: '16px' }}>
                {user.email} • Administrator
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
                transition: 'background 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#c82333')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#dc3545')}
            >
              Logout
            </button>
          </div>

          {error && (
            <div
              role="alert"
              style={{
                background: '#fee',
                color: '#c33',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '20px',
                fontSize: '14px'
              }}
            >
              {error}
            </div>
          )}

          <div
            data-admin-actions
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#333',
                margin: 0
              }}
            >
              User Management
            </h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              style={{
                padding: '10px 20px',
                background: showCreateForm ? '#6c757d' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (!showCreateForm) {
                  e.currentTarget.style.background = '#5568d3'
                }
              }}
              onMouseLeave={(e) => {
                if (!showCreateForm) {
                  e.currentTarget.style.background = '#667eea'
                }
              }}
            >
              {showCreateForm ? 'Cancel' : '+ Create User'}
            </button>
          </div>

          {showCreateForm && (
            <CreateUserForm
              onSuccess={async () => {
                setShowCreateForm(false)
                await loadUsers()
              }}
              onCancel={() => setShowCreateForm(false)}
            />
          )}

          {editingUser && (
            <EditUserForm
              user={editingUser}
              onSuccess={async () => {
                setEditingUser(null)
                await loadUsers()
              }}
              onCancel={() => setEditingUser(null)}
            />
          )}

          {/* Desktop Table View */}
          <div data-user-table style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '20px'
              }}
            >
              <thead>
                <tr
                  style={{
                    background: '#f8f9fa',
                    borderBottom: '2px solid #dee2e6'
                  }}
                >
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#333',
                      fontSize: '14px'
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#333',
                      fontSize: '14px'
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#333',
                      fontSize: '14px'
                    }}
                  >
                    Role
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#333',
                      fontSize: '14px'
                    }}
                  >
                    Created
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: '#333',
                      fontSize: '14px'
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: '40px',
                        textAlign: 'center',
                        color: '#666'
                      }}
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr
                      key={u.id}
                      style={{
                        borderBottom: '1px solid #dee2e6'
                      }}
                    >
                      <td style={{ padding: '12px', color: '#333' }}>{u.name}</td>
                      <td style={{ padding: '12px', color: '#666' }}>{u.email}</td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            padding: '4px 8px',
                            background: u.role === 'ADMIN' ? '#667eea' : '#6c757d',
                            color: 'white',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '12px',
                          color: '#666',
                          fontSize: '14px'
                        }}
                      >
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button
                          onClick={() => setEditingUser(u)}
                          style={{
                            padding: '6px 12px',
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            marginRight: '8px',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = '#218838')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = '#28a745')
                          }
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          style={{
                            padding: '6px 12px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = '#c82333')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = '#dc3545')
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div data-user-cards style={{ display: 'none' }}>
            {users.length === 0 ? (
              <div
                style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: '#666'
                }}
              >
                No users found
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                {users.map((u) => (
                  <div
                    key={u.id}
                    style={{
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      padding: '16px',
                      border: '1px solid #dee2e6'
                    }}
                  >
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                        {u.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            padding: '4px 8px',
                            background: u.role === 'ADMIN' ? '#667eea' : '#6c757d',
                            color: 'white',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          {u.role}
                        </span>
                        <span style={{ fontSize: '12px', color: '#999' }}>
                          Created: {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setEditingUser(u)}
                        style={{
                          flex: '1',
                          minWidth: '100px',
                          padding: '8px 16px',
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = '#218838')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = '#28a745')
                        }
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        style={{
                          flex: '1',
                          minWidth: '100px',
                          padding: '8px 16px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = '#c82333')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = '#dc3545')
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function CreateUserForm({
  onSuccess,
  onCancel
}: {
  onSuccess: () => void
  onCancel: () => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await apiPost<{ user: PublicUser }>('/api/users', {
        name,
        email,
        password,
        role
      })

      if (response.success && response.data) {
        setName('')
        setEmail('')
        setPassword('')
        setRole('USER')
        onSuccess()
      } else {
        setError(response.error || 'Failed to create user')
        setLoading(false)
      }
    } catch (err) {
      setError('An error occurred')
      setLoading(false)
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          [data-form-grid] {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
      <div
        style={{
          background: '#f8f9fa',
          padding: '24px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}
      >
        <h3
          style={{
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: '600',
            color: '#333'
          }}
        >
          Create New User
        </h3>
        {error && (
          <div
            role="alert"
            style={{
              background: '#fee',
              color: '#c33',
              padding: '8px',
              borderRadius: '4px',
              marginBottom: '12px',
              fontSize: '14px'
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div
            data-form-grid
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              marginBottom: '12px'
            }}
          >
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              disabled={loading}
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                opacity: loading ? 0.6 : 1
              }}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                opacity: loading ? 0.6 : 1
              }}
            />
          </div>
          <div
            data-form-grid
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              marginBottom: '12px'
            }}
          >
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              disabled={loading}
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                opacity: loading ? 0.6 : 1
              }}
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'USER' | 'ADMIN')}
              disabled={loading}
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                opacity: loading ? 0.6 : 1
              }}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '8px 16px',
                background: loading ? '#ccc' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '8px 16px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

function EditUserForm({
  user,
  onSuccess,
  onCancel
}: {
  user: PublicUser
  onSuccess: () => void
  onCancel: () => void
}) {
  const [name, setName] = useState(user.name)
  const [role, setRole] = useState<'USER' | 'ADMIN'>(user.role)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await apiPatch<{ user: PublicUser }>(
        `/api/users/${user.id}`,
        { name, role }
      )

      if (response.success && response.data) {
        onSuccess()
      } else {
        setError(response.error || 'Failed to update user')
        setLoading(false)
      }
    } catch (err) {
      setError('An error occurred')
      setLoading(false)
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          [data-form-grid] {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
      <div
        style={{
          background: '#f8f9fa',
          padding: '24px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}
      >
        <h3
          style={{
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: '600',
            color: '#333'
          }}
        >
          Edit User
        </h3>
        {error && (
          <div
            role="alert"
            style={{
              background: '#fee',
              color: '#c33',
              padding: '8px',
              borderRadius: '4px',
              marginBottom: '12px',
              fontSize: '14px'
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div
            data-form-grid
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              marginBottom: '12px'
            }}
          >
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              disabled={loading}
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                opacity: loading ? 0.6 : 1
              }}
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'USER' | 'ADMIN')}
              disabled={loading}
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                opacity: loading ? 0.6 : 1
              }}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '8px 16px',
                background: loading ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: '8px 16px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
