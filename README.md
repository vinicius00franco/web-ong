# 🌟 Web ONG - Sistema de Gestão para ONGs

Sistema web moderno e completo para gestão de ONGs, desenvolvido com React, TypeScript e Vite, seguindo princípios SOLID e TDD.

## 🎭 Sistema de Dados Mockados

Este projeto conta com um **sistema completo de dados mockados** que permite desenvolvimento e testes sem necessidade de backend!

### ⚡ Início Rápido

```bash
npm install
npm run dev
```

**🎉 Pronto!** O projeto já roda com dados mockados automaticamente.

**Login de teste:**
- Email: `admin@ong.com`
- Senha: `admin123`

### 📚 Documentação dos Mocks

- **[QUICKSTART_MOCKS.md](./QUICKSTART_MOCKS.md)** - Guia rápido de 5 minutos
- **[MOCK_SYSTEM.md](./MOCK_SYSTEM.md)** - Documentação completa do sistema

### 🔄 Alternar Mock/API

Clique no botão **⚙️** no canto inferior direito para:
- ✅ Ativar/desativar dados mockados
- 🎚️ Ajustar latência simulada (0-2000ms)
- 💾 Configuração salva no localStorage

## 🚀 Tecnologias

- **React 18** + **TypeScript**
- **Vite** - Build tool ultrarrápido
- **Bootstrap 5** - Framework CSS responsivo
- **Zustand** - Gerenciamento de estado
- **Vitest** - Framework de testes moderno
- **React Router** - Navegação SPA
- **Axios** - Cliente HTTP
- **SASS** - Pré-processador CSS

## 📁 Estrutura do Projeto

```
src/
├── mocks/                    # 🎭 Sistema de dados mockados
│   ├── data/                 # JSONs centralizados
│   │   ├── products.mock.json
│   │   ├── users.mock.json
│   │   ├── donations.mock.json
│   │   └── organizations.mock.json
│   └── services/             # Serviços mockados
├── stores/                   # 🏪 Zustand stores
│   ├── dashboardStore.ts    # Store do dashboard
│   ├── productsStore.ts     # Store de produtos
│   └── authStore.ts         # Store de autenticação
├── components/               # Componentes reutilizáveis
│   ├── Button/
│   ├── Card/
│   ├── Header/
│   ├── MockToggle/          # Toggle de desenvolvimento
│   └── MockStatusBadge/     # Badge de status
├── pages/                   # Páginas da aplicação
│   ├── Home/
│   ├── Login/
│   ├── Products/
│   └── OngDashboard.tsx
├── services/                # Serviços (auto-detectam mock/API)
│   ├── products.service.ts
│   ├── auth.service.ts
│   └── donations.service.ts
├── config/                  # Configurações
│   └── app.config.ts       # Config centralizada
├── contexts/                # Contextos React
│   └── AuthContext.tsx
├── hooks/                   # Hooks customizados
│   ├── useLocalStorage.ts
│   ├── useMockConfig.ts
│   └── useDashboard.ts     # Hook simplificado do dashboard
└── types/                   # Tipos TypeScript
    ├── product.ts
    └── entities.ts
```

## 🎯 Features Principais

### ✅ Implementadas
- ✨ Sistema completo de autenticação
- 📦 CRUD de produtos com filtros e paginação
- 🏪 **Gerenciamento de estado com Zustand**
- 🎭 **Sistema de dados mockados centralizado**
- 🔄 **Alternância mock/API em tempo real**
- 🎨 Design responsivo (mobile-first)
- ♿ Acessibilidade (WCAG AA)
- 🧪 Testes unitários e de integração (>80% coverage)
- 🔒 Rotas protegidas
- 📊 Dashboard administrativo
- 💾 Persistência com localStorage

### 🚧 Em Desenvolvimento
- 📈 Dashboard com gráficos
- 🎁 Sistema de doações completo
- 📧 Notificações por email
- 📱 PWA (Progressive Web App)

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Testes com coverage
npm run test:coverage

# Testes em watch mode
npm run test:watch

# Testes específicos do sistema de mock
npm test mock-system
```

## 🛠️ Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run test         # Roda testes
npm run test:ui      # Interface visual dos testes
npm run lint         # Executa ESLint
```

## 📦 Dados Mockados Inclusos

### 🛍️ Produtos (12 itens)
- Cesta Básica Completa
- Kit Higiene Pessoal
- Agasalho Infantil
- Material Escolar
- E muito mais...

**Categorias**: Alimentos, Higiene, Vestuário, Educação, Limpeza, Saúde

### 👥 Usuários (3 perfis)
- Admin, Manager e Volunteer
- Senhas de teste disponíveis

### 🎁 Doações (5 registros)
- Histórico completo com status

### 🏢 Organização
- Dados completos da ONG

## 🎨 Princípios de Desenvolvimento

Seguimos as diretrizes do **[AGENTS.md](./AGENTS.md)**:

- ✅ **SOLID** - Código modular e extensível
- ✅ **TDD** - Desenvolvimento orientado a testes
- ✅ **DRY** - Não repetir código
- ✅ **KISS** - Simplicidade em primeiro lugar
- ✅ **Clean Code** - Código legível e manutenível

## 🌐 API Integration

### Modo Mock (Padrão)
```typescript
import { configManager } from './config/app.config';
configManager.setUseMockData(true); // Usa dados mockados
```

### Modo API Real
```typescript
configManager.setUseMockData(false); // Usa backend real
```

### Configurar URL da API
```env
# .env
VITE_API_BASE_URL=http://localhost:3000
```

## 📖 Documentação Adicional

- **[AGENTS.md](./AGENTS.md)** - Diretrizes inteligentes de desenvolvimento
- **[MOCK_SYSTEM.md](./MOCK_SYSTEM.md)** - Sistema de dados mockados (completo)
- **[QUICKSTART_MOCKS.md](./QUICKSTART_MOCKS.md)** - Guia rápido de mocks
- **[ZUSTAND_MIGRATION.md](./ZUSTAND_MIGRATION.md)** - Guia de migração para Zustand
- **[ZUSTAND_IMPLEMENTATION_SUMMARY.md](./ZUSTAND_IMPLEMENTATION_SUMMARY.md)** - Resumo da implementação
- **[plano-agil-frontend.md](./plano-agil-frontend.md)** - Planejamento ágil

## 🤝 Contribuindo

1. Crie uma branch para sua feature: `git checkout -b feat/nova-feature`
2. Commit suas mudanças: `git commit -m 'feat: adiciona nova feature'`
3. Push para a branch: `git push origin feat/nova-feature`
4. Abra um Pull Request

### Padrão de Commits
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `refactor:` - Refatoração de código
- `test:` - Adição de testes
- `docs:` - Documentação

## 🐛 Troubleshooting

### Problema: Login não funciona
**Solução**: Verifique se está usando dados mockados (botão ⚙️)

### Problema: Produtos não aparecem
**Solução**: Resete os mocks:
```typescript
import { resetAllMocks } from './mocks';
resetAllMocks();
```

### Problema: Erro de compilação
**Solução**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📄 Licença

MIT

## 👨‍💻 Desenvolvido com

- ❤️ Paixão por código limpo
- 🧠 Princípios SOLID
- 🧪 TDD rigoroso
- 📚 Documentação clara
- 🎭 Sistema de mocks inovador

---

**⚡ Dica:** Use o sistema de mocks para desenvolvimento offline e testes rápidos!

## 🧭 Logs e Observabilidade (Fase 5 - MVP)

Este projeto emite logs estruturados (JSON) no console para facilitar monitoramento e depuração.

- Logs de requisição (RN-LOG-01): emitidos para todas as chamadas HTTP via Axios.
    - Campos: `timestamp`, `route`, `method`, `status`, `latency` (ms), `identifiers` (`userId`, `organization_id` quando disponíveis via `localStorage.user`).
    - Implementação: `src/services/axios-logger.ts` (interceptores Axios) e importado automaticamente pelos serviços.

- Log específico da Busca Inteligente (RN-LOG-02): emitido após cada busca pública.
    - Campos: `inputText`, `filters` (interpretação da AI quando existir), `aiSuccess` (boolean), `fallbackApplied` (boolean) e `timestamp`.
    - Implementação: `src/services/public-search.service.ts`.

Observação: No MVP, os logs são enviados para `console.log` como objetos serializáveis. Integrações com coletores externos (ELK/Datadog/etc.) podem ser adicionadas futuramente.
