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

  // TDD Tests for Mobile Auth Icons

  // Test 4: Should show login icon on mobile when not authenticated
  test('shows login icon on mobile when not authenticated', () => {
    const mockOnLogin = vi.fn();

    render(
      <MemoryRouter>
        <Header
          showAuth={true}
          isAuthenticated={false}
          onLogin={mockOnLogin}
        />
      </MemoryRouter>
    );

    // Should show login icon on mobile (d-lg-none)
    const loginIcon = screen.getByLabelText('Login');
    expect(loginIcon).toBeInTheDocument();
    expect(loginIcon).toHaveClass('d-lg-none');

    // Should show desktop login button (d-none d-lg-block)
    const desktopLoginButtons = screen.getAllByRole('button', { name: /login/i });
    expect(desktopLoginButtons).toHaveLength(2);

    // Desktop button should be hidden on mobile
    const desktopLoginButton = desktopLoginButtons.find(btn =>
      btn.classList.contains('d-none') && btn.classList.contains('d-lg-block')
    );
    expect(desktopLoginButton).toBeInTheDocument();
  });

  // Test 5: Should show user icon with dropdown on mobile when authenticated
  test('shows user icon with dropdown on mobile when authenticated', () => {
    const mockOnLogout = vi.fn();

    render(
      <MemoryRouter>
        <Header
          showAuth={true}
          isAuthenticated={true}
          userName="John Doe"
          onLogout={mockOnLogout}
        />
      </MemoryRouter>
    );

    // Should show user icon on mobile (d-lg-none)
    const userIcon = screen.getByRole('button', { name: '' }); // dropdown toggle
    expect(userIcon).toBeInTheDocument();
    expect(userIcon.parentElement).toHaveClass('d-lg-none');

    // Should show desktop logout button (d-none d-lg-block)
    const logoutButtons = screen.getAllByRole('button', { name: /logout/i });
    expect(logoutButtons).toHaveLength(2);

    // Desktop button should be hidden on mobile
    const desktopLogoutButton = logoutButtons.find(btn =>
      btn.classList.contains('d-none') && btn.classList.contains('d-lg-block')
    );
    expect(desktopLogoutButton).toBeInTheDocument();
  });

  // Test 6: Should call onLogin when mobile login icon is clicked
  test('calls onLogin when mobile login icon is clicked', () => {
    const mockOnLogin = vi.fn();

    render(
      <MemoryRouter>
        <Header
          showAuth={true}
          isAuthenticated={false}
          onLogin={mockOnLogin}
        />
      </MemoryRouter>
    );

    const loginIcon = screen.getByLabelText('Login');
    fireEvent.click(loginIcon);

    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });

  // Test 7: Should show dropdown menu with user info and logout option on mobile
  test('shows dropdown menu with user info and logout option on mobile', () => {
    const mockOnLogout = vi.fn();

    render(
      <MemoryRouter>
        <Header
          showAuth={true}
          isAuthenticated={true}
          userName="John Doe"
          onLogout={mockOnLogout}
        />
      </MemoryRouter>
    );

    // Click on user icon to open dropdown
    const userIcon = screen.getByRole('button', { name: '' });
    fireEvent.click(userIcon);

    // Should show welcome message in dropdown (mobile version)
  const welcomeMessages = screen.getAllByText(/Bem-vindo\(a\), John Doe/i);
    expect(welcomeMessages).toHaveLength(2); // desktop and mobile

    // Find the mobile one (inside dropdown)
    const mobileWelcome = welcomeMessages.find(msg =>
      msg.closest('.dropdown-menu')
    );
    expect(mobileWelcome).toBeInTheDocument();

    // Should show logout option in dropdown
    const logoutButtons = screen.getAllByRole('button', { name: /logout/i });
    const dropdownLogout = logoutButtons.find(btn =>
      btn.closest('.dropdown-menu')
    );
    expect(dropdownLogout).toBeInTheDocument();

    // Click logout and verify callback
    fireEvent.click(dropdownLogout!);
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  // Test 8: Should hide auth elements when showAuth is false
  test('hides auth elements when showAuth is false', () => {
    render(
      <MemoryRouter>
        <Header showAuth={false} />
      </MemoryRouter>
    );

    // Should not show any login/logout buttons or icons
    const loginIcon = screen.queryByLabelText('Login');
    const logoutButton = screen.queryByRole('button', { name: /logout/i });
    const userIcon = screen.queryByRole('button', { name: '' });

    expect(loginIcon).not.toBeInTheDocument();
    expect(logoutButton).not.toBeInTheDocument();
    expect(userIcon).not.toBeInTheDocument();
  });
});
