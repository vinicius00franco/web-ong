import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '.';
import type { Product } from '../../types/product';
import { vi } from 'vitest';

const product: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 10,
  category: 'Test Category',
  image_url: 'https://via.placeholder.com/150',
  stock_qty: 10,
  weight_grams: 100,
  organization_id: '1',
  created_at: '',
  updated_at: '',
};

describe('ProductCard', () => {
  it('renders the product image', () => {
    render(<ProductCard product={product} onEdit={() => {}} onDelete={() => {}} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', product.image_url);
    expect(image).toHaveAttribute('alt', product.name);
  });

  it('renders the product name', () => {
    render(<ProductCard product={product} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText(product.name)).toBeInTheDocument();
  });

  it('renders the product description', () => {
    render(<ProductCard product={product} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText(product.description)).toBeInTheDocument();
  });

  it('renders the product price', () => {
    render(<ProductCard product={product} onEdit={() => {}} onDelete={() => {}} />);
    const priceElement = screen.getByText('Preço:').parentElement;
    expect(priceElement).toHaveTextContent(`Preço: R$ ${product.price.toFixed(2).replace('.', ',')}`);
  });

  it('calls onEdit when the edit button is clicked', () => {
    const onEdit = vi.fn();
    render(<ProductCard product={product} onEdit={onEdit} onDelete={() => {}} />);
    fireEvent.click(screen.getByText('Editar'));
    expect(onEdit).toHaveBeenCalledWith(product.id);
  });

  it('calls onDelete when the delete button is clicked', () => {
    const onDelete = vi.fn();
    render(<ProductCard product={product} onEdit={() => {}} onDelete={onDelete} />);
    fireEvent.click(screen.getByText('Deletar'));
    expect(onDelete).toHaveBeenCalledWith(product.id);
  });
});
