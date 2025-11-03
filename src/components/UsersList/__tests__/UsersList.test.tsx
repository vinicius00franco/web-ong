import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import UsersList from '../../UsersList'
import type { User } from '../../../types/entities'

// Mock do ConfirmationModal
vi.mock('../../ConfirmationModal', () => ({
  default: ({ title, message, onConfirm, onCancel }: any) => (
    <div data-testid="confirmation-modal" className="modal" tabIndex={-1} style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel} data-testid="cancel-button">
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={onConfirm} data-testid="confirm-button">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}))

// Mock do EmptyState
vi.mock('../components/EmptyState/EmptyState', () => ({
  EmptyState: ({ message }: { message: string }) => (
    <div data-testid="empty-state">{message}</div>
  )
}))

// Mock do ErrorMessage
vi.mock('../components/ErrorMessage/ErrorMessage', () => ({
  ErrorMessage: ({ message }: { message: string }) => (
    <div data-testid="error-message">{message}</div>
  )
}))

describe('UsersList', () => {
  const mockUsers: User[] = [
    {
      id: 'user-001',
      name: 'João Silva',
      email: 'joao@example.com',
      organization_id: 'org-001',
      role: 'admin',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'user-002',
      name: 'Maria Santos',
      email: 'maria@example.com',
      organization_id: 'org-001',
      role: 'manager',
      created_at: '2024-01-02T00:00:00Z'
    }
  ]

  const defaultProps = {
    users: mockUsers,
    loading: false,
    error: undefined,
    onUserEdit: vi.fn(),
    onUserDelete: vi.fn(),
    onRefresh: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render users list correctly', () => {
      render(<UsersList {...defaultProps} />)

      expect(screen.getByText('João Silva')).toBeInTheDocument()
      expect(screen.getByText('joao@example.com')).toBeInTheDocument()
      expect(screen.getByText('Maria Santos')).toBeInTheDocument()
      expect(screen.getByText('maria@example.com')).toBeInTheDocument()
    })

    it('should render user cards in a responsive grid', () => {
      render(<UsersList {...defaultProps} />)

      const row = screen.getByText('João Silva').closest('.row')
      expect(row).toBeInTheDocument()
      expect(row).toHaveClass('row')
    })

    it('should display correct number of user cards', () => {
      render(<UsersList {...defaultProps} />)

      const userCards = screen.getAllByText(/João Silva|Maria Santos/)
      expect(userCards).toHaveLength(2)
    })
  })

  describe('Loading State', () => {
    it('should render loading skeleton when loading is true', () => {
      render(<UsersList {...defaultProps} loading={true} />)

      // Verifica se os placeholders de loading estão presentes
      const placeholders = screen.getAllByText('', { selector: '.placeholder' })
      expect(placeholders.length).toBeGreaterThan(0)

      // Verifica se o status de loading está presente
      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()
    })

    it('should show 6 skeleton cards during loading', () => {
      render(<UsersList {...defaultProps} loading={true} />)

      // Conta os cards de loading (cada card tem elementos com classe placeholder)
      const placeholders = screen.getAllByText('', { selector: '.placeholder' })
      // Deve haver vários placeholders para os 6 cards de loading
      expect(placeholders.length).toBeGreaterThan(20)
    })

    it('should not show user data when loading', () => {
      render(<UsersList {...defaultProps} loading={true} />)

      expect(screen.queryByText('João Silva')).not.toBeInTheDocument()
      expect(screen.queryByText('Maria Santos')).not.toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('should render error message when error is provided', () => {
      const errorMessage = 'Erro ao carregar usuários'
      render(<UsersList {...defaultProps} error={errorMessage} />)

      expect(screen.getByText(`Erro ao carregar usuários: ${errorMessage}`)).toBeInTheDocument()
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('should not render users list when error exists', () => {
      render(<UsersList {...defaultProps} error="Erro" />)

      expect(screen.queryByText('João Silva')).not.toBeInTheDocument()
      expect(screen.queryByText('Maria Santos')).not.toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should render empty state when users array is empty', () => {
      render(<UsersList {...defaultProps} users={[]} />)

      expect(screen.getByText('Nenhum usuário encontrado.')).toBeInTheDocument()
      expect(screen.getByText('Nenhum usuário encontrado.').closest('.text-center')).toBeInTheDocument()
    })

    it('should not render users when list is empty', () => {
      render(<UsersList {...defaultProps} users={[]} />)

      expect(screen.queryByText('João Silva')).not.toBeInTheDocument()
      expect(screen.queryByText('Maria Santos')).not.toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should call onUserEdit when edit button is clicked', async () => {
      const user = userEvent.setup()
      render(<UsersList {...defaultProps} />)

      const editButtons = screen.getAllByText('Editar')
      await user.click(editButtons[0])

      expect(defaultProps.onUserEdit).toHaveBeenCalledWith(mockUsers[0])
      expect(defaultProps.onUserEdit).toHaveBeenCalledTimes(1)
    })

    it('should open confirmation modal when delete button is clicked', async () => {
      const user = userEvent.setup()
      render(<UsersList {...defaultProps} />)

      const deleteButtons = screen.getAllByText('Excluir')
      await user.click(deleteButtons[0])

      expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument()
      expect(screen.getByText('Confirmar exclusão')).toBeInTheDocument()
    })

    it('should call onUserDelete and onRefresh when delete is confirmed', async () => {
      const user = userEvent.setup()
      render(<UsersList {...defaultProps} />)

      // Clicar no botão de excluir
      const deleteButtons = screen.getAllByText('Excluir')
      await user.click(deleteButtons[0])

      // Confirmar no modal
      const confirmButton = screen.getByTestId('confirm-button')
      await user.click(confirmButton)

      expect(defaultProps.onUserDelete).toHaveBeenCalledWith(mockUsers[0].id)
      expect(defaultProps.onRefresh).toHaveBeenCalledTimes(1)
    })

    it('should not call onUserDelete when delete is cancelled', async () => {
      const user = userEvent.setup()
      render(<UsersList {...defaultProps} />)

      // Clicar no botão de excluir
      const deleteButtons = screen.getAllByText('Excluir')
      await user.click(deleteButtons[0])

      // Cancelar no modal
      const cancelButton = screen.getByTestId('cancel-button')
      await user.click(cancelButton)

      expect(defaultProps.onUserDelete).not.toHaveBeenCalled()
      expect(defaultProps.onRefresh).not.toHaveBeenCalled()
    })

    it('should close modal after delete confirmation', async () => {
      const user = userEvent.setup()
      render(<UsersList {...defaultProps} />)

      // Abrir modal
      const deleteButtons = screen.getAllByText('Excluir')
      await user.click(deleteButtons[0])
      expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument()

      // Confirmar
      const confirmButton = screen.getByTestId('confirm-button')
      await user.click(confirmButton)

      // Modal deve ser fechado
      await waitFor(() => {
        expect(screen.queryByTestId('confirmation-modal')).not.toBeInTheDocument()
      })
    })

    it('should close modal after delete cancellation', async () => {
      const user = userEvent.setup()
      render(<UsersList {...defaultProps} />)

      // Abrir modal
      const deleteButtons = screen.getAllByText('Excluir')
      await user.click(deleteButtons[0])
      expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument()

      // Cancelar
      const cancelButton = screen.getByTestId('cancel-button')
      await user.click(cancelButton)

      // Modal deve ser fechado
      await waitFor(() => {
        expect(screen.queryByTestId('confirmation-modal')).not.toBeInTheDocument()
      })
    })
  })

  describe('Props Handling', () => {
    it('should pass loading state to UserCard components', () => {
      render(<UsersList {...defaultProps} loading={true} />)

      // Durante loading, não devemos ter cards de usuário normais
      expect(screen.queryByText('João Silva')).not.toBeInTheDocument()
    })

    it('should handle undefined error prop', () => {
      render(<UsersList {...defaultProps} error={undefined} />)

      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument()
      expect(screen.getByText('João Silva')).toBeInTheDocument()
    })

    it('should handle null error prop', () => {
      render(<UsersList {...defaultProps} error={null as any} />)

      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument()
      expect(screen.getByText('João Silva')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes during loading', () => {
      render(<UsersList {...defaultProps} loading={true} />)

      const statusElement = screen.getByRole('status', { hidden: true })
      expect(statusElement).toHaveAttribute('aria-live', 'polite')
      expect(statusElement).toHaveAttribute('aria-busy', 'true')
    })

    it('should have proper grid layout for screen readers', () => {
      render(<UsersList {...defaultProps} />)

      // Verifica se usa classes Bootstrap para layout responsivo
      const row = screen.getByText('João Silva').closest('.row')
      expect(row).toBeInTheDocument()
    })
  })

  describe('Integration with UserCard', () => {
    it('should pass correct props to UserCard components', () => {
      render(<UsersList {...defaultProps} />)

      // Verifica se os dados dos usuários são passados corretamente
      expect(screen.getByText('João Silva')).toBeInTheDocument()
      expect(screen.getByText('joao@example.com')).toBeInTheDocument()
      expect(screen.getByText('Administrador')).toBeInTheDocument()
    })

    it('should handle user edit callback correctly', async () => {
      const user = userEvent.setup()
      render(<UsersList {...defaultProps} />)

      const editButtons = screen.getAllByText('Editar')
      await user.click(editButtons[1]) // Segundo usuário

      expect(defaultProps.onUserEdit).toHaveBeenCalledWith(mockUsers[1])
    })
  })
})