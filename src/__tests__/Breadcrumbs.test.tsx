import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs/index';

describe('Breadcrumbs', () => {
  it('should render breadcrumb links', () => {
    const breadcrumbs = [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Laptops', href: '/products/laptops' },
    ];
    render(
      <MemoryRouter>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </MemoryRouter>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Laptops')).toBeInTheDocument();
  });
});
