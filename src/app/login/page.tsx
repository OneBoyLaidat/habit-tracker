import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        backgroundColor: 'var(--cream)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              backgroundColor: 'var(--terracotta)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 22,
            }}
          >
            🌱
          </div>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 32,
              margin: 0,
              color: 'var(--ink)',
            }}
          >
            Welcome back
          </h1>
          <p style={{ color: 'var(--muted)', marginTop: 8, fontSize: 15 }}>
            Sign in to your account
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: '32px 28px',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 24px rgba(26,20,16,0.06)',
          }}
        >
          <LoginForm />
        </div>

        <p
          style={{
            textAlign: 'center',
            marginTop: 24,
            color: 'var(--muted)',
            fontSize: 14,
          }}
        >
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            style={{
              color: 'var(--terracotta)',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
