'use client'

export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--cream)',
        zIndex: 50,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: 'var(--terracotta)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: 28,
          }}
        >
          🌱
        </div>
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 36,
            color: 'var(--ink)',
            margin: 0,
            letterSpacing: '-0.5px',
          }}
        >
          Habit Tracker
        </h1>
        <p
          style={{
            color: 'var(--muted)',
            marginTop: 8,
            fontSize: 14,
            fontWeight: 300,
          }}
        >
          Building better days, one habit at a time
        </p>
        <div
          style={{
            marginTop: 32,
            display: 'flex',
            gap: 6,
            justifyContent: 'center',
          }}
        >
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'var(--terracotta)',
                opacity: 0.3 + i * 0.35,
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
