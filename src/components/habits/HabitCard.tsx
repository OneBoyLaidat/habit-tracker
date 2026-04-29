'use client'

import { useState } from 'react'
import { Habit } from '@/types/habit'
import { getHabitSlug } from '@/lib/slug'
import { calculateCurrentStreak } from '@/lib/streaks'
import { toggleHabitCompletion } from '@/lib/habits'
import { getHabits, saveHabits } from '@/lib/storage'

type Props = {
  habit: Habit
  today: string
  onEdit: (habit: Habit) => void
  onDelete: (id: string) => void
  onUpdate: (habit: Habit) => void
}

export default function HabitCard({ habit, today, onEdit, onDelete, onUpdate }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const slug = getHabitSlug(habit.name)
  const streak = calculateCurrentStreak(habit.completions, today)
  const isCompleted = habit.completions.includes(today)

  function handleToggle() {
    const updated = toggleHabitCompletion(habit, today)
    const all = getHabits()
    const next = all.map(h => h.id === updated.id ? updated : h)
    saveHabits(next)
    onUpdate(updated)
  }

  function handleDelete() {
    setConfirmDelete(true)
  }

  function handleConfirmDelete() {
    const all = getHabits()
    saveHabits(all.filter(h => h.id !== habit.id))
    onDelete(habit.id)
  }

  return (
    <article
      data-testid={`habit-card-${slug}`}
      style={{
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: '20px 20px',
        border: '1px solid var(--border)',
        boxShadow: isCompleted
          ? '0 2px 12px rgba(107,143,113,0.15)'
          : '0 2px 12px rgba(26,20,16,0.05)',
        borderLeft: isCompleted ? '4px solid var(--sage)' : '4px solid var(--border)',
        transition: 'all 0.2s',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              margin: 0,
              fontFamily: "'DM Serif Display', serif",
              fontSize: 18,
              color: 'var(--ink)',
              textDecoration: isCompleted ? 'line-through' : 'none',
              opacity: isCompleted ? 0.6 : 1,
            }}
          >
            {habit.name}
          </h3>
          {habit.description && (
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted)', lineHeight: 1.4 }}>
              {habit.description}
            </p>
          )}
          <div
            data-testid={`habit-streak-${slug}`}
            style={{
              marginTop: 10,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              backgroundColor: streak > 0 ? 'rgba(212,168,83,0.15)' : 'var(--surface)',
              borderRadius: 20,
              padding: '3px 10px',
              fontSize: 13,
              fontWeight: 500,
              color: streak > 0 ? 'var(--gold)' : 'var(--muted)',
            }}
          >
            🔥 {streak} day{streak !== 1 ? 's' : ''} streak
          </div>
        </div>

        <button
          data-testid={`habit-complete-${slug}`}
          onClick={handleToggle}
          aria-label={isCompleted ? 'Unmark as complete' : 'Mark as complete'}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: `2px solid ${isCompleted ? 'var(--sage)' : 'var(--border)'}`,
            backgroundColor: isCompleted ? 'var(--sage)' : 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            flexShrink: 0,
            transition: 'all 0.15s',
          }}
        >
          {isCompleted ? '✓' : ''}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
        <button
          data-testid={`habit-edit-${slug}`}
          onClick={() => onEdit(habit)}
          style={{
            padding: '6px 14px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            fontSize: 13,
            color: 'var(--ink)',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Edit
        </button>
        <button
          data-testid={`habit-delete-${slug}`}
          onClick={handleDelete}
          style={{
            padding: '6px 14px',
            backgroundColor: 'transparent',
            border: '1px solid #FCA5A5',
            borderRadius: 6,
            fontSize: 13,
            color: '#DC2626',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Delete
        </button>
      </div>

      {confirmDelete && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(250,247,242,0.97)',
            borderRadius: 14,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            gap: 16,
          }}
        >
          <p style={{ margin: 0, fontWeight: 500, textAlign: 'center', color: 'var(--ink)' }}>
            Delete &ldquo;{habit.name}&rdquo;?
          </p>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
            This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setConfirmDelete(false)}
              style={{
                padding: '8px 18px',
                backgroundColor: 'transparent',
                border: '1.5px solid var(--border)',
                borderRadius: 8,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Cancel
            </button>
            <button
              data-testid="confirm-delete-button"
              onClick={handleConfirmDelete}
              style={{
                padding: '8px 18px',
                backgroundColor: '#DC2626',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </article>
  )
}
