import { describe, test, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import OngLayout from '../components/OngLayout'
import OngDashboard from '../pages/OngDashboard'
import Login from '../pages/Login'
import { renderWithProviders } from '../test/utils'


describe('ProtectedRoute', () => {
  test('redirects unauthenticated user to /login', async () => {
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
      { route: '/ong' }
    )

    // Should see Login heading
    expect(
      await screen.findByRole('heading', { name: /Login/i })
    ).toBeInTheDocument()
  })

  test('allows access when authenticated', async () => {
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
      {
        route: '/ong',
        preauth: {
          token: 'abc',
          user: { id: 'u1', name: 'Alice', organization_id: 'org1' },
        },
      }
    )

    expect(
      await screen.findByRole('heading', { level: 1, name: /ONG Dashboard/i })
    ).toBeInTheDocument()
  })
})
