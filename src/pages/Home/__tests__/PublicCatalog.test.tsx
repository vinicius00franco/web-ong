import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '..'
import { publicProductsService } from '../../../services/public-products.service'
import { publicSearchService } from '../../../services/public-search.service'
import type { ProductsResponse, Product } from '../../../types/product'
import { renderWithProviders } from '../../../test/utils'

const makeProduct = (id: string, overrides: Partial<Product> = {}): Product => ({
  id,
  name: `Produto ${id}`,
  description: `Desc ${id}`,
  price: 10,
  category: 'Higiene',
  image_url: 'https://example.com/img.jpg',
  stock_qty: 1,
  weight_grams: 100,
  organization_id: 'org-1',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

describe('Home public catalog', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('loads and renders public products on home', async () => {
    const page1: ProductsResponse = {
      products: [makeProduct('1'), makeProduct('2')],
      total: 2,
      page: 1,
      limit: 12,
      totalPages: 1,
    }
    vi.spyOn(publicProductsService, 'getProducts').mockResolvedValueOnce(page1)

  renderWithProviders(<Home />)

    expect(await screen.findByText('Produto 1')).toBeInTheDocument()
    expect(screen.getByText('Produto 2')).toBeInTheDocument()
  })

  it('performs intelligent search and shows interpretation alert', async () => {
    vi.spyOn(publicProductsService, 'getProducts').mockResolvedValueOnce({
      products: [], total: 0, page: 1, limit: 12, totalPages: 0,
    })
    vi.spyOn(publicSearchService, 'search').mockResolvedValueOnce({
      products: [makeProduct('3', { category: 'Higiene', price: 45 })],
      interpretation: { category: 'Higiene', priceMax: 50, raw: 'higiene até 50 reais' },
      fallbackApplied: false,
    })

  renderWithProviders(<Home />)

    const input = await screen.findByPlaceholderText(/buscar/i)
    await userEvent.type(input, 'higiene até 50 reais')
    await userEvent.click(screen.getByRole('button', { name: /buscar/i }))

    expect(await screen.findByText(/Resultados para:/i)).toBeInTheDocument()
    expect(screen.getByText(/Categoria=Higiene/i)).toBeInTheDocument()
    expect(screen.getByText(/Preço ≤ 50/i)).toBeInTheDocument()
    expect(screen.getByText('Produto 3')).toBeInTheDocument()
  })
})
