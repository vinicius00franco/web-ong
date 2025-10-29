import { render, screen, fireEvent } from '@testing-library/react';
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

  // Test 3: Hamburger menu should toggle on click
  test('hamburger menu should toggle on click', async () => {
    const { container } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const navbarToggler = container.querySelector('.navbar-toggler');
    const navbarCollapse = container.querySelector('.navbar-collapse');

    expect(navbarToggler).toBeInTheDocument();
    expect(navbarCollapse).toBeInTheDocument();
    expect(navbarCollapse).not.toHaveClass('show');

    // Simulate a click on the hamburger menu button
    if (navbarToggler) {
      fireEvent.click(navbarToggler);
    }

    // After clicking, the collapse element should have the 'show' class
    expect(navbarCollapse).toHaveClass('show');

    // Simulate another click to close the menu
    if (navbarToggler) {
      fireEvent.click(navbarToggler);
    }

    // The collapse element should not have the 'show' class anymore
    expect(navbarCollapse).not.toHaveClass('show');
  });
});
