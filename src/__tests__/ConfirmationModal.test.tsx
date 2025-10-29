import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ConfirmationModal from '../components/ConfirmationModal/index';

describe('ConfirmationModal', () => {
  it('should call onConfirm when the confirm button is clicked', async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ConfirmationModal
        title="Confirm Deletion"
        message="Are you sure you want to delete this item?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    await userEvent.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('should call onCancel when the cancel button is clicked', async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ConfirmationModal
        title="Confirm Deletion"
        message="Are you sure you want to delete this item?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    await userEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });
});
