'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUsers, saveSession } from '@/lib/storage'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const users = getUsers()
    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      setError('Invalid email or password')
      setLoading(false)
      return
    }

    saveSession({ userId: user.id, email: user.email })
    router.replace('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      {error && (
        <div
          role="alert"
          style={{
            backgroundColor: '#FEE2E2',
            color: '#B91C1C',
            padding: '10px 14px',
            borderRadius: 8,
            fontSize: 14,
            marginBottom: 20,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <label
          htmlFor="login-email"
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--ink)',
            marginBottom: 6,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
          }}
        >
          Email
        </label>
        <input
          id="login-email"
          data-testid="auth-login-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
          style={{
            width: '100%',
            padding: '10px 14px',
            border: '1.5px solid var(--border)',
            borderRadius: 8,
            fontSize: 16,
            backgroundColor: '#fff',
            color: 'var(--ink)',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--terracotta)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      <div style={{ marginBottom: 28 }}>
        <label
          htmlFor="login-password"
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--ink)',
            marginBottom: 6,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
          }}
        >
          Password
        </label>
        <input
          id="login-password"
          data-testid="auth-login-password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          style={{
            width: '100%',
            padding: '10px 14px',
            border: '1.5px solid var(--border)',
            borderRadius: 8,
            fontSize: 16,
            backgroundColor: '#fff',
            color: 'var(--ink)',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--terracotta)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      <button
        data-testid="auth-login-submit"
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px 24px',
          backgroundColor: 'var(--terracotta)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 500,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'opacity 0.15s, transform 0.1s',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  )
}
