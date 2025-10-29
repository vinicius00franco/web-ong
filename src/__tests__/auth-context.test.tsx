import { describe, test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuthProvider, useAuth } from '../contexts/AuthContext'

function Consumer() {
  const { token, user, login, logout } = useAuth()
  return (
    <div>
      <div data-testid="token">{token ?? ''}</div>
      <div data-testid="user">{user ? user.name : ''}</div>
      <button onClick={() => login('t-123', { id: 'u1', name: 'Alice', organization_id: 'org1' })}>
        do-login
      </button>
      <button onClick={() => logout()}>do-logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  test('login stores token and user; logout clears both', () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )

    // Initially empty
    expect(screen.getByTestId('token').textContent).toBe('')
    expect(screen.getByTestId('user').textContent).toBe('')

    // Login
    fireEvent.click(screen.getByText('do-login'))
    expect(screen.getByTestId('token').textContent).toBe('t-123')
    expect(screen.getByTestId('user').textContent).toBe('Alice')
    expect(JSON.parse(localStorage.getItem('token') || 'null')).toBe('t-123')

    // Logout
    fireEvent.click(screen.getByText('do-logout'))
    expect(screen.getByTestId('token').textContent).toBe('')
    expect(screen.getByTestId('user').textContent).toBe('')
  })
})
