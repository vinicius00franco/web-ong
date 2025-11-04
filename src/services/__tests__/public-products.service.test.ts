import { describe, it, expect, beforeEach } from 'vitest'
import { publicProductsService, type PublicProductFilters } from '../public-products.service'
import { configManager } from '../../config/app.config'

describe('PublicProductsService (mock mode)', () => {
  beforeEach(() => {
    configManager.setUseMockData(true)
  })

  it('returns paginated products', async () => {
    const res = await publicProductsService.getProducts()
    expect(res.products.length).toBeGreaterThan(0)
    expect(res.page).toBe(1)
    expect(res.limit).toBe(12)
    expect(res.total).toBeGreaterThan(0)
  })

  it('filters by category and price range', async () => {
    const filters: PublicProductFilters = { category: 'Educação', priceMax: 100 }
    const res = await publicProductsService.getProducts(filters)
    expect(res.products.every(p => p.price <= 100)).toBe(true)
  })
})
