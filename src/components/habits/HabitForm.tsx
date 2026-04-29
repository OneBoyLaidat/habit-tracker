'use client'

import { useState } from 'react'
import { Habit } from '@/types/habit'
import { validateHabitName } from '@/lib/validators'

type Props = {
  initial?: Habit
  onSave: (data: { name: string; description: string; frequency: 'daily' }) => void
  onCancel: () => void
}

export default function HabitForm({ initial, onSave, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [nameError, setNameError] = useState<string | null>(null)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const result = validateHabitName(name)
    if (!result.valid) {
      setNameError(result.error)
      return
    }
    setNameError(null)
    onSave({ name: result.value, description: description.trim(), frequency: 'daily' })
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid var(--border)',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    color: 'var(--ink)',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
  }

  const labelStyle = {
    display: 'block' as const,
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--ink)',
    marginBottom: 6,
    letterSpacing: '0.02em',
    textTransform: 'uppercase' as const,
  }

  return (
    <form data-testid="habit-form" onSubmit={handleSave}>
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="habit-name" style={labelStyle}>
          Habit Name
        </label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          type="text"
          value={name}
          onChange={e => { setName(e.target.value); setNameError(null) }}
          placeholder="e.g. Drink Water"
          style={{
            ...inputStyle,
            borderColor: nameError ? '#DC2626' : 'var(--border)',
          }}
        />
        {nameError && (
          <p role="alert" style={{ color: '#DC2626', fontSize: 13, marginTop: 4 }}>
            {nameError}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="habit-description" style={labelStyle}>
          Description <span style={{ textTransform: 'none', fontWeight: 400, color: 'var(--muted)' }}>(optional)</span>
        </label>
        <input
          id="habit-description"
          data-testid="habit-description-input"
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Why does this habit matter?"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 28 }}>
        <label htmlFor="habit-frequency" style={labelStyle}>
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          defaultValue="daily"
          style={{
            ...inputStyle,
            cursor: 'pointer',
            appearance: 'none',
          }}
        >
          <option value="daily">Daily</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '11px 16px',
            backgroundColor: 'transparent',
            border: '1.5px solid var(--border)',
            borderRadius: 8,
            fontSize: 15,
            color: 'var(--muted)',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Cancel
        </button>
        <button
          data-testid="habit-save-button"
          type="submit"
          style={{
            flex: 2,
            padding: '11px 16px',
            backgroundColor: 'var(--terracotta)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {initial ? 'Save Changes' : 'Create Habit'}
        </button>
      </div>
    </form>
  )
}
