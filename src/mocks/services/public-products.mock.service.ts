import type { Product } from '../../types/product'
import productsData from '../data/products.mock.json'
import { configManager } from '../../config/app.config'
import type { PublicProductFilters } from '../../services/public-products.service'
import type { ProductsResponse } from '../../types/product'

// Tipo para os dados do JSON (snake_case)
interface ProductJsonData {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
  stock_qty: number
  weight_grams: number
  organization_id: string
  created_at: string
  updated_at?: string
  categoryId?: number
}

const simulateDelay = (): Promise<void> => {
  const delay = configManager.getConfig().mockDelay
  return new Promise(resolve => setTimeout(resolve, delay))
}

// Função para converter dados do JSON (snake_case) para Product (camelCase)
const convertJsonToProduct = (jsonData: ProductJsonData): Product => ({
  id: jsonData.id,
  name: jsonData.name,
  description: jsonData.description,
  price: jsonData.price,
  imageUrl: jsonData.image_url,
  stockQty: jsonData.stock_qty,
  weightGrams: jsonData.weight_grams,
  organizationId: jsonData.organization_id,
  createdAt: jsonData.created_at,
  updatedAt: jsonData.updated_at,
  categoryId: jsonData.categoryId || 1 // valor padrão se não existir
})

class MockPublicProductsService {
  private products: ProductJsonData[] = [...productsData]

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

    // Converter snake_case para camelCase usando a função dedicada
    const convertedProducts: Product[] = paginated.map(convertJsonToProduct)

    return {
      products: convertedProducts,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    }
  }
}

export const mockPublicProductsService = new MockPublicProductsService()
