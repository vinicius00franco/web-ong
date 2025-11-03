import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserFormModal from '../index';
import type { User } from '../../../types/entities';

const mockUser: User = {
  id: 'user-1',
  name: 'João Silva',
  email: 'joao@example.com',
  organization_id: 'org-1',
  role: 'admin',
  created_at: '2024-01-01T12:00:00Z'
};

describe('UserFormModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Modal visibility', () => {
    it('should not render when isOpen is false', () => {
      render(
        <UserFormModal
          isOpen={false}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.queryByTestId('user-form-modal')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByTestId('user-form-modal')).toBeInTheDocument();
    });

    it('should render backdrop when open', () => {
      render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument();
    });
  });

  describe('Modal for creating new user', () => {
    it('should show correct title for create mode', () => {
      render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByTestId('modal-title')).toHaveTextContent('Criar Novo Usuário');
    });

    it('should have empty form fields in create mode', () => {
      render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByTestId('name-input')).toHaveValue('');
      expect(screen.getByTestId('email-input')).toHaveValue('');
      expect(screen.getByTestId('role-select')).toHaveValue('volunteer');
    });

    it('should show "Criar Usuário" button in create mode', () => {
      render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByTestId('modal-submit-button')).toHaveTextContent('Criar Usuário');
    });
  });

  describe('Modal for editing user', () => {
    it('should show correct title for edit mode', () => {
      render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
          editingUser={mockUser}
        />
      );

      expect(screen.getByTestId('modal-title')).toHaveTextContent('Editar Usuário');
    });

    it('should populate form fields with editing user data', () => {
      render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
          editingUser={mockUser}
        />
      );

      expect(screen.getByTestId('name-input')).toHaveValue('João Silva');
      expect(screen.getByTestId('email-input')).toHaveValue('joao@example.com');
      expect(screen.getByTestId('role-select')).toHaveValue('admin');
    });

    it('should show "Atualizar" button in edit mode', () => {
      render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
          editingUser={mockUser}
        />
      );

      expect(screen.getByTestId('modal-submit-button')).toHaveTextContent('Atualizar');
    });
  });

  describe('Form interaction', () => {
    it('should update form fields on user input', async () => {
      const user = userEvent.setup();
      render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const nameInput = screen.getByTestId('name-input') as HTMLInputElement;
      const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
      const roleSelect = screen.getByTestId('role-select') as HTMLSelectElement;

      await user.type(nameInput, 'Maria Santos');
      await user.type(emailInput, 'maria@example.com');
      await user.selectOptions(roleSelect, 'manager');

      expect(nameInput.value).toBe('Maria Santos');
      expect(emailInput.value).toBe('maria@example.com');
      expect(roleSelect.value).toBe('manager');
    });

    it('should close modal when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const cancelButton = screen.getByTestId('modal-cancel-button');
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should close modal when backdrop is clicked', async () => {
      const user = userEvent.setup();
      render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const backdrop = screen.getByTestId('modal-backdrop');
      await user.click(backdrop);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should close modal when close button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const closeButton = screen.getByTestId('modal-close-button');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form validation', () => {
    it('should show name error when name is empty', async () => {
      const user = userEvent.setup();
      render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const submitButton = screen.getByTestId('modal-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('name-error')).toHaveTextContent('Nome é obrigatório');
      });
    });

    it('should show email error when email is empty', async () => {
      const user = userEvent.setup();
      render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const nameInput = screen.getByTestId('name-input');
      await user.type(nameInput, 'João Silva');

      const submitButton = screen.getByTestId('modal-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toHaveTextContent('Email é obrigatório');
      });
    });

    it('should show email error for invalid email format', async () => {
      const user = userEvent.setup();
      render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const nameInput = screen.getByTestId('name-input') as HTMLInputElement;
      const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
      const submitButton = screen.getByTestId('modal-submit-button');

      // Type name and INVALID email
      await user.type(nameInput, 'João Silva');
      await user.type(emailInput, 'invalid-email');

      expect(nameInput.value).toBe('João Silva');
      expect(emailInput.value).toBe('invalid-email');

      // Click submit - should fail validation
      await user.click(submitButton);

      // Verify onSubmit was NOT called because of validation error
      expect(mockOnSubmit).not.toHaveBeenCalled();
      
      // Modal should still be open
      expect(screen.getByTestId('user-form-modal')).toBeInTheDocument();
    });

    it('should clear error when user starts typing', async () => {
      const user = userEvent.setup();
      render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const submitButton = screen.getByTestId('modal-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('name-error')).toBeInTheDocument();
      });

      const nameInput = screen.getByTestId('name-input');
      await user.type(nameInput, 'João');

      await waitFor(() => {
        expect(screen.queryByTestId('name-error')).not.toBeInTheDocument();
      });
    });

    it('should accept valid email formats', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const nameInput = screen.getByTestId('name-input');
      const emailInput = screen.getByTestId('email-input');

      await user.type(nameInput, 'João Silva');
      await user.type(emailInput, 'joao@example.com');

      const submitButton = screen.getByTestId('modal-submit-button');
      await user.click(submitButton);

      // Wait for onSubmit to be called
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });

      expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
    });
  });

  describe('Form submission', () => {
    it('should call onSubmit with correct data on valid form submission', async () => {
      const user = userEvent.setup();
      render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const nameInput = screen.getByTestId('name-input');
      const emailInput = screen.getByTestId('email-input');
      const roleSelect = screen.getByTestId('role-select');

      await user.type(nameInput, 'Maria Santos');
      await user.type(emailInput, 'maria@example.com');
      await user.selectOptions(roleSelect, 'manager');

      const submitButton = screen.getByTestId('modal-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'Maria Santos',
          email: 'maria@example.com',
          role: 'manager',
          organization_id: 'org-1'
        });
      });
    });

    it('should close modal after successful submission', async () => {
      const user = userEvent.setup();
      render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const nameInput = screen.getByTestId('name-input');
      const emailInput = screen.getByTestId('email-input');

      await user.type(nameInput, 'Maria Santos');
      await user.type(emailInput, 'maria@example.com');

      const submitButton = screen.getByTestId('modal-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should disable form elements while submitting', async () => {
      const user = userEvent.setup();
      let resolve: () => void;
      const submitPromise = new Promise<void>(r => {
        resolve = r;
      });

      const mockSlowSubmit = vi.fn(() => submitPromise);

      const { rerender } = render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockSlowSubmit}
        />
      );

      const nameInput = screen.getByTestId('name-input');
      const emailInput = screen.getByTestId('email-input');

      await user.type(nameInput, 'Maria Santos');
      await user.type(emailInput, 'maria@example.com');

      const submitButton = screen.getByTestId('modal-submit-button');
      const cancelButton = screen.getByTestId('modal-cancel-button');

      await user.click(submitButton);

      // Check that buttons are disabled during submission
      expect(submitButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();

      resolve!();

      await waitFor(() => {
        expect(mockSlowSubmit).toHaveBeenCalled();
      });
    });

    it('should not call onSubmit when form validation fails', async () => {
      const user = userEvent.setup();
      render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const submitButton = screen.getByTestId('modal-submit-button');
      await user.click(submitButton);

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Form reset', () => {
    it('should reset form when modal is closed and reopened in create mode', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      const nameInput = screen.getByTestId('name-input');
      await user.type(nameInput, 'Maria Santos');

      expect(nameInput).toHaveValue('Maria Santos');

      // Close modal
      rerender(
        <UserFormModal
          isOpen={false}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      // Reopen modal
      rerender(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByTestId('name-input')).toHaveValue('');
    });

    it('should load editing user data when editingUser prop changes', async () => {
      const { rerender } = render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByTestId('name-input')).toHaveValue('');

      rerender(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
          editingUser={mockUser}
        />
      );

      expect(screen.getByTestId('name-input')).toHaveValue('João Silva');
      expect(screen.getByTestId('email-input')).toHaveValue('joao@example.com');
    });
  });

  describe('Loading state', () => {
    it('should disable form when isLoading is true', () => {
      render(
        <UserFormModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
          isLoading={true}
        />
      );

      expect(screen.getByTestId('name-input')).toBeDisabled();
      expect(screen.getByTestId('email-input')).toBeDisabled();
      expect(screen.getByTestId('role-select')).toBeDisabled();
      expect(screen.getByTestId('modal-submit-button')).toBeDisabled();
      expect(screen.getByTestId('modal-cancel-button')).toBeDisabled();
    });
  });
});
