export function calculateCurrentStreak(completions: string[], today?: string): number {
  const todayDate = today ?? new Date().toISOString().split('T')[0]

  // Remove duplicates and sort
  const unique = Array.from(new Set(completions)).sort()

  if (!unique.includes(todayDate)) {
    return 0
  }

  let streak = 0
  let current = todayDate

  while (unique.includes(current)) {
    streak++
    const date = new Date(current)
    date.setDate(date.getDate() - 1)
    current = date.toISOString().split('T')[0]
  }

  return streak
}
