import { render, screen } from '@testing-library/react';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('should render a message and an optional illustration', () => {
    const message = 'No data available.';
    render(<EmptyState message={message} />);
    expect(screen.getByText(message)).toBeInTheDocument();
    // Initially, no image is expected
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should render an illustration when an imageUrl is provided', () => {
    const message = 'No data available.';
    const imageUrl = '/path/to/image.png';
    render(<EmptyState message={message} imageUrl={imageUrl} />);
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', imageUrl);
  });
});
