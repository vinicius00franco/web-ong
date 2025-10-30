import { useState, useEffect, useCallback } from 'react';
import { configManager } from '../config/app.config';
import type { AppConfig } from '../config/app.config';

/**
 * Hook para gerenciar configuração de dados mockados
 * 
 * @example
 * ```tsx
 * const { useMockData, toggleMockData, config } = useMockConfig();
 * 
 * return (
 *   <button onClick={toggleMockData}>
 *     {useMockData ? 'Usar API Real' : 'Usar Mocks'}
 *   </button>
 * );
 * ```
 */
export const useMockConfig = () => {
  const [config, setConfig] = useState<AppConfig>(configManager.getConfig());

  useEffect(() => {
    // Atualiza estado quando configuração mudar
    const interval = setInterval(() => {
      setConfig(configManager.getConfig());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleMockData = useCallback(() => {
    const newValue = !config.useMockData;
    configManager.setUseMockData(newValue);
    setConfig(configManager.getConfig());
  }, [config.useMockData]);

  const setMockDelay = useCallback((delay: number) => {
    configManager.setMockDelay(delay);
    setConfig(configManager.getConfig());
  }, []);

  const setApiBaseUrl = useCallback((url: string) => {
    configManager.setApiBaseUrl(url);
    setConfig(configManager.getConfig());
  }, []);

  const resetConfig = useCallback(() => {
    configManager.reset();
    setConfig(configManager.getConfig());
  }, []);

  return {
    config,
    useMockData: config.useMockData,
    mockDelay: config.mockDelay,
    apiBaseUrl: config.apiBaseUrl,
    toggleMockData,
    setMockDelay,
    setApiBaseUrl,
    resetConfig,
  };
};
