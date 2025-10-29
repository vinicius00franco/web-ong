import { render, screen } from '@testing-library/react';
import { ErrorMessage } from '../ErrorMessage';

describe('ErrorMessage', () => {
  it('should render an error message with the correct Bootstrap classes', () => {
    const errorMessage = 'Something went wrong.';
    render(<ErrorMessage message={errorMessage} />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('alert', 'alert-danger');
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
