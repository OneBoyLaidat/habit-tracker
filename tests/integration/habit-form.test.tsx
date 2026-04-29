import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getHabits, saveHabits, saveSession } from '@/lib/storage'
import { Habit } from '@/types/habit'
import HabitForm from '@/components/habits/HabitForm'
import HabitCard from '@/components/habits/HabitCard'

const TODAY = new Date().toISOString().split('T')[0]
const YESTERDAY = (() => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
})()

const baseHabit: Habit = {
  id: 'habit-test-1',
  userId: 'user-1',
  name: 'Drink Water',
  description: '',
  frequency: 'daily',
  createdAt: new Date().toISOString(),
  completions: [],
}

beforeEach(() => {
  localStorage.clear()
  saveSession({ userId: 'user-1', email: 'test@example.com' })
})

describe('habit form', () => {
  it('shows a validation error when habit name is empty', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />)

    await user.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Habit name is required')
    })
    expect(onSave).not.toHaveBeenCalled()
  })

  it('creates a new habit and renders it in the list', async () => {
    const user = userEvent.setup()

    const onSave = vi.fn((data: { name: string; description: string; frequency: 'daily' }) => {
      const habit: Habit = {
        id: 'new-habit-id',
        userId: 'user-1',
        name: data.name,
        description: data.description,
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: [],
      }
      saveHabits([...getHabits(), habit])
    })

    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />)

    await user.type(screen.getByTestId('habit-name-input'), 'Drink Water')
    await user.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => expect(onSave).toHaveBeenCalled())

    const habits = getHabits()
    expect(habits).toHaveLength(1)
    expect(habits[0].name).toBe('Drink Water')

    render(
      <HabitCard
        habit={habits[0]}
        today={TODAY}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
      />
    )
    expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument()
  })

  it('edits an existing habit and preserves immutable fields', async () => {
    const original: Habit = {
      id: 'original-id',
      userId: 'user-1',
      name: 'Read Books',
      description: 'Original description',
      frequency: 'daily',
      createdAt: '2024-01-01T00:00:00.000Z',
      completions: [TODAY],
    }
    saveHabits([original])

    const user = userEvent.setup()

    const onSave = vi.fn((data: { name: string; description: string; frequency: 'daily' }) => {
      const updated: Habit = { ...original, name: data.name, description: data.description, frequency: data.frequency }
      saveHabits([updated])
    })

    render(<HabitForm initial={original} onSave={onSave} onCancel={vi.fn()} />)

    const nameInput = screen.getByTestId('habit-name-input')
    await user.clear(nameInput)
    await user.type(nameInput, 'Read Daily')
    await user.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => expect(onSave).toHaveBeenCalled())

    const habits = getHabits()
    expect(habits[0].id).toBe('original-id')
    expect(habits[0].userId).toBe('user-1')
    expect(habits[0].createdAt).toBe('2024-01-01T00:00:00.000Z')
    expect(habits[0].completions).toEqual([TODAY])
    expect(habits[0].name).toBe('Read Daily')
  })

  it('deletes a habit only after explicit confirmation', async () => {
    const habit: Habit = { ...baseHabit, id: 'del-id', name: 'Exercise' }
    saveHabits([habit])

    const user = userEvent.setup()
    const onDelete = vi.fn((id: string) => {
      saveHabits(getHabits().filter(h => h.id !== id))
    })

    render(
      <HabitCard
        habit={habit}
        today={TODAY}
        onEdit={vi.fn()}
        onDelete={onDelete}
        onUpdate={vi.fn()}
      />
    )

    await user.click(screen.getByTestId('habit-delete-exercise'))
    expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument()
    expect(onDelete).not.toHaveBeenCalled()

    await user.click(screen.getByTestId('confirm-delete-button'))

    await waitFor(() => expect(onDelete).toHaveBeenCalledWith('del-id'))
    expect(getHabits()).toHaveLength(0)
  })

  it('toggles completion and updates the streak display', async () => {
    const habit: Habit = {
      ...baseHabit,
      id: 'streak-id',
      name: 'Meditate',
      completions: [YESTERDAY],
    }
    saveHabits([habit])

    const user = userEvent.setup()
    const onUpdate = vi.fn()

    const { rerender } = render(
      <HabitCard
        habit={habit}
        today={TODAY}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onUpdate={onUpdate}
      />
    )

    expect(screen.getByTestId('habit-streak-meditate')).toHaveTextContent('0 days streak')

    await user.click(screen.getByTestId('habit-complete-meditate'))
    await waitFor(() => expect(onUpdate).toHaveBeenCalled())

    const afterComplete: Habit = onUpdate.mock.calls[0][0]
    rerender(
      <HabitCard
        habit={afterComplete}
        today={TODAY}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onUpdate={onUpdate}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-meditate')).toHaveTextContent('2 days streak')
    })

    await user.click(screen.getByTestId('habit-complete-meditate'))
    await waitFor(() => expect(onUpdate).toHaveBeenCalledTimes(2))

    const afterUncomplete: Habit = onUpdate.mock.calls[1][0]
    rerender(
      <HabitCard
        habit={afterUncomplete}
        today={TODAY}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onUpdate={onUpdate}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-meditate')).toHaveTextContent('0 days streak')
    })
  })
})
