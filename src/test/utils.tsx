import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { AuthProvider } from '../contexts/AuthContext'

interface RenderOptions {
  route?: string
  preauth?: {
    token: string
    user: { id: string; name: string; organization_id: string }
  } | null
}

export function renderWithProviders(
  ui: ReactElement,
  { route = '/', preauth = null }: RenderOptions = {}
) {
  if (preauth) {
    // Seed localStorage for AuthProvider's initial state
    localStorage.setItem('token', JSON.stringify(preauth.token))
    localStorage.setItem('user', JSON.stringify(preauth.user))
  }

  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </AuthProvider>
  )
  return render(ui, { wrapper })
}
