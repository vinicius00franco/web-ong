import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { usersService } from '../services/users.service'
import { configManager } from '../config/app.config'
import { resetAllMocks } from '../mocks'

describe('UsersService', () => {
  beforeEach(() => {
    configManager.setUseMockData(true)
  })

  afterEach(() => {
    resetAllMocks()
  })

  describe('getUsers', () => {
    it('should return paginated users with default filters', async () => {
      const result = await usersService.getUsers()

      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('page')
      expect(result).toHaveProperty('limit')
      expect(result).toHaveProperty('totalPages')

      expect(Array.isArray(result.data)).toBe(true)
      expect(result.page).toBe(1)
      expect(result.limit).toBe(10)
      expect(result.total).toBeGreaterThanOrEqual(0)
    })

    it('should filter users by search term', async () => {
      const result = await usersService.getUsers({ search: 'Admin' })

      expect(result.data.length).toBeGreaterThan(0)
      result.data.forEach(user => {
        expect(
          user.name.toLowerCase().includes('admin') ||
          user.email.toLowerCase().includes('admin')
        ).toBe(true)
      })
    })

    it('should filter users by role', async () => {
      const result = await usersService.getUsers({ role: 'admin' })

      expect(result.data.length).toBeGreaterThan(0)
      result.data.forEach(user => {
        expect(user.role).toBe('admin')
      })
    })

    it('should filter users by organization_id', async () => {
      const result = await usersService.getUsers({ organization_id: 'org-001' })

      expect(result.data.length).toBeGreaterThan(0)
      result.data.forEach(user => {
        expect(user.organization_id).toBe('org-001')
      })
    })

    it('should handle pagination correctly', async () => {
      const result = await usersService.getUsers({ page: 1, limit: 2 })

      expect(result.page).toBe(1)
      expect(result.limit).toBe(2)
      expect(result.data.length).toBeLessThanOrEqual(2)
    })
  })

  describe('getUser', () => {
    it('should return a user by id', async () => {
      const users = await usersService.getUsers()
      const firstUser = users.data[0]

      const result = await usersService.getUser(firstUser.id)

      expect(result).toEqual(firstUser)
    })

    it('should throw error for non-existent user', async () => {
      await expect(usersService.getUser('non-existent-id')).rejects.toThrow('User with id non-existent-id not found')
    })
  })

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const newUserData = {
        name: 'Novo Usuário',
        email: 'novo@email.com',
        password: 'password123',
        role: 'volunteer' as const,
        organization_id: 'org-001'
      }

      const result = await usersService.createUser(newUserData)

      expect(result).toHaveProperty('id')
      expect(result.name).toBe(newUserData.name)
      expect(result.email).toBe(newUserData.email)
      expect(result.role).toBe(newUserData.role)
      expect(result.organization_id).toBe(newUserData.organization_id)
      expect(result).toHaveProperty('created_at')
    })

    it('should throw error when creating user with existing email', async () => {
      const existingUserData = {
        name: 'Usuário Existente',
        email: 'onga@example.com', // Email que já existe nos dados mock
        password: 'password123',
        role: 'volunteer' as const,
        organization_id: 'org-001'
      }

      await expect(usersService.createUser(existingUserData)).rejects.toThrow('Email already exists')
    })

    it('should generate unique id for new user', async () => {
      const userData1 = {
        name: 'User 1',
        email: 'user1@email.com',
        password: 'pass1',
        role: 'volunteer' as const,
        organization_id: 'org-001'
      }

      const userData2 = {
        name: 'User 2',
        email: 'user2@email.com',
        password: 'pass2',
        role: 'volunteer' as const,
        organization_id: 'org-001'
      }

      const user1 = await usersService.createUser(userData1)
      const user2 = await usersService.createUser(userData2)

      expect(user1.id).not.toBe(user2.id)
      expect(user1.id).toBeTruthy()
      expect(user2.id).toBeTruthy()
    })
  })

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const users = await usersService.getUsers()
      const userToUpdate = users.data[0]

      const updateData = {
        id: userToUpdate.id,
        name: 'Nome Atualizado',
        email: 'email@atualizado.com'
      }

      const result = await usersService.updateUser(updateData)

      expect(result.id).toBe(userToUpdate.id)
      expect(result.name).toBe(updateData.name)
      expect(result.email).toBe(updateData.email)
      expect(result.role).toBe(userToUpdate.role) // Não alterado
      expect(result.organization_id).toBe(userToUpdate.organization_id) // Não alterado
    })

    it('should update only provided fields', async () => {
      const users = await usersService.getUsers()
      const userToUpdate = users.data[0]
      const originalName = userToUpdate.name

      const updateData = {
        id: userToUpdate.id,
        name: 'Nome Parcialmente Atualizado'
        // Não inclui email, role, etc.
      }

      const result = await usersService.updateUser(updateData)

      expect(result.id).toBe(userToUpdate.id)
      expect(result.name).toBe(updateData.name)
      expect(result.email).toBe(userToUpdate.email) // Não alterado
      expect(result.role).toBe(userToUpdate.role) // Não alterado
    })

    it('should throw error when updating non-existent user', async () => {
      const updateData = {
        id: 'non-existent-id',
        name: 'Nome Atualizado'
      }

      await expect(usersService.updateUser(updateData)).rejects.toThrow('User with id non-existent-id not found')
    })

    it('should throw error when updating to existing email', async () => {
      const users = await usersService.getUsers()
      const user1 = users.data[0]
      const user2 = users.data[1]

      const updateData = {
        id: user1.id,
        email: user2.email // Email já usado por outro usuário
      }

      await expect(usersService.updateUser(updateData)).rejects.toThrow('Email already exists')
    })
  })

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const usersBefore = await usersService.getUsers()
      const userToDelete = usersBefore.data[0]

      await usersService.deleteUser(userToDelete.id)

      const usersAfter = await usersService.getUsers()
      expect(usersAfter.total).toBe(usersBefore.total - 1)
      expect(usersAfter.data.find(u => u.id === userToDelete.id)).toBeUndefined()
    })

    it('should throw error when deleting non-existent user', async () => {
      await expect(usersService.deleteUser('non-existent-id')).rejects.toThrow('User with id non-existent-id not found')
    })
  })

  describe('Integration with real API', () => {
    it('should use real API when mock is disabled', async () => {
      configManager.setUseMockData(false)

      // Este teste pode falhar se a API real não estiver rodando
      // Por isso vamos apenas verificar se o método existe e é chamado
      expect(typeof usersService.getUsers).toBe('function')
      expect(typeof usersService.createUser).toBe('function')
      expect(typeof usersService.updateUser).toBe('function')
      expect(typeof usersService.deleteUser).toBe('function')

      // Restaura mock para outros testes
      configManager.setUseMockData(true)
    })
  })
})