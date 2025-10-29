import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import OngLayout from '../components/OngLayout'
import OngDashboard from '../pages/OngDashboard'
import ProtectedRoute from '../components/ProtectedRoute'
import { renderWithProviders } from '../test/utils'

// Mock axios
import axios from 'axios'
vi.mock('axios')
const mockedAxios = axios as unknown as { post: ReturnType<typeof vi.fn> }

beforeEach(() => {
  mockedAxios.post = vi.fn()
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('Login page flow', () => {
  test('successful login redirects to /ong and shows dashboard', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        token: 'tok-123',
        user: { id: 'u1', name: 'Alice', organization_id: 'org1' },
      },
    })

    renderWithProviders(
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/ong"
          element={
            <ProtectedRoute>
              <OngLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OngDashboard />} />
        </Route>
      </Routes>,
      { route: '/login' }
    )

    await userEvent.type(screen.getByLabelText(/Email/i), 'alice@example.com')
    await userEvent.type(screen.getByLabelText(/Password/i), 'secret')
    await userEvent.click(screen.getByRole('button', { name: /Login/i }))

    // After login, should be redirected to dashboard
    expect(
      await screen.findByRole('heading', { level: 1, name: /ONG Dashboard/i })
    ).toBeInTheDocument()
  })

  test('failed login shows error', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('invalid'))

    renderWithProviders(<Login />, { route: '/login' })

    await userEvent.type(screen.getByLabelText(/Email/i), 'alice@example.com')
    await userEvent.type(screen.getByLabelText(/Password/i), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: /Login/i }))

    await waitFor(() => expect(screen.getByText(/Login failed/i)).toBeInTheDocument())
  })
})
