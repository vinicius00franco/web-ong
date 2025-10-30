import React, { memo } from 'react';
import Card from '../Card';

interface DashboardWidgetProps {
  id: string;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleVisibility?: () => void;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  showControls?: boolean;
}

/**
 * Componente de Widget do Dashboard
 * Componente reutilizável seguindo princípios SOLID
 * - SRP: Responsável apenas por renderizar um widget
 * - OCP: Extensível via props e children
 * - LSP: Pode ser substituído por variações
 */
const DashboardWidget = memo<DashboardWidgetProps>(({
  title,
  children,
  icon,
  actions,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  showControls = false,
}) => {
  return (
    <Card className={`border-0 shadow-sm h-100 ${className}`}>
      <Card.Header className={`d-flex justify-content-between align-items-center ${headerClassName}`}>
        <div className="d-flex align-items-center">
          {icon && <span className="me-2">{icon}</span>}
          <Card.Title className="mb-0">{title}</Card.Title>
        </div>
        
        <div className="d-flex align-items-center gap-1">
          {actions}
          
          {showControls && (
            <div className="btn-group btn-group-sm" role="group">
              {onMoveUp && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onMoveUp}
                  title="Mover para cima"
                  aria-label="Mover widget para cima"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
                  </svg>
                </button>
              )}
              
              {onMoveDown && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onMoveDown}
                  title="Mover para baixo"
                  aria-label="Mover widget para baixo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
                  </svg>
                </button>
              )}
              
              {onToggleVisibility && (
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={onToggleVisibility}
                  title="Ocultar widget"
                  aria-label="Ocultar widget"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                    <path fillRule="evenodd" d="M13.646 14.354a.5.5 0 0 1-.708 0l-11-11a.5.5 0 0 1 .708-.708l11 11a.5.5 0 0 1 0 .708z"/>
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </Card.Header>
      
      <Card.Body className={bodyClassName}>
        {children}
      </Card.Body>
    </Card>
  );
});

DashboardWidget.displayName = 'DashboardWidget';

export default DashboardWidget;
