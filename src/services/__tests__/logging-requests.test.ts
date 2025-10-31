import axios from 'axios'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { productsService } from '../products.service'
import { configManager } from '../../config/app.config'

describe('RN-LOG-01: Logs de Requisição', () => {
  let originalAdapter: typeof axios.defaults.adapter
  const user = { id: 'u1', name: 'Tester', organization_id: 'org1' }

  beforeEach(() => {
    // Force real API path
    configManager.setUseMockData(false)

    // Set user identifiers in localStorage for interceptor to read
    localStorage.setItem('user', JSON.stringify(user))

    // Stub axios adapter to avoid real network and to trigger interceptors
    originalAdapter = axios.defaults.adapter
    axios.defaults.adapter = async (config) => {
      // small artificial delay to have measurable latency
      await new Promise((r) => setTimeout(r, 5))
      return {
        data: { ok: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      }
    }
  })

  afterEach(() => {
    // Restore adapter and reset config
    axios.defaults.adapter = originalAdapter
    configManager.setUseMockData(true)
  })

  it('deve emitir um log estruturado com timestamp, rota, método, status, latência e identificadores', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    await productsService.getProducts({ category: 'Doces' })

    // Find a call with our structured log object
    const call = logSpy.mock.calls.find(([arg]) => typeof arg === 'object' && arg?.type === 'request') as [any] | undefined

    expect(call, 'log estruturado de requisição não encontrado').toBeTruthy()
    const logObj = call![0]

    expect(logObj).toEqual(
      expect.objectContaining({
        type: 'request',
        timestamp: expect.any(String),
        route: expect.stringContaining('/api/products'),
        method: 'GET',
        status: 200,
        latency: expect.any(Number),
        identifiers: expect.objectContaining({
          userId: user.id,
          organization_id: user.organization_id,
        }),
      })
    )

    // Sanity check for latency positive
    expect(logObj.latency).toBeGreaterThanOrEqual(0)

    logSpy.mockRestore()
  })
})
