# 🎭 Sistema de Dados Mockados

Sistema centralizado para gerenciamento de dados mockados com alternância entre mock e API real.

## 📁 Estrutura

```
src/
├── mocks/
│   ├── data/                          # JSONs com dados mockados
│   │   ├── products.mock.json         # 12 produtos de exemplo
│   │   ├── users.mock.json            # 3 usuários de teste
│   │   ├── organizations.mock.json    # Dados da organização
│   │   └── donations.mock.json        # Histórico de doações
│   ├── services/                      # Serviços mockados
│   │   ├── products.mock.service.ts
│   │   ├── auth.mock.service.ts
│   │   ├── donations.mock.service.ts
│   │   └── organizations.mock.service.ts
│   └── index.ts                       # Exports centralizados
├── config/
│   └── app.config.ts                  # Configuração global
├── services/                          # Serviços com suporte a mock/API
│   ├── products.service.ts
│   ├── auth.service.ts
│   └── donations.service.ts
├── hooks/
│   └── useMockConfig.ts               # Hook para gerenciar config
└── components/
    └── MockToggle/                    # Toggle visual (dev only)
        ├── index.tsx
        └── index.scss
```

## 🚀 Como Usar

### 1. Alternar entre Mock e API Real

#### Via Interface (Desenvolvimento)

Clique no botão flutuante ⚙️ no canto inferior direito da tela:
- ✅ **Checkbox ativo** = Dados mockados
- ❌ **Checkbox inativo** = API real
- 🎚️ **Slider** = Ajusta delay de latência simulada (0-2000ms)

#### Via Código

```typescript
import { configManager } from './config/app.config';

// Usar mocks
configManager.setUseMockData(true);

// Usar API real
configManager.setUseMockData(false);

// Ajustar delay
configManager.setMockDelay(1000); // 1 segundo

// Verificar configuração atual
const config = configManager.getConfig();
console.log(config.useMockData); // true ou false
```

#### Via Hook

```tsx
import { useMockConfig } from './hooks/useMockConfig';

function MyComponent() {
  const { useMockData, toggleMockData, setMockDelay } = useMockConfig();

  return (
    <div>
      <button onClick={toggleMockData}>
        {useMockData ? 'Trocar para API' : 'Trocar para Mock'}
      </button>
      <input 
        type="range" 
        min="0" 
        max="2000" 
        onChange={(e) => setMockDelay(Number(e.target.value))}
      />
    </div>
  );
}
```

### 2. Usar Serviços

Os serviços detectam automaticamente se devem usar mock ou API:

```typescript
import { productsService } from './services/products.service';
import { authService } from './services/auth.service';
import { donationsService } from './services/donations.service';

// Não precisa se preocupar se está usando mock ou API
const products = await productsService.getProducts();
const loginResult = await authService.login({ email, password });
const donations = await donationsService.getDonations();
```

### 3. Credenciais de Teste

#### Usuários Disponíveis

```json
[
  {
    "email": "admin@ong.com",
    "password": "admin123",
    "role": "admin",
    "name": "Admin Principal"
  },
  {
    "email": "maria@ong.com",
    "password": "maria123",
    "role": "manager",
    "name": "Maria Silva"
  },
  {
    "email": "joao@ong.com",
    "password": "joao123",
    "role": "volunteer",
    "name": "João Santos"
  }
]
```

## 📦 Dados Mockados Disponíveis

### Produtos (12 itens)
- Cesta Básica Completa
- Kit Higiene Pessoal
- Agasalho Infantil
- Material Escolar Completo
- Coberta de Inverno
- Kit Limpeza Doméstica
- Livros Infantis
- Calçado Esportivo
- Kit Primeiros Socorros
- Brinquedos Educativos
- Fralda Infantil Pacote
- Alimentação para Bebê

**Categorias**: Alimentos, Higiene, Vestuário, Educação, Limpeza, Saúde

### Doações (5 registros)
- Status: `pending`, `completed`, `cancelled`
- Associadas a produtos e doadores

### Organizações (1 item)
- ONG Solidária com endereço completo

## 🔧 Funcionalidades dos Mocks

### Operações CRUD Completas

```typescript
// CREATE
const newProduct = await productsService.createProduct({
  name: 'Novo Produto',
  description: 'Descrição',
  price: 100,
  category: 'Alimentos',
  image_url: 'https://...',
  stock_qty: 50,
  weight_grams: 1000
});

// READ
const products = await productsService.getProducts({ category: 'Alimentos' });
const product = await productsService.getProduct('prod-001');

// UPDATE
const updated = await productsService.updateProduct({
  id: 'prod-001',
  price: 120
});

// DELETE
await productsService.deleteProduct('prod-001');
```

### Filtros e Paginação

```typescript
const result = await productsService.getProducts({
  category: 'Educação',
  name: 'livros',
  page: 1,
  limit: 10
});

console.log(result.products);      // Array de produtos filtrados
console.log(result.total);         // Total de itens
console.log(result.totalPages);    // Total de páginas
```

### Simulação de Latência

```typescript
// Simula delay de 500ms (padrão)
configManager.setMockDelay(500);

// Simula delay de 2 segundos
configManager.setMockDelay(2000);

// Sem delay
configManager.setMockDelay(0);
```

### Persistência Local

Os dados mockados são mantidos em memória durante a sessão. Para resetar:

```typescript
import { resetAllMocks } from './mocks';

// Reseta todos os dados ao estado inicial
resetAllMocks();
```

## 🎨 Componente MockToggle

Componente visual apenas em desenvolvimento:

```tsx
import { MockToggle } from './components/MockToggle';

function App() {
  return (
    <div>
      <YourApp />
      <MockToggle /> {/* Só aparece em dev */}
    </div>
  );
}
```

### Features
- ✅ Checkbox para alternar mock/API
- 🎚️ Slider para ajustar latência
- 💾 Salva preferência no localStorage
- 🔄 Recarrega página ao alternar (garante estado limpo)
- 🚫 Não renderiza em produção

## 🧪 Testes

```typescript
import { configManager } from './config/app.config';
import { mockProductsService } from './mocks';

describe('Mock System', () => {
  beforeEach(() => {
    configManager.setUseMockData(true);
  });

  it('should use mock data when enabled', async () => {
    const products = await productsService.getProducts();
    expect(products.products.length).toBeGreaterThan(0);
  });

  it('should simulate delay', async () => {
    configManager.setMockDelay(1000);
    const start = Date.now();
    await productsService.getProducts();
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(1000);
  });
});
```

## 📝 Adicionar Novos Dados

### 1. Criar JSON de dados

```json
// src/mocks/data/categories.mock.json
[
  {
    "id": "cat-001",
    "name": "Alimentos",
    "description": "Produtos alimentícios"
  }
]
```

### 2. Criar serviço mockado

```typescript
// src/mocks/services/categories.mock.service.ts
import categoriesData from '../data/categories.mock.json';

class MockCategoriesService {
  private categories = [...categoriesData];

  async getCategories() {
    await simulateDelay();
    return this.categories;
  }

  reset() {
    this.categories = [...categoriesData];
  }
}

export const mockCategoriesService = new MockCategoriesService();
```

### 3. Criar serviço real com suporte a mock

```typescript
// src/services/categories.service.ts
import { configManager } from '../config/app.config';
import { mockCategoriesService } from '../mocks';

class CategoriesService {
  async getCategories() {
    if (configManager.getConfig().useMockData) {
      return mockCategoriesService.getCategories();
    }
    const { data } = await axios.get('/api/categories');
    return data;
  }
}

export const categoriesService = new CategoriesService();
```

### 4. Atualizar exports

```typescript
// src/mocks/index.ts
export { mockCategoriesService } from './services/categories.mock.service';

export const resetAllMocks = () => {
  // ... outros resets
  mockCategoriesService.reset();
};
```

## ⚙️ Variáveis de Ambiente

```env
# .env
VITE_API_BASE_URL=http://localhost:3000

# .env.development
VITE_API_BASE_URL=http://localhost:3000

# .env.production
VITE_API_BASE_URL=https://api.production.com
```

## 🚀 Deploy

Em produção, o `MockToggle` não é renderizado e os serviços usam automaticamente a API real (a menos que você force `useMockData = true`).

```typescript
// Forçar uso de mocks em produção (não recomendado)
configManager.setUseMockData(true);
```

## 📊 Fluxo de Decisão

```
Request → Service → Check useMockData
                    ├── true → Mock Service → Simulate Delay → Return Mock Data
                    └── false → Axios → API Real → Return Real Data
```

## 🎯 Benefícios

✅ **Desenvolvimento Independente**: Não precisa de backend rodando  
✅ **Testes Rápidos**: Dados consistentes e previsíveis  
✅ **Onboarding**: Novos devs podem rodar o projeto imediatamente  
✅ **Demos**: Apresentações sem dependências externas  
✅ **Performance**: Testa interface sem latência de rede  
✅ **Offline**: Desenvolve sem conexão com internet  

## 🔒 Segurança

⚠️ **Importante**: O `MockToggle` e credenciais de teste devem ser removidos ou desabilitados em produção.

```typescript
// Verificação automática
if (import.meta.env.MODE === 'production') {
  return null; // MockToggle não renderiza
}
```

---

**Desenvolvido com ❤️ seguindo diretrizes do AGENTS.md**
