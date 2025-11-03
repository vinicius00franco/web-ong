import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import OngLayout from '../components/OngLayout'
import OngDashboard from '../pages/OngDashboard'
import ProtectedRoute from '../components/ProtectedRoute'
import { renderWithProviders } from '../test/utils'
import { configManager } from '../config/app.config'

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
    // Use mock mode para evitar problemas com API real
    configManager.setUseMockData(true)

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

    // Usar credenciais de teste do mock
    await userEvent.type(screen.getByLabelText(/Email/i), 'onga@example.com')
    await userEvent.type(screen.getByLabelText(/Password/i), 'password')
    await userEvent.click(screen.getByRole('button', { name: /Login/i }))

    // After login, should be redirected to dashboard
    expect(
      await screen.findByRole('heading', { name: /ONG Dashboard/i })
    ).toBeInTheDocument()
  })

  test('failed login shows error', async () => {
    // Use mock mode to exercise mock auth error messaging
    configManager.setUseMockData(true)
    mockedAxios.post.mockRejectedValueOnce(new Error('invalid'))

    renderWithProviders(<Login />, { route: '/login' })

    await userEvent.type(screen.getByLabelText(/Email/i), 'alice@example.com')
    await userEvent.type(screen.getByLabelText(/Password/i), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: /Login/i }))

    await waitFor(() => expect(screen.getByText(/Email ou senha inválidos/i)).toBeInTheDocument())
  })
})
