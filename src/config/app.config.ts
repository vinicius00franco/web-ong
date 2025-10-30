/**
 * Configuração centralizada para controle de dados mockados
 * Lê variáveis de ambiente do arquivo .env
 */

export interface AppConfig {
  useMockData: boolean;
  mockDelay: number; // Simula latência de rede (ms)
  apiBaseUrl: string;
  enableLogs: boolean;
  nodeEnv: string;
}

// Lê configurações do arquivo .env
const envUseMockData = import.meta.env.VITE_USE_MOCK_DATA;
const envMockDelay = import.meta.env.VITE_MOCK_DELAY;
const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const envEnableLogs = import.meta.env.VITE_ENABLE_LOGS;
const envNodeEnv = import.meta.env.VITE_NODE_ENV;

// Configuração padrão baseada nas variáveis de ambiente
const defaultConfig: AppConfig = {
  useMockData: envUseMockData === 'true' || envUseMockData === true || true, // Fallback para true
  mockDelay: envMockDelay ? parseInt(envMockDelay as string, 10) : 500,
  apiBaseUrl: envApiBaseUrl as string || 'http://localhost:3000',
  enableLogs: envEnableLogs === 'true' || envEnableLogs === true || false,
  nodeEnv: envNodeEnv as string || 'development',
};

class ConfigManager {
  private config: AppConfig = { ...defaultConfig };

  getConfig(): AppConfig {
    return { ...this.config };
  }

  setUseMockData(useMock: boolean): void {
    this.config.useMockData = useMock;
    // Salva preferência no localStorage (sobrescreve .env temporariamente)
    localStorage.setItem('useMockData', JSON.stringify(useMock));
    this.log('Mock data configurado para:', useMock);
  }

  setMockDelay(delay: number): void {
    this.config.mockDelay = delay;
    this.log('Mock delay configurado para:', delay);
  }

  setApiBaseUrl(url: string): void {
    this.config.apiBaseUrl = url;
    this.log('API Base URL configurado para:', url);
  }

  // Restaura configuração do localStorage (sobrescreve .env se existir)
  loadFromStorage(): void {
    const savedUseMock = localStorage.getItem('useMockData');
    if (savedUseMock !== null) {
      this.config.useMockData = JSON.parse(savedUseMock);
      this.log('Configuração carregada do localStorage');
    }
  }

  // Reseta para configuração do .env
  reset(): void {
    this.config = { ...defaultConfig };
    localStorage.removeItem('useMockData');
    this.log('Configuração resetada para valores do .env');
  }

  // Log condicional baseado em enableLogs
  private log(...args: unknown[]): void {
    if (this.config.enableLogs) {
      console.log('[ConfigManager]', ...args);
    }
  }

  // Exibe configuração atual no console
  printConfig(): void {
    console.log('📋 Configuração Atual:', {
      useMockData: this.config.useMockData,
      mockDelay: this.config.mockDelay,
      apiBaseUrl: this.config.apiBaseUrl,
      enableLogs: this.config.enableLogs,
      nodeEnv: this.config.nodeEnv,
    });
  }
}

export const configManager = new ConfigManager();

// Inicializa com configurações salvas (se houver)
configManager.loadFromStorage();

// Exibe configuração no console em desenvolvimento
if (defaultConfig.nodeEnv === 'development') {
  configManager.printConfig();
  console.log('💡 Dica: Para alterar configurações, edite o arquivo .env.development');
}
