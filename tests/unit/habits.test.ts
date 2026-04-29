import { describe, it, expect } from 'vitest'
import { toggleHabitCompletion } from '@/lib/habits'
import { Habit } from '@/types/habit'

const baseHabit: Habit = {
  id: 'test-id',
  userId: 'user-1',
  name: 'Drink Water',
  description: '',
  frequency: 'daily',
  createdAt: '2024-01-01T00:00:00.000Z',
  completions: [],
}

describe('toggleHabitCompletion', () => {
  it('adds a completion date when the date is not present', () => {
    const result = toggleHabitCompletion(baseHabit, '2024-06-15')
    expect(result.completions).toContain('2024-06-15')
    expect(result.completions).toHaveLength(1)
  })

  it('removes a completion date when the date already exists', () => {
    const habit = { ...baseHabit, completions: ['2024-06-15'] }
    const result = toggleHabitCompletion(habit, '2024-06-15')
    expect(result.completions).not.toContain('2024-06-15')
    expect(result.completions).toHaveLength(0)
  })

  it('does not mutate the original habit object', () => {
    const habit = { ...baseHabit, completions: ['2024-06-14'] }
    const originalCompletions = [...habit.completions]
    toggleHabitCompletion(habit, '2024-06-15')
    expect(habit.completions).toEqual(originalCompletions)
  })

  it('does not return duplicate completion dates', () => {
    // Adding a date that's already present should not create duplicates
    const habit = { ...baseHabit, completions: ['2024-06-14'] }
    // Add a new date
    const withNew = toggleHabitCompletion(habit, '2024-06-15')
    // Both dates should be present, each exactly once
    const count14 = withNew.completions.filter(d => d === '2024-06-14').length
    const count15 = withNew.completions.filter(d => d === '2024-06-15').length
    expect(count14).toBe(1)
    expect(count15).toBe(1)
    // Toggling again (remove) then re-add should still result in exactly one
    const removed = toggleHabitCompletion(withNew, '2024-06-15')
    const added = toggleHabitCompletion(removed, '2024-06-15')
    const finalCount = added.completions.filter(d => d === '2024-06-15').length
    expect(finalCount).toBe(1)
  })
})
