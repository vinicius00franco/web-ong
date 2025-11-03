import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import Register from '../pages/Register'
import Login from '../pages/Login'
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

describe('Register page flow', () => {
  test('successful registration redirects to login page', async () => {
    // Use mock mode for consistent testing
    configManager.setUseMockData(true)

    renderWithProviders(
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>,
      { route: '/register' }
    )

    await userEvent.type(screen.getByLabelText(/Nome da Organização/i), 'Test Organization')
    await userEvent.type(screen.getByLabelText(/Email/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/Senha/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /Registrar/i }))

    // After registration, should be redirected to login
    expect(
      await screen.findByRole('heading', { name: /Login/i })
    ).toBeInTheDocument()
  })

  test('failed registration shows error', async () => {
    // Use mock mode to test error handling
    configManager.setUseMockData(true)

    renderWithProviders(<Register />, { route: '/register' })

    await userEvent.type(screen.getByLabelText(/Nome da Organização/i), 'Test Organization')
    await userEvent.type(screen.getByLabelText(/Email/i), 'existing@example.com')
    await userEvent.type(screen.getByLabelText(/Senha/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /Registrar/i }))

    await waitFor(() => expect(screen.getByText(/Email já cadastrado/i)).toBeInTheDocument())
  })

  test('form validation prevents submission with empty fields', async () => {
    renderWithProviders(<Register />, { route: '/register' })

    const submitButton = screen.getByRole('button', { name: /Registrar/i })

    // Try to submit without filling fields
    await userEvent.click(submitButton)

    // Form should not submit (HTML5 validation should prevent it)
    expect(mockedAxios.post).not.toHaveBeenCalled()
  })

  test('shows loading state during registration', async () => {
    configManager.setUseMockData(false)
    mockedAxios.post.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    renderWithProviders(<Register />, { route: '/register' })

    await userEvent.type(screen.getByLabelText(/Nome da Organização/i), 'Test Organization')
    await userEvent.type(screen.getByLabelText(/Email/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/Senha/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /Registrar/i }))

    // Should show loading text
    expect(screen.getByText(/Registrando/i)).toBeInTheDocument()

    // Wait for completion
    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalled())
  })

  test('has link to login page', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>,
      { route: '/register' }
    )

    const loginLink = screen.getByRole('button', { name: /Já tem conta\?/i })
    await userEvent.click(loginLink)

    expect(
      await screen.findByRole('heading', { name: /Login/i })
    ).toBeInTheDocument()
  })
})