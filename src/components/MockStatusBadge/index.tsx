import React from 'react';
import { useMockConfig } from '../../hooks/useMockConfig';
import './index.scss';

interface MockStatusBadgeProps {
  className?: string;
}

/**
 * Badge que mostra o status atual do sistema (Mock ou API Real)
 * Útil para desenvolvimento e debugging
 */
export const MockStatusBadge: React.FC<MockStatusBadgeProps> = ({ className = '' }) => {
  const { useMockData, mockDelay } = useMockConfig();

  // Não mostra em produção
  if (import.meta.env.MODE === 'production') {
    return null;
  }

  return (
    <div className={`mock-status-badge ${className}`}>
      <div className={`badge ${useMockData ? 'badge-success' : 'badge-danger'}`}>
        {useMockData ? (
          <>
            <span className="badge-icon">🎭</span>
            <span className="badge-text">Mock Mode</span>
            {mockDelay > 0 && (
              <span className="badge-delay">{mockDelay}ms</span>
            )}
          </>
        ) : (
          <>
            <span className="badge-icon">🌐</span>
            <span className="badge-text">API Mode</span>
          </>
        )}
      </div>
    </div>
  );
};
