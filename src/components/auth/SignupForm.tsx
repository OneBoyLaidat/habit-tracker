'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUsers, saveUsers, saveSession } from '@/lib/storage'
import { User } from '@/types/auth'

export default function SignupForm() {
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
    const exists = users.find(u => u.email === email)

    if (exists) {
      setError('User already exists')
      setLoading(false)
      return
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      password,
      createdAt: new Date().toISOString(),
    }

    saveUsers([...users, newUser])
    saveSession({ userId: newUser.id, email: newUser.email })
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
          htmlFor="signup-email"
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
          id="signup-email"
          data-testid="auth-signup-email"
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
          htmlFor="signup-password"
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
          id="signup-password"
          data-testid="auth-signup-password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="new-password"
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
        data-testid="auth-signup-submit"
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
          transition: 'opacity 0.15s',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {loading ? 'Creating account…' : 'Create Account'}
      </button>
    </form>
  )
}
