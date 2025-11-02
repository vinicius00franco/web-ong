import { describe, it, expect } from 'vitest'
import { renderWithProviders } from '../../../src/test/utils'
import { screen, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AppRoutes } from '../../AppRoutes'

describe('Sidebar global presence', () => {
  it('should show Sidebar on Home page', () => {
    renderWithProviders(<AppRoutes />, { route: '/' })
    const sidebar = screen.getByText('Menu Principal').closest('div')
    expect(within(sidebar!).getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(within(sidebar!).getByRole('link', { name: /produtos/i })).toBeInTheDocument()
  })

  it('should show Sidebar on About page', () => {
    renderWithProviders(<AppRoutes />, { route: '/about' })
    const sidebar = screen.getByText('Menu Principal').closest('div')
    expect(within(sidebar!).getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(within(sidebar!).getByRole('link', { name: /produtos/i })).toBeInTheDocument()
  })

  it('should show Sidebar on Ong dashboard route', () => {
    renderWithProviders(<AppRoutes />, { route: '/ong' , preauth: { token: 't', user: { id: 'u1', name: 'X', organization_id: 'org1' } }})
    const sidebar = screen.getByText('Menu Principal').closest('div')
    expect(within(sidebar!).getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(within(sidebar!).getByRole('link', { name: /produtos/i })).toBeInTheDocument()
  })

  it('should show Sidebar on Products page', () => {
    renderWithProviders(<AppRoutes />, { route: '/ong/products', preauth: { token: 't', user: { id: 'u1', name: 'X', organization_id: 'org1' } }})
    const sidebar = screen.getByText('Menu Principal').closest('div')
    expect(within(sidebar!).getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(within(sidebar!).getByRole('link', { name: /produtos/i })).toBeInTheDocument()
  })
})
