import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, test, expect } from 'vitest';
import Header from '../index';
import '@testing-library/jest-dom';

describe('Header Component', () => {
  // Test 1: Should render with default props
  test('renders header with default props', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const headerTitle = screen.getByText('ONG Web App');
    expect(headerTitle).toBeInTheDocument();
  });

  // Test 2: Should not have custom styles applied
  test('should not have custom styles', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const headerTitle = screen.getByText('ONG Web App');
    expect(headerTitle).not.toHaveStyle('font-weight: 600');
  });
});
