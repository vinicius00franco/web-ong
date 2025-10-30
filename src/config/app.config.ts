/**
 * Configuração centralizada para controle de dados mockados
 */

export interface AppConfig {
  useMockData: boolean;
  mockDelay: number; // Simula latência de rede (ms)
  apiBaseUrl: string;
}

// Configuração padrão - pode ser alterada em tempo de execução
const defaultConfig: AppConfig = {
  useMockData: true, // true = usa mocks, false = usa API real
  mockDelay: 500, // 500ms de delay simulado
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
};

class ConfigManager {
  private config: AppConfig = { ...defaultConfig };

  getConfig(): AppConfig {
    return { ...this.config };
  }

  setUseMockData(useMock: boolean): void {
    this.config.useMockData = useMock;
    // Salva preferência no localStorage
    localStorage.setItem('useMockData', JSON.stringify(useMock));
  }

  setMockDelay(delay: number): void {
    this.config.mockDelay = delay;
  }

  setApiBaseUrl(url: string): void {
    this.config.apiBaseUrl = url;
  }

  // Restaura configuração do localStorage ao iniciar
  loadFromStorage(): void {
    const savedUseMock = localStorage.getItem('useMockData');
    if (savedUseMock !== null) {
      this.config.useMockData = JSON.parse(savedUseMock);
    }
  }

  // Reseta para configuração padrão
  reset(): void {
    this.config = { ...defaultConfig };
    localStorage.removeItem('useMockData');
  }
}

export const configManager = new ConfigManager();

// Inicializa com configurações salvas
configManager.loadFromStorage();
