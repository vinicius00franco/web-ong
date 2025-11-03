import { useState, useEffect } from 'react';
import type { User } from '../../types/entities';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: Omit<User, 'id' | 'created_at'>) => Promise<void>;
  editingUser?: User | null;
  isLoading?: boolean;
}

interface FormData {
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'volunteer';
}

const INITIAL_FORM_DATA: FormData = {
  name: '',
  email: '',
  role: 'volunteer'
};

const UserFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingUser,
  isLoading = false
}: UserFormModalProps) => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or editing user changes
  useEffect(() => {
    if (isOpen) {
      if (editingUser) {
        setFormData({
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role as 'admin' | 'manager' | 'volunteer'
        });
      } else {
        setFormData(INITIAL_FORM_DATA);
      }
      setErrors({});
    }
  }, [isOpen, editingUser]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        organization_id: 'org-1' // TODO: Get from context
      });
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      // TODO: Show error toast/notification
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={handleClose}
        data-testid="modal-backdrop"
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="userFormModalLabel"
        aria-hidden="false"
        data-testid="user-form-modal"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5
                className="modal-title"
                id="userFormModalLabel"
                data-testid="modal-title"
              >
                {editingUser ? 'Editar Usuário' : 'Criar Novo Usuário'}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                disabled={isSubmitting || isLoading}
                data-testid="modal-close-button"
                aria-label="Fechar"
              />
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Name Field */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Nome *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting || isLoading}
                    placeholder="Digite o nome do usuário"
                    data-testid="name-input"
                  />
                  {errors.name && (
                    <div
                      className="invalid-feedback d-block"
                      data-testid="name-error"
                    >
                      {errors.name}
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email *
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting || isLoading}
                    placeholder="Digite o email do usuário"
                    data-testid="email-input"
                  />
                  {errors.email && (
                    <div
                      className="invalid-feedback d-block"
                      data-testid="email-error"
                    >
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Role Field */}
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    Função *
                  </label>
                  <select
                    className="form-select"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={isSubmitting || isLoading}
                    data-testid="role-select"
                  >
                    <option value="volunteer">Voluntário</option>
                    <option value="manager">Gerente</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                  disabled={isSubmitting || isLoading}
                  data-testid="modal-cancel-button"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || isLoading}
                  data-testid="modal-submit-button"
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Salvando...
                    </>
                  ) : (
                    editingUser ? 'Atualizar' : 'Criar Usuário'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserFormModal;
