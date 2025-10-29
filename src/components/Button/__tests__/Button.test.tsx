import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import { axe } from 'jest-axe';
import Button from '../index';
import '@testing-library/jest-dom';

describe('Button Component', () => {
  // Test 1: Should render with default props
  test('renders button with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn', 'btn-primary');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).not.toBeDisabled();
  });

  // Test 2: Should render with custom variant
  test('renders button with custom variant', () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('btn', 'btn-danger');
  });

  // Test 3: Should render with custom size
  test('renders button with custom size', () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('btn', 'btn-primary', 'btn-lg');
  });

  // Test 4: Should handle disabled state
  test('renders disabled button', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
  });

  // Test 5: Should handle click events
  test('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test 6: Should not call onClick when disabled
  test('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Test 7: Should render with custom className
  test('renders with custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('btn', 'btn-primary', 'custom-class');
  });

  // Test 8: Should render with submit type
  test('renders with submit type', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveAttribute('type', 'submit');
  });

  // Test 9: Should not have custom styles applied
  test('should not have custom styles', () => {
    render(<Button className="btn-custom">Custom</Button>);
    const button = screen.getByRole('button');

    expect(button).not.toHaveStyle('transition: all 0.2s ease-in-out');
  });

  // Test 10: Should render with aria-label
  test('renders button with aria-label', () => {
    render(<Button ariaLabel="Close">X</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-label', 'Close');
  });

  // Test 11: Should render with aria-live region
  test('renders with aria-live region when loading', () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole('button');
    const liveRegion = button.querySelector('[aria-live="polite"]');

    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveClass('sr-only');
  });

  // Test 12: Should have no accessibility violations
  test('should have no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});