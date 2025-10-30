import { memo } from 'react';
import type { DashboardWidget } from '../../hooks/useDashboardWidgets';

interface DashboardSettingsProps {
  widgets: DashboardWidget[];
  onToggleWidget: (widgetId: string) => void;
  onMoveUp: (widgetId: string) => void;
  onMoveDown: (widgetId: string) => void;
  onReset: () => void;
  onClose: () => void;
}

/**
 * Modal de configurações do dashboard
 * Permite ao usuário personalizar quais widgets visualizar e em que ordem
 */
const DashboardSettings = memo<DashboardSettingsProps>(({
  widgets,
  onToggleWidget,
  onMoveUp,
  onMoveDown,
  onReset,
  onClose
}) => {
  const sortedWidgets = [...widgets].sort((a, b) => a.order - b.order);

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
              </svg>
              Configurar Dashboard
            </h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Fechar"></button>
          </div>
          
          <div className="modal-body">
            <p className="text-muted small mb-3">
              Personalize seu dashboard selecionando quais widgets deseja visualizar e reorganize-os conforme sua preferência.
            </p>

            <div className="list-group">
              {sortedWidgets.map((widget, index) => (
                <div 
                  key={widget.id} 
                  className={`list-group-item d-flex justify-content-between align-items-center ${!widget.visible ? 'bg-light' : ''}`}
                >
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`widget-${widget.id}`}
                      checked={widget.visible}
                      onChange={() => onToggleWidget(widget.id)}
                    />
                    <label className="form-check-label" htmlFor={`widget-${widget.id}`}>
                      {widget.name}
                    </label>
                  </div>

                  <div className="btn-group btn-group-sm" role="group">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => onMoveUp(widget.id)}
                      disabled={index === 0}
                      title="Mover para cima"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => onMoveDown(widget.id)}
                      disabled={index === sortedWidgets.length - 1}
                      title="Mover para baixo"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="alert alert-info mt-3 mb-0" role="alert">
              <small>
                <strong>💡 Dica:</strong> Os widgets ocultos não serão exibidos no dashboard, mas você pode reativá-los a qualquer momento.
              </small>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-danger btn-sm" onClick={onReset}>
              Restaurar Padrão
            </button>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

DashboardSettings.displayName = 'DashboardSettings';

export default DashboardSettings;
