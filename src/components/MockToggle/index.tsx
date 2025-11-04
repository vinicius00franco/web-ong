import React, { useState, useEffect } from 'react';
import { configManager } from '../../config/app.config';
import './index.scss';

/**
 * Componente de desenvolvimento para alternar entre dados mockados e API real
 */
export const MockToggle: React.FC = () => {
  const [useMock, setUseMock] = useState(configManager.getConfig().useMockData);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const config = configManager.getConfig();
    setUseMock(config.useMockData);
  }, []);

  const handleToggle = () => {
    const newValue = !useMock;
    setUseMock(newValue);
    configManager.setUseMockData(newValue);
    
    // Recarrega a página para aplicar mudanças
    window.location.reload();
  };

  const handleDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const delay = parseInt(e.target.value);
    configManager.setMockDelay(delay);
  };

  // Só mostra em desenvolvimento
  if (import.meta.env.MODE === 'production') {
    return null;
  }

  return (
    <div className={`mock-toggle ${isOpen ? 'open' : ''}`}>
      <button 
        className="mock-toggle__button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Configurações de desenvolvimento"
      >
        <span>⚙️</span>
      </button>

      {isOpen && (
        <div className="mock-toggle__panel">
          <h3 className="mock-toggle__title">Dev Config</h3>
          
          <div className="mock-toggle__option">
            <label className="mock-toggle__label">
              <input
                type="checkbox"
                checked={useMock}
                onChange={handleToggle}
                className="mock-toggle__checkbox"
              />
              <span className="mock-toggle__label-text">
                Usar dados mockados
              </span>
            </label>
            <small className="mock-toggle__hint">
              {useMock ? '🟢 Mock ativo' : '🔴 API real'}
            </small>
          </div>

          {useMock && (
            <div className="mock-toggle__option">
              <label className="mock-toggle__label">
                <span className="mock-toggle__label-text">
                  Delay (ms): {configManager.getConfig().mockDelay}
                </span>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="100"
                  defaultValue={configManager.getConfig().mockDelay}
                  onChange={handleDelayChange}
                  className="mock-toggle__slider"
                />
              </label>
            </div>
          )}

          <div className="mock-toggle__info">
            <small>
              💡 Alterne entre dados fictícios (desenvolvimento) e API real
            </small>
          </div>
        </div>
      )}
    </div>
  );
};
