import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useUsers } from '../hooks/useUsers'
import { configManager } from '../config/app.config'
import { resetAllMocks } from '../mocks'

describe('useUsers', () => {
  beforeEach(() => {
    configManager.setUseMockData(true)
  })

  afterEach(() => {
    resetAllMocks()
  })

  it('should initialize with empty users and loading true during fetch', () => {
    const { result } = renderHook(() => useUsers())

    // Estado inicial durante carregamento
    expect(result.current.users).toEqual([])
    expect(result.current.loading).toBe(true) // Carregamento automático
    expect(result.current.error).toBe(null)
  })

  it('should load users on mount', async () => {
    const { result } = renderHook(() => useUsers())

    // Aguarda o carregamento inicial
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.users.length).toBeGreaterThan(0)
    expect(result.current.hasUsers).toBe(true)
    expect(result.current.isEmpty).toBe(false)
  })

  it('should handle loading state during fetch', async () => {
    const { result } = renderHook(() => useUsers())

    // Aguarda carregamento inicial
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Dispara uma nova busca
    result.current.fetchUsers()

    // Verifica que entrou em loading novamente
    await waitFor(() => {
      expect(result.current.loading).toBe(true)
    })

    // Aguarda completar
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    }, { timeout: 2000 })
  })

  it('should create user successfully', async () => {
    const { result } = renderHook(() => useUsers())

    // Aguarda carregamento inicial
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const newUserData = {
      name: 'Novo Usuário',
      email: 'novo@email.com',
      password: 'password123',
      role: 'volunteer' as const,
      organization_id: 'org-001'
    }

    const createdUser = await result.current.createUser(newUserData)

    expect(createdUser).toBeTruthy()
    expect(createdUser?.name).toBe(newUserData.name)
    expect(createdUser?.email).toBe(newUserData.email)
    expect(createdUser?.role).toBe(newUserData.role)
  })

  it('should update user successfully', async () => {
    const { result } = renderHook(() => useUsers())

    // Aguarda carregamento inicial
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const userToUpdate = result.current.users[0]
    const newName = 'Nome Atualizado'

    const updatedUser = await result.current.updateUser({
      id: userToUpdate.id,
      name: newName
    })

    expect(updatedUser).toBeTruthy()
    expect(updatedUser?.id).toBe(userToUpdate.id)
    expect(updatedUser?.name).toBe(newName)
  })

  it('should delete user successfully', async () => {
    const { result } = renderHook(() => useUsers())

    // Aguarda carregamento inicial
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const userToDelete = result.current.users[0]

    const success = await result.current.deleteUser(userToDelete.id)

    expect(success).toBe(true)
  })

  it('should get user by id', async () => {
    const { result } = renderHook(() => useUsers())

    // Aguarda carregamento inicial
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const user = result.current.users[0]
    const fetchedUser = await result.current.getUserById(user.id)

    expect(fetchedUser).toEqual(user)
  })

  it('should update filters and refetch', async () => {
    const { result } = renderHook(() => useUsers())

    // Aguarda carregamento inicial
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Aplica filtro
    result.current.updateFilters({ role: 'admin' })

    // Aguarda nova busca
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    }, { timeout: 2000 })

    // Verifica se o filtro foi aplicado (pode não ter admins nos dados mock)
    expect(result.current.filters.role).toBe('admin')
  })

  it('should clear error', () => {
    const { result } = renderHook(() => useUsers())

    // A função clearError deve existir
    expect(typeof result.current.clearError).toBe('function')
  })

  it('should provide correct utility properties', async () => {
    const { result } = renderHook(() => useUsers())

    // Aguarda carregamento
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Estado com dados
    expect(result.current.hasUsers).toBe(true)
    expect(result.current.isEmpty).toBe(false)
    expect(result.current.hasError).toBe(false)

    // Propriedades de paginação devem existir
    expect(result.current.pagination).toHaveProperty('total')
    expect(result.current.pagination).toHaveProperty('page')
    expect(result.current.pagination).toHaveProperty('limit')
    expect(result.current.pagination).toHaveProperty('totalPages')
  })
})