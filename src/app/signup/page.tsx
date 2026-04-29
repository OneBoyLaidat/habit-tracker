import Link from 'next/link'
import SignupForm from '@/components/auth/SignupForm'

export default function SignupPage() {
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
            Start your journey
          </h1>
          <p style={{ color: 'var(--muted)', marginTop: 8, fontSize: 15 }}>
            Create an account to track your habits
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
          <SignupForm />
        </div>

        <p
          style={{
            textAlign: 'center',
            marginTop: 24,
            color: 'var(--muted)',
            fontSize: 14,
          }}
        >
          Already have an account?{' '}
          <Link
            href="/login"
            style={{
              color: 'var(--terracotta)',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
