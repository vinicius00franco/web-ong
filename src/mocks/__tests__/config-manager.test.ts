import { describe, it, expect, beforeEach } from 'vitest';
import { configManager } from '../../config/app.config';

describe('Config Manager', () => {
  beforeEach(() => {
    configManager.reset();
    localStorage.clear();
  });

  describe('getConfig', () => {
    it('should return default config', () => {
      const config = configManager.getConfig();
      
      expect(config.useMockData).toBe(true);
      expect(config.mockDelay).toBe(500);
      expect(config.apiBaseUrl).toBeDefined();
    });
  });

  describe('setUseMockData', () => {
    it('should update useMockData setting', () => {
      configManager.setUseMockData(false);
      
      const config = configManager.getConfig();
      expect(config.useMockData).toBe(false);
    });

    it('should persist to localStorage', () => {
      configManager.setUseMockData(false);
      
      const stored = localStorage.getItem('useMockData');
      expect(stored).toBe('false');
    });
  });

  describe('setMockDelay', () => {
    it('should update delay setting', () => {
      configManager.setMockDelay(1000);
      
      const config = configManager.getConfig();
      expect(config.mockDelay).toBe(1000);
    });
  });

  describe('setApiBaseUrl', () => {
    it('should update API base URL', () => {
      const newUrl = 'https://api.test.com';
      configManager.setApiBaseUrl(newUrl);
      
      const config = configManager.getConfig();
      expect(config.apiBaseUrl).toBe(newUrl);
    });
  });

  describe('loadFromStorage', () => {
    it('should load config from localStorage', () => {
      localStorage.setItem('useMockData', 'false');
      
      configManager.loadFromStorage();
      
      const config = configManager.getConfig();
      expect(config.useMockData).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset to default config', () => {
      configManager.setUseMockData(false);
      configManager.setMockDelay(2000);
      
      configManager.reset();
      
      const config = configManager.getConfig();
      expect(config.useMockData).toBe(true);
      expect(config.mockDelay).toBe(500);
    });

    it('should clear localStorage', () => {
      configManager.setUseMockData(false);
      configManager.reset();
      
      const stored = localStorage.getItem('useMockData');
      expect(stored).toBeNull();
    });
  });
});
