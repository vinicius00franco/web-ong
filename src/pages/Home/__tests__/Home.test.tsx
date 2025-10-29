import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../../contexts/AuthContext';
import Home from '../index';
import '@testing-library/jest-dom';

describe('Home Page', () => {
  // Test 1: Should render with default props
  test('renders home page with default props', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </MemoryRouter>
    );

    const welcomeMessage = screen.getByText('Welcome to ONG Web App');
    expect(welcomeMessage).toBeInTheDocument();
  });

  // Test 2: Should not have custom styles applied
  test('should not have custom styles', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </MemoryRouter>
    );

    const welcomeMessage = screen.getByText('Welcome to ONG Web App');
    expect(welcomeMessage).not.toHaveStyle('transition: transform 0.2s ease-in-out');
  });
});
