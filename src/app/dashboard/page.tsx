'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, clearSession, getHabitsForUser, getHabits, saveHabits } from '@/lib/storage'
import { Session } from '@/types/auth'
import { Habit } from '@/types/habit'
import HabitCard from '@/components/habits/HabitCard'
import HabitForm from '@/components/habits/HabitForm'

type Mode = 'list' | 'create' | 'edit'

export default function DashboardPage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [habits, setHabits] = useState<Habit[]>([])
  const [mode, setMode] = useState<Mode>('list')
  const [editTarget, setEditTarget] = useState<Habit | null>(null)
  const [today] = useState(() => new Date().toISOString().split('T')[0])

  useEffect(() => {
    const s = getSession()
    if (!s) {
      router.replace('/login')
      return
    }
    setSession(s)
    setHabits(getHabitsForUser(s.userId))
  }, [router])

  function handleLogout() {
    clearSession()
    router.replace('/login')
  }

  function handleCreate(data: { name: string; description: string; frequency: 'daily' }) {
    if (!session) return
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId: session.userId,
      name: data.name,
      description: data.description,
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [],
    }
    const all = getHabits()
    saveHabits([...all, newHabit])
    setHabits(prev => [...prev, newHabit])
    setMode('list')
  }

  function handleEdit(data: { name: string; description: string; frequency: 'daily' }) {
    if (!editTarget) return
    const updated: Habit = {
      ...editTarget,
      name: data.name,
      description: data.description,
      frequency: 'daily',
    }
    const all = getHabits()
    saveHabits(all.map(h => h.id === updated.id ? updated : h))
    setHabits(prev => prev.map(h => h.id === updated.id ? updated : h))
    setEditTarget(null)
    setMode('list')
  }

  const handleUpdate = useCallback((updated: Habit) => {
    setHabits(prev => prev.map(h => h.id === updated.id ? updated : h))
  }, [])

  const handleDelete = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id))
  }, [])

  if (!session) return null

  return (
    <div
      data-testid="dashboard-page"
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--cream)',
        maxWidth: 600,
        margin: '0 auto',
        padding: '0 16px 80px',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 0 16px',
          borderBottom: '1px solid var(--border)',
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 26,
              margin: 0,
              color: 'var(--ink)',
            }}
          >
            My Habits
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--muted)' }}>
            {today}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>
            {session.email.split('@')[0]}
          </span>
          <button
            data-testid="auth-logout-button"
            onClick={handleLogout}
            style={{
              padding: '7px 14px',
              backgroundColor: 'transparent',
              border: '1.5px solid var(--border)',
              borderRadius: 8,
              fontSize: 13,
              color: 'var(--muted)',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Log out
          </button>
        </div>
      </header>

      {/* Create / Edit form */}
      {(mode === 'create' || mode === 'edit') && (
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: 14,
            padding: '24px 20px',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 24px rgba(26,20,16,0.07)',
            marginBottom: 28,
          }}
        >
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 20,
              margin: '0 0 20px',
              color: 'var(--ink)',
            }}
          >
            {mode === 'create' ? 'New Habit' : 'Edit Habit'}
          </h2>
          <HabitForm
            initial={mode === 'edit' ? editTarget ?? undefined : undefined}
            onSave={mode === 'create' ? handleCreate : handleEdit}
            onCancel={() => { setMode('list'); setEditTarget(null) }}
          />
        </div>
      )}

      {/* Add button */}
      {mode === 'list' && (
        <button
          data-testid="create-habit-button"
          onClick={() => setMode('create')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            backgroundColor: 'var(--terracotta)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
            marginBottom: 24,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          + New Habit
        </button>
      )}

      {/* Habit list */}
      {habits.length === 0 ? (
        <div
          data-testid="empty-state"
          style={{
            textAlign: 'center',
            padding: '60px 24px',
            backgroundColor: '#fff',
            borderRadius: 16,
            border: '1px dashed var(--border)',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌱</div>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 22,
              margin: '0 0 8px',
              color: 'var(--ink)',
            }}
          >
            No habits yet
          </h2>
          <p style={{ color: 'var(--muted)', margin: 0, fontSize: 15 }}>
            Create your first habit to start building your streak.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              today={today}
              onEdit={h => { setEditTarget(h); setMode('edit') }}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}
