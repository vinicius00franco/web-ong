import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import UserCard from '../../UserCard'
import type { User } from '../../../types/entities'

describe('UserCard', () => {
  const mockUser: User = {
    id: 'user-001',
    name: 'João Silva',
    email: 'joao@example.com',
    organization_id: 'org-001',
    role: 'admin',
    created_at: '2024-01-01T12:00:00Z'
  }

  const defaultProps = {
    user: mockUser,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    isLoading: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render user information correctly', () => {
      render(<UserCard {...defaultProps} />)

      expect(screen.getByText('João Silva')).toBeInTheDocument()
      expect(screen.getByText('joao@example.com')).toBeInTheDocument()
      expect(screen.getByText('Administrador')).toBeInTheDocument()
    })

    it('should render user avatar with first letter of name', () => {
      render(<UserCard {...defaultProps} />)

      const avatar = screen.getByText('J')
      expect(avatar).toBeInTheDocument()
      expect(avatar).toHaveClass('bg-primary', 'text-white', 'rounded-circle')
    })

    it('should render role badge with correct styling', () => {
      render(<UserCard {...defaultProps} />)

      const badge = screen.getByText('Administrador')
      expect(badge).toHaveClass('badge', 'bg-danger')
    })

    it('should render different role badges correctly', () => {
      const roles = [
        { role: 'admin', label: 'Administrador', className: 'bg-danger' },
        { role: 'manager', label: 'Gerente', className: 'bg-warning' },
        { role: 'volunteer', label: 'Voluntário', className: 'bg-success' }
      ] as const

      roles.forEach(({ role, label, className }) => {
        const userWithRole = { ...mockUser, role }
        render(<UserCard {...defaultProps} user={userWithRole} />)

        const badge = screen.getByText(label)
        expect(badge).toHaveClass('badge', className)
      })
    })

    it('should render creation date formatted', () => {
      render(<UserCard {...defaultProps} />)

      expect(screen.getByText(/Criado em:/)).toBeInTheDocument()
      expect(screen.getByText(/01\/01\/2024/)).toBeInTheDocument()
    })

    it('should render action buttons', () => {
      render(<UserCard {...defaultProps} />)

      expect(screen.getByText('Editar')).toBeInTheDocument()
      expect(screen.getByText('Excluir')).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('should render loading skeleton when isLoading is true', () => {
      render(<UserCard {...defaultProps} isLoading={true} />)

      // Verifica se os placeholders estão presentes
      const placeholders = screen.getAllByText('', { selector: '.placeholder' })
      expect(placeholders.length).toBeGreaterThan(0)

      // Verifica se o avatar placeholder está presente
      const avatarPlaceholder = screen.getByText('', { selector: '.placeholder.bg-secondary.rounded-circle' })
      expect(avatarPlaceholder).toBeInTheDocument()
    })

    it('should not render user data when loading', () => {
      render(<UserCard {...defaultProps} isLoading={true} />)

      expect(screen.queryByText('João Silva')).not.toBeInTheDocument()
      expect(screen.queryByText('joao@example.com')).not.toBeInTheDocument()
      expect(screen.queryByText('Administrador')).not.toBeInTheDocument()
    })

    it('should disable buttons when loading', () => {
      render(<UserCard {...defaultProps} isLoading={true} />)

      // Quando está carregando, não há botões normais
      expect(screen.queryByText('Editar')).not.toBeInTheDocument()
      expect(screen.queryByText('Excluir')).not.toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should call onEdit when edit button is clicked', async () => {
      const user = userEvent.setup()
      render(<UserCard {...defaultProps} />)

      const editButton = screen.getByText('Editar')
      await user.click(editButton)

      expect(defaultProps.onEdit).toHaveBeenCalledWith(mockUser)
      expect(defaultProps.onEdit).toHaveBeenCalledTimes(1)
    })

    it('should call onDelete when delete button is clicked', async () => {
      const user = userEvent.setup()
      render(<UserCard {...defaultProps} />)

      const deleteButton = screen.getByText('Excluir')
      await user.click(deleteButton)

      expect(defaultProps.onDelete).toHaveBeenCalledWith(mockUser.id)
      expect(defaultProps.onDelete).toHaveBeenCalledTimes(1)
    })

    it('should disable buttons when isLoading is true', () => {
      render(<UserCard {...defaultProps} isLoading={true} />)

      // Não deve haver botões clicáveis quando carregando
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('Props Handling', () => {
    it('should handle optional onEdit callback', async () => {
      const user = userEvent.setup()
      render(<UserCard {...defaultProps} onEdit={undefined} />)

      const editButton = screen.getByText('Editar')
      await user.click(editButton)

      // Não deve quebrar se onEdit não for fornecido
      expect(defaultProps.onEdit).not.toHaveBeenCalled()
    })

    it('should handle optional onDelete callback', async () => {
      const user = userEvent.setup()
      render(<UserCard {...defaultProps} onDelete={undefined} />)

      const deleteButton = screen.getByText('Excluir')
      await user.click(deleteButton)

      // Não deve quebrar se onDelete não for fornecido
      expect(defaultProps.onDelete).not.toHaveBeenCalled()
    })

    it('should handle different user data', () => {
      const differentUser: User = {
        id: 'user-002',
        name: 'Maria Santos',
        email: 'maria@example.com',
        organization_id: 'org-001',
        role: 'manager',
        created_at: '2024-01-02T00:00:00Z'
      }

      render(<UserCard {...defaultProps} user={differentUser} />)

      expect(screen.getByText('Maria Santos')).toBeInTheDocument()
      expect(screen.getByText('maria@example.com')).toBeInTheDocument()
      expect(screen.getByText('Gerente')).toBeInTheDocument()
      expect(screen.getByText('M')).toBeInTheDocument() // Primeira letra do nome
    })
  })

  describe('Accessibility', () => {
    it('should have proper button labels', () => {
      render(<UserCard {...defaultProps} />)

      const editButton = screen.getByText('Editar')
      const deleteButton = screen.getByText('Excluir')

      expect(editButton).toHaveAttribute('type', 'button')
      expect(deleteButton).toHaveAttribute('type', 'button')
    })

    it('should have proper button styling for accessibility', () => {
      render(<UserCard {...defaultProps} />)

      const editButton = screen.getByText('Editar')
      const deleteButton = screen.getByText('Excluir')

      expect(editButton).toHaveClass('btn', 'btn-outline-primary', 'btn-sm', 'flex-grow-1')
      expect(deleteButton).toHaveClass('btn', 'btn-outline-danger', 'btn-sm', 'flex-grow-1')
    })

    it('should have proper card structure', () => {
      render(<UserCard {...defaultProps} />)

      const card = screen.getByText('João Silva').closest('.card')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('card', 'h-100')
    })
  })

  describe('Date Formatting', () => {
    it('should format date correctly in Brazilian Portuguese', () => {
      const userWithDifferentDate: User = {
        ...mockUser,
        created_at: '2024-12-25T15:30:00Z'
      }

      render(<UserCard {...defaultProps} user={userWithDifferentDate} />)

      // Verifica se contém a data formatada (mais flexível devido ao texto estar dividido em linhas)
      expect(screen.getByText(/25\/12\/2024/)).toBeInTheDocument()
    })

    it('should handle invalid date gracefully', () => {
      const userWithInvalidDate: User = {
        ...mockUser,
        created_at: 'invalid-date'
      }

      // Este teste pode falhar se a implementação não tratar datas inválidas
      // Mas esperamos que mostre alguma representação de data
      render(<UserCard {...defaultProps} user={userWithInvalidDate} />)

      expect(screen.getByText(/Criado em:/)).toBeInTheDocument()
    })
  })

  describe('Role Formatting', () => {
    it('should format all role types correctly', () => {
      const roleTests = [
        { role: 'admin', expected: 'Administrador' },
        { role: 'manager', expected: 'Gerente' },
        { role: 'volunteer', expected: 'Voluntário' },
        { role: 'unknown', expected: 'unknown' } // Caso não mapeado
      ] as const

      roleTests.forEach(({ role, expected }) => {
        const userWithRole = { ...mockUser, role: role as User['role'] }
        const { rerender } = render(<UserCard {...defaultProps} user={userWithRole} />)

        expect(screen.getByText(expected)).toBeInTheDocument()

        // Re-render para próximo teste
        rerender(<UserCard {...defaultProps} user={{ ...mockUser, role: 'admin' }} />)
      })
    })
  })

  describe('Avatar Generation', () => {
    it('should generate avatar from first letter of name', () => {
      const namesAndLetters = [
        { name: 'João Silva', letter: 'J' },
        { name: 'Maria Santos', letter: 'M' },
        { name: 'Pedro Alves', letter: 'P' },
        { name: 'Ana Costa', letter: 'A' }
      ]

      namesAndLetters.forEach(({ name, letter }) => {
        const userWithName = { ...mockUser, name }
        const { rerender } = render(<UserCard {...defaultProps} user={userWithName} />)

        expect(screen.getByText(letter)).toBeInTheDocument()

        // Re-render para próximo teste
        rerender(<UserCard {...defaultProps} user={mockUser} />)
      })
    })

    it('should handle single letter names', () => {
      const userWithSingleLetter = { ...mockUser, name: 'A' }
      render(<UserCard {...defaultProps} user={userWithSingleLetter} />)

      // Verifica especificamente o avatar (elemento com classes específicas)
      const avatar = screen.getByText('A', { selector: '.bg-primary.text-white.rounded-circle' })
      expect(avatar).toBeInTheDocument()
    })

    it('should handle empty names gracefully', () => {
      const userWithEmptyName = { ...mockUser, name: '' }
      render(<UserCard {...defaultProps} user={userWithEmptyName} />)

      // Deve mostrar algo, talvez um espaço ou não mostrar avatar
      const avatarElement = screen.getByText('', { selector: '.bg-primary' })
      expect(avatarElement).toBeInTheDocument()
    })
  })
})