import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import UsersListPage from '../index'
import type { User } from '../../../types/entities'

// Mock do componente Breadcrumbs - simula o componente real
vi.mock('../../../components/Breadcrumbs', () => ({
  default: ({ breadcrumbs }: any) => (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {breadcrumbs.map((crumb: any, index: number) => (
          <li
            key={index}
            className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
            aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
          >
            {index === breadcrumbs.length - 1 ? (
              crumb.label
            ) : (
              <a href={crumb.href}>{crumb.label}</a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}))

// Mock do componente UsersList - simula o componente real
vi.mock('../../../components/UsersList', () => ({
  default: ({ users, loading, error }: any) => {
    if (error) {
      return <div data-testid="users-list-error">{error}</div>
    }
    if (loading) {
      return <div data-testid="users-list-loading">Carregando...</div>
    }
    if (users.length === 0) {
      return <div data-testid="users-list-empty">Nenhum usuário encontrado</div>
    }
    return (
      <div className="row" data-testid="users-list">
        {users.map((user: any) => (
          <div key={user.id} className="col-12 col-sm-6 col-md-4 mb-4">
            <div data-testid={`user-${user.id}`} className="card">
              <div className="card-body">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">{user.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
}))

// Mock do hook useUsers
const mockUseUsers = vi.fn()
vi.mock('../../../hooks/useUsers', () => ({
  useUsers: () => mockUseUsers()
}))

const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'João Silva',
    email: 'joao@example.com',
    organization_id: 'org-1',
    role: 'admin',
    created_at: '2024-01-01T12:00:00Z'
  }
]

const defaultMockReturn = {
  users: mockUsers,
  loading: false,
  error: null,
  fetchUsers: vi.fn(),
  deleteUser: vi.fn().mockResolvedValue(undefined)
}

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('UsersListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseUsers.mockReturnValue(defaultMockReturn)
  })

  it('should render page title and description', () => {
    renderWithRouter(<UsersListPage />)

    expect(screen.getByText('Usuários da Organização')).toBeInTheDocument()
    expect(screen.getByText('Gerencie os usuários da sua organização')).toBeInTheDocument()
  })

  it('should render breadcrumbs correctly', () => {
    renderWithRouter(<UsersListPage />)

    const breadcrumbItems = screen.getAllByRole('listitem')
    expect(breadcrumbItems.length).toBe(3)
    
    // Check first breadcrumb (Home)
    const homeLink = screen.getByText('Home')
    expect(homeLink).toBeInTheDocument()
    expect(homeLink.closest('a')).toHaveAttribute('href', '/')
    
    // Check last breadcrumb (Usuários) - should be active
    const usersBreadcrumb = screen.getByText('Usuários')
    expect(usersBreadcrumb).toBeInTheDocument()
    expect(usersBreadcrumb.closest('li')).toHaveClass('active')
  })

  it('should render new user button', () => {
    renderWithRouter(<UsersListPage />)

    const newUserButton = screen.getByText('Novo Usuário')
    expect(newUserButton).toBeInTheDocument()
    expect(newUserButton).toHaveClass('btn', 'btn-primary')
  })

  it('should render search input', () => {
    renderWithRouter(<UsersListPage />)

    expect(screen.getByPlaceholderText('Buscar por nome ou email...')).toBeInTheDocument()
  })

  it('should render refresh button', () => {
    renderWithRouter(<UsersListPage />)

    const refreshButton = screen.getByText('Atualizar')
    expect(refreshButton).toBeInTheDocument()
    expect(refreshButton).toHaveClass('btn', 'btn-outline-secondary')
  })

  it('should render user statistics with correct totals', () => {
    renderWithRouter(<UsersListPage />)

    // Check for "Total de Usuários"
    expect(screen.getByText('Total de Usuários')).toBeInTheDocument()
    
    // Check for "Administradores"
    expect(screen.getByText('Administradores')).toBeInTheDocument()
    
    // Check for the count (should be 1 for admin)
    const titleElements = screen.getAllByRole('heading', { level: 3 })
    // Find the h3 with "1" text (total users)
    const totalUsersElement = titleElements.find(el => el.textContent === '1')
    expect(totalUsersElement).toBeInTheDocument()
  })

  it('should render UsersList component with users', () => {
    renderWithRouter(<UsersListPage />)

    expect(screen.getByTestId('users-list')).toBeInTheDocument()
    expect(screen.getByTestId('user-user-1')).toBeInTheDocument()
    expect(screen.getByText('João Silva')).toBeInTheDocument()
  })

  it('should disable buttons when loading', () => {
    mockUseUsers.mockReturnValueOnce({
      ...defaultMockReturn,
      loading: true
    })

    renderWithRouter(<UsersListPage />)

    const newUserButton = screen.getByText('Novo Usuário')
    const refreshButton = screen.getByText('Atualizar')

    expect(newUserButton).toBeDisabled()
    expect(refreshButton).toBeDisabled()
  })

  it('should show zero statistics when no users exist', () => {
    mockUseUsers.mockReturnValueOnce({
      ...defaultMockReturn,
      users: []
    })

    renderWithRouter(<UsersListPage />)

    const statCards = screen.getAllByRole('heading', { level: 3 })
    // Should have 4 stat cards all showing 0
    expect(statCards.every(card => card.textContent === '0')).toBe(true)
  })
})