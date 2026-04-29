import { test, expect, Page } from '@playwright/test'

const TODAY = new Date().toISOString().split('T')[0]

async function clearStorage(page: Page) {
  await page.evaluate(() => localStorage.clear())
}

async function signUpUser(page: Page, email: string, password: string) {
  await page.goto('/signup')
  await page.getByTestId('auth-signup-email').fill(email)
  await page.getByTestId('auth-signup-password').fill(password)
  await page.getByTestId('auth-signup-submit').click()
  await page.waitForURL('/dashboard')
}

async function loginUser(page: Page, email: string, password: string) {
  await page.goto('/login')
  await page.getByTestId('auth-login-email').fill(email)
  await page.getByTestId('auth-login-password').fill(password)
  await page.getByTestId('auth-login-submit').click()
  await page.waitForURL('/dashboard')
}

test.describe('Habit Tracker app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clearStorage(page)
  })

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('splash-screen')).toBeVisible()
    await page.waitForURL('/login', { timeout: 5000 })
  })

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    // Sign up first to create a session
    await signUpUser(page, 'redirect@example.com', 'pass123')
    await page.goto('/')
    await page.waitForURL('/dashboard', { timeout: 5000 })
  })

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL('/login', { timeout: 5000 })
  })

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await signUpUser(page, 'newuser@example.com', 'testpass')
    await expect(page.getByTestId('dashboard-page')).toBeVisible()
    await expect(page.getByTestId('empty-state')).toBeVisible()
  })

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    // Sign up user A
    await signUpUser(page, 'usera@example.com', 'passa')
    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('User A Habit')
    await page.getByTestId('habit-save-button').click()
    await expect(page.getByTestId('habit-card-user-a-habit')).toBeVisible()
    await page.getByTestId('auth-logout-button').click()
    await page.waitForURL('/login')

    // Sign up user B
    await signUpUser(page, 'userb@example.com', 'passb')
    await expect(page.getByTestId('empty-state')).toBeVisible()
    // User A's habit should NOT appear
    await expect(page.getByTestId('habit-card-user-a-habit')).not.toBeVisible()
    await page.getByTestId('auth-logout-button').click()
    await page.waitForURL('/login')

    // Log back in as User A
    await loginUser(page, 'usera@example.com', 'passa')
    await expect(page.getByTestId('habit-card-user-a-habit')).toBeVisible()
  })

  test('creates a habit from the dashboard', async ({ page }) => {
    await signUpUser(page, 'creator@example.com', 'pass')
    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('Drink Water')
    await page.getByTestId('habit-description-input').fill('Stay hydrated')
    await page.getByTestId('habit-save-button').click()
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()
  })

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await signUpUser(page, 'streaker@example.com', 'pass')
    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('Exercise')
    await page.getByTestId('habit-save-button').click()

    await expect(page.getByTestId('habit-card-exercise')).toBeVisible()
    await expect(page.getByTestId('habit-streak-exercise')).toContainText('0 days')

    await page.getByTestId('habit-complete-exercise').click()
    await expect(page.getByTestId('habit-streak-exercise')).toContainText('1 day')
  })

  test('persists session and habits after page reload', async ({ page }) => {
    await signUpUser(page, 'persist@example.com', 'pass')
    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('Morning Run')
    await page.getByTestId('habit-save-button').click()
    await expect(page.getByTestId('habit-card-morning-run')).toBeVisible()

    // Reload
    await page.reload()
    await expect(page.getByTestId('dashboard-page')).toBeVisible()
    await expect(page.getByTestId('habit-card-morning-run')).toBeVisible()
  })

  test('logs out and redirects to /login', async ({ page }) => {
    await signUpUser(page, 'logout@example.com', 'pass')
    await page.getByTestId('auth-logout-button').click()
    await page.waitForURL('/login')
    await expect(page.getByTestId('auth-login-submit')).toBeVisible()
  })

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    // Load the app while online
    await signUpUser(page, 'offline@example.com', 'pass')
    // Give SW time to cache
    await page.waitForTimeout(2000)

    // Go offline
    await context.setOffline(true)

    // Navigate to login — should load from cache without hard crash
    await page.goto('/login')
    // Page should not crash — either the cached login or root is served
    const body = page.locator('body')
    await expect(body).toBeVisible()
    // Should not show a browser error page
    const title = await page.title()
    expect(title).not.toContain('ERR_')
  })
})
