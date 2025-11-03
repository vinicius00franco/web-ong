import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { usersService } from '../users.service'
import { configManager } from '../../config/app.config'
import { resetAllMocks } from '../../mocks'

describe('UsersService', () => {
  beforeEach(() => {
    configManager.setUseMockData(true)
  })

  afterEach(() => {
    resetAllMocks()
  })

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      const response = await usersService.getUsers()

      expect(response).toHaveProperty('data')
      expect(response).toHaveProperty('total')
      expect(response).toHaveProperty('page')
      expect(response).toHaveProperty('limit')
      expect(response).toHaveProperty('totalPages')
      expect(Array.isArray(response.data)).toBe(true)
    })

    it('should filter users by search term', async () => {
      const response = await usersService.getUsers({ search: 'admin' })

      expect(response.data.length).toBeGreaterThan(0)
      expect(response.data.every(user =>
        user.name.toLowerCase().includes('admin') ||
        user.email.toLowerCase().includes('admin')
      )).toBe(true)
    })

    it('should filter users by role', async () => {
      const response = await usersService.getUsers({ role: 'admin' })

      expect(response.data.length).toBeGreaterThan(0)
      expect(response.data.every(user => user.role === 'admin')).toBe(true)
    })

    it('should handle pagination', async () => {
      const response = await usersService.getUsers({ page: 1, limit: 2 })

      expect(response.page).toBe(1)
      expect(response.limit).toBe(2)
      expect(response.data.length).toBeLessThanOrEqual(2)
    })
  })

  describe('getUser', () => {
    it('should return a user by id', async () => {
      const users = await usersService.getUsers()
      const firstUser = users.data[0]

      const user = await usersService.getUser(firstUser.id)

      expect(user).toEqual(firstUser)
    })

    it('should throw error for non-existent user', async () => {
      await expect(usersService.getUser('non-existent-id')).rejects.toThrow()
    })
  })

  describe('createUser', () => {
    it('should create a new user', async () => {
      const newUserData = {
        name: 'Novo Usuário',
        email: 'novo@email.com',
        password: 'password123',
        role: 'volunteer' as const,
        organization_id: 'org-001'
      }

      const createdUser = await usersService.createUser(newUserData)

      expect(createdUser).toHaveProperty('id')
      expect(createdUser.name).toBe(newUserData.name)
      expect(createdUser.email).toBe(newUserData.email)
      expect(createdUser.role).toBe(newUserData.role)
      expect(createdUser.organization_id).toBe(newUserData.organization_id)
      expect(createdUser).toHaveProperty('created_at')
    })

    it('should throw error for duplicate email', async () => {
      const existingUser = {
        name: 'Usuário Existente',
        email: 'admin@ong.com', // Email que já existe
        password: 'password123',
        role: 'volunteer' as const,
        organization_id: 'org-001'
      }

      await expect(usersService.createUser(existingUser)).rejects.toThrow('Email already exists')
    })
  })

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const users = await usersService.getUsers()
      const userToUpdate = users.data[0]

      const updateData = {
        id: userToUpdate.id,
        name: 'Nome Atualizado'
      }

      const updatedUser = await usersService.updateUser(updateData)

      expect(updatedUser.id).toBe(userToUpdate.id)
      expect(updatedUser.name).toBe('Nome Atualizado')
      expect(updatedUser.email).toBe(userToUpdate.email) // Não deve ter mudado
    })

    it('should throw error for non-existent user', async () => {
      const updateData = {
        id: 'non-existent-id',
        name: 'Nome Atualizado'
      }

      await expect(usersService.updateUser(updateData)).rejects.toThrow()
    })

    it('should throw error for duplicate email', async () => {
      const users = await usersService.getUsers()
      const userToUpdate = users.data[0]
      const anotherUser = users.data[1]

      const updateData = {
        id: userToUpdate.id,
        email: anotherUser.email // Email de outro usuário
      }

      await expect(usersService.updateUser(updateData)).rejects.toThrow('Email already exists')
    })
  })

  describe('deleteUser', () => {
    it('should delete an existing user', async () => {
      const usersBefore = await usersService.getUsers()
      const userToDelete = usersBefore.data[0]

      await usersService.deleteUser(userToDelete.id)

      const usersAfter = await usersService.getUsers()
      expect(usersAfter.total).toBe(usersBefore.total - 1)
      expect(usersAfter.data.find(u => u.id === userToDelete.id)).toBeUndefined()
    })

    it('should throw error for non-existent user', async () => {
      await expect(usersService.deleteUser('non-existent-id')).rejects.toThrow()
    })
  })
})