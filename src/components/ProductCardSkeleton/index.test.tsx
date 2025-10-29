import { render, screen } from '@testing-library/react';
import { ProductCardSkeleton } from '.';

describe('ProductCardSkeleton', () => {
  it('renders the skeleton placeholder elements', () => {
    render(<ProductCardSkeleton />);

    // Check for the image placeholder
    expect(screen.getByTestId('skeleton-image')).toBeInTheDocument();

    // Check for the text placeholders
    expect(screen.getByTestId('skeleton-title')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-description')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-price')).toBeInTheDocument();
  });
});
