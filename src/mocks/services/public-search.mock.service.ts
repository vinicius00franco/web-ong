import productsData from '../data/products.mock.json'
import type { Product } from '../../types/product'
import type { PublicSearchResponse, SearchInterpretation } from '../../services/public-search.service'
import { configManager } from '../../config/app.config'

const simulateDelay = (): Promise<void> => {
  const delay = configManager.getConfig().mockDelay
  return new Promise(resolve => setTimeout(resolve, delay))
}

function simpleInterpret(query: string): SearchInterpretation | undefined {
  const q = query.toLowerCase()
  const interpretation: SearchInterpretation = { raw: query }

  // very naive parsing
  if (q.includes('doces')) interpretation.category = 'Doces'
  if (q.includes('higiene')) interpretation.category = 'Higiene'
  if (q.includes('vestuário') || q.includes('roupa')) interpretation.category = 'Vestuário'
  if (q.includes('educação') || q.includes('escolar')) interpretation.category = 'Educação'

  const matchMax = q.match(/(até|ate)\s*(\d+)[\s\-]*reais|r\$?\s*(\d+)/)
  const priceNum = matchMax?.[2] ? Number(matchMax[2]) : matchMax?.[3] ? Number(matchMax[3]) : undefined
  if (typeof priceNum === 'number' && !Number.isNaN(priceNum)) interpretation.priceMax = priceNum

  return Object.keys(interpretation).length > 1 ? interpretation : undefined
}

class MockPublicSearchService {
  private products: Product[] = this.normalizeProducts(productsData)

  private normalizeProducts(data: any[]): Product[] {
    return data.map(p => ({
      id: String(p.id),
      name: p.name,
      description: p.description ?? '',
      price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
      category: p.category ?? undefined,
      categoryId: p.categoryId ?? p.category_id ?? 0,
      imageUrl: p.imageUrl ?? p.image_url ?? '',
      stockQty: p.stockQty ?? p.stock_qty ?? 0,
      weightGrams: p.weightGrams ?? p.weight_grams ?? 0,
      organizationId: p.organizationId ?? p.organization_id ?? '',
      createdAt: p.createdAt ?? p.created_at ?? new Date().toISOString(),
      updatedAt: p.updatedAt ?? p.updated_at ?? undefined,
    }))
  }

  async search(query: string): Promise<PublicSearchResponse> {
    await simulateDelay()

    // Simulate explicit fallback trigger if query contains the word 'fallback'
    const forceFallback = query.toLowerCase().includes('fallback')

    const interpretation = forceFallback ? undefined : simpleInterpret(query)

    let results = [...this.products]

    if (interpretation?.category) {
      results = results.filter(p => (p.category ?? '').toLowerCase() === interpretation.category?.toLowerCase())
    }
    if (typeof interpretation?.priceMax === 'number') {
      results = results.filter(p => p.price <= (interpretation.priceMax as number))
    }

    // If no interpretation, fallback to simple text search
    if (!interpretation) {
      const term = query.toLowerCase()
      results = results.filter(p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term))
    }

    return {
      products: results.slice(0, 12),
      interpretation,
      fallbackApplied: !interpretation,
    }
  }
}

export const mockPublicSearchService = new MockPublicSearchService()
