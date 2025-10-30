import type { Product } from '../../types/product'
import productsData from '../data/products.mock.json'
import { configManager } from '../../config/app.config'
import type { PublicProductFilters } from '../../services/public-products.service'
import type { ProductsResponse } from '../../types/product'

const simulateDelay = (): Promise<void> => {
  const delay = configManager.getConfig().mockDelay
  return new Promise(resolve => setTimeout(resolve, delay))
}

class MockPublicProductsService {
  private products: Product[] = [...productsData]

  async getProducts(filters: PublicProductFilters = {}): Promise<ProductsResponse> {
    await simulateDelay()

    let filtered = [...this.products]

    if (filters.category) {
      filtered = filtered.filter(p => p.category.toLowerCase() === filters.category?.toLowerCase())
    }

    if (filters.name) {
      const term = filters.name.toLowerCase()
      filtered = filtered.filter(p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term))
    }

    if (typeof filters.priceMin === 'number') {
      filtered = filtered.filter(p => p.price >= (filters.priceMin as number))
    }

    if (typeof filters.priceMax === 'number') {
      filtered = filtered.filter(p => p.price <= (filters.priceMax as number))
    }

    const page = filters.page || 1
    const limit = filters.limit || 12
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    const paginated = filtered.slice(startIndex, endIndex)

    return {
      products: paginated,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    }
  }
}

export const mockPublicProductsService = new MockPublicProductsService()
