import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignupForm from '@/components/auth/SignupForm'
import LoginForm from '@/components/auth/LoginForm'
import { getSession, getUsers, saveUsers } from '@/lib/storage'
import { User } from '@/types/auth'

// Mock next/navigation
const mockReplace = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

beforeEach(() => {
  localStorage.clear()
  mockReplace.mockClear()
})

describe('auth flow', () => {
  it('submits the signup form and creates a session', async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    await user.type(screen.getByTestId('auth-signup-email'), 'test@example.com')
    await user.type(screen.getByTestId('auth-signup-password'), 'password123')
    await user.click(screen.getByTestId('auth-signup-submit'))

    await waitFor(() => {
      const session = getSession()
      expect(session).not.toBeNull()
      expect(session?.email).toBe('test@example.com')
    })
    expect(mockReplace).toHaveBeenCalledWith('/dashboard')
  })

  it('shows an error for duplicate signup email', async () => {
    const existingUser: User = {
      id: 'existing-id',
      email: 'existing@example.com',
      password: 'pass',
      createdAt: new Date().toISOString(),
    }
    saveUsers([existingUser])

    const user = userEvent.setup()
    render(<SignupForm />)

    await user.type(screen.getByTestId('auth-signup-email'), 'existing@example.com')
    await user.type(screen.getByTestId('auth-signup-password'), 'anything')
    await user.click(screen.getByTestId('auth-signup-submit'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('User already exists')
    })
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('submits the login form and stores the active session', async () => {
    const existingUser: User = {
      id: 'user-123',
      email: 'login@example.com',
      password: 'mypassword',
      createdAt: new Date().toISOString(),
    }
    saveUsers([existingUser])

    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByTestId('auth-login-email'), 'login@example.com')
    await user.type(screen.getByTestId('auth-login-password'), 'mypassword')
    await user.click(screen.getByTestId('auth-login-submit'))

    await waitFor(() => {
      const session = getSession()
      expect(session).not.toBeNull()
      expect(session?.userId).toBe('user-123')
      expect(session?.email).toBe('login@example.com')
    })
    expect(mockReplace).toHaveBeenCalledWith('/dashboard')
  })

  it('shows an error for invalid login credentials', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByTestId('auth-login-email'), 'nobody@example.com')
    await user.type(screen.getByTestId('auth-login-password'), 'wrongpass')
    await user.click(screen.getByTestId('auth-login-submit'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password')
    })
  })
})
