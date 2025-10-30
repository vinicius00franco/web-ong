import { describe, it, expect, beforeEach } from 'vitest'
import { publicSearchService } from '../public-search.service'
import { configManager } from '../../config/app.config'

describe('PublicSearchService (mock mode)', () => {
  beforeEach(() => {
    configManager.setUseMockData(true)
  })

  it('interprets natural language and returns filters (RN-BUSCA-03)', async () => {
    const res = await publicSearchService.search('higiene até 50 reais')
    expect(res.fallbackApplied).toBe(false)
    expect(res.interpretation?.category).toBeDefined()
    expect((res.interpretation?.priceMax ?? 9999) <= 50).toBe(true)
    expect(res.products.length).toBeGreaterThan(0)
  })

  it('falls back to simple text search when interpretation fails (RN-BUSCA-04)', async () => {
    const res = await publicSearchService.search('fallback sem interpretacao')
    expect(res.fallbackApplied).toBe(true)
    expect(res.interpretation).toBeUndefined()
  })
})
