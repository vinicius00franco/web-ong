import { describe, it, expect, vi, beforeEach } from 'vitest'
import { publicSearchService } from '../public-search.service'
import { configManager } from '../../config/app.config'

describe('RN-LOG-02: Log Específico da Busca', () => {
  beforeEach(() => {
    // Ensure mock mode to use local AI interpretation
    configManager.setUseMockData(true)
  })

  it('deve registrar log com texto de entrada, filtros da AI, aiSuccess=true e fallbackApplied=false', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const query = 'doces até 10 reais'
    await publicSearchService.search(query)

    const call = logSpy.mock.calls.find(([arg]) => typeof arg === 'object' && arg?.type === 'search_ai') as [any] | undefined

    expect(call, 'log específico da busca não encontrado').toBeTruthy()
    const logObj = call![0]

    expect(logObj).toEqual(
      expect.objectContaining({
        type: 'search_ai',
        inputText: query,
        aiSuccess: true,
        fallbackApplied: false,
      })
    )

    // Filters should at least include category or priceMax for this query
    expect(logObj.filters).toEqual(
      expect.objectContaining({
        category: expect.any(String),
      })
    )

    logSpy.mockRestore()
  })

  it('deve registrar aiSuccess=false e fallbackApplied=true quando a AI não gera filtros', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const query = 'forçar fallback'
    await publicSearchService.search(query)

    const call = logSpy.mock.calls.find(([arg]) => typeof arg === 'object' && arg?.type === 'search_ai') as [any] | undefined
    expect(call).toBeTruthy()
    const logObj = call![0]

    expect(logObj).toEqual(
      expect.objectContaining({
        type: 'search_ai',
        inputText: query,
        aiSuccess: false,
        fallbackApplied: true,
      })
    )

    logSpy.mockRestore()
  })
})
