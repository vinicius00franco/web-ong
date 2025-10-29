# 🤖 AGENTS.md - Diretrizes Inteligentes de Desenvolvimento

## 🏗️ Arquitetura Modular

### Estrutura Baseada em Domínio
```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes básicos (Button, Input)
│   └── feature/        # Componentes específicos (UserCard)
├── pages/              # Páginas da aplicação
├── hooks/              # Lógica reutilizável
├── stores/             # Estado global (Zustand)
├── services/           # APIs e integrações
├── types/              # Definições TypeScript
└── utils/              # Funções utilitárias
```

## ⚡ Princípios SOLID Aplicados

### SRP - Uma Responsabilidade
- Componente = Uma função específica
- Hook customizado = Uma lógica isolada
- Store = Um domínio de dados

### OCP - Extensível, Não Modificável
- Props para customização
- Composição sobre herança
- Interfaces bem definidas

### LSP - Substituição Segura
- Contratos consistentes
- Comportamento previsível

### ISP - Interfaces Específicas
- Props mínimas necessárias
- Evitar "god components"

### DIP - Abstrações, Não Implementações
- Injeção de dependências
- Interfaces para contratos

## 🧪 TDD - Desenvolvimento Orientado a Testes

### Ciclo Inteligente: Red → Green → Refactor
1. **Red**: Teste falha (define comportamento esperado)
2. **Green**: Código mínimo funcional
3. **Refactor**: Otimização sem quebrar testes

### Pirâmide de Testes
- **70% Unit**: Componentes isolados, hooks, utils
- **20% Integration**: Fluxos entre componentes
- **10% E2E**: Jornadas críticas do usuário

### Padrão de Teste
```tsx
// Arrange → Act → Assert
describe('Component', () => {
  it('should render correctly', () => {
    const props = { title: 'Test' };
    render(<Component {...props} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

## 🧩 Composição Inteligente

### Padrões de Reutilização
- **Compound Components**: API declarativa
- **Custom Hooks**: Lógica compartilhada
- **Render Props**: Flexibilidade máxima
- **Children as Function**: Controle total

### Exemplo Prático
```tsx
// Flexível e reutilizável
<DataTable data={users}>
  {({ item, index }) => (
    <UserRow key={item.id} user={item} />
  )}
</DataTable>
```

## 🎨 Estilização Estratégica

### Bootstrap + CSS Modules
- Bootstrap: Layout, grid, componentes base
- CSS Modules: Customizações específicas
- Variáveis CSS: Temas e consistência

### Mobile-First + Performance
- Breakpoints: `sm(576px) → md(768px) → lg(992px) → xl(1200px)`
- CSS crítico inline
- Lazy loading de estilos não essenciais

## 🗄️ Estado Inteligente com Zustand

### Hierarquia de Estado
1. **Local**: `useState` para UI temporária
2. **Compartilhado**: Zustand para dados globais
3. **Servidor**: React Query para cache de API

### Store Otimizada
```typescript
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginData) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthStore>()(persist(
  (set, get) => ({
    user: null,
    isAuthenticated: false,
    login: async (credentials) => {
      const user = await authService.login(credentials);
      set({ user, isAuthenticated: true });
    },
    logout: () => set({ user: null, isAuthenticated: false })
  }),
  { name: 'auth' }
));

// Seletor otimizado
const useUser = () => useAuthStore(state => state.user);
```

### Performance com Seletores
```typescript
// ❌ Re-render desnecessário
const { user, posts, comments } = useStore();

// ✅ Re-render apenas quando user muda
const user = useStore(state => state.user);
```

## 🚀 Performance & Qualidade

### Otimizações Críticas
- **Code Splitting**: `React.lazy()` + `Suspense`
- **Memoização**: `React.memo` para componentes puros
- **Seletores**: Zustand com seletores específicos
- **Bundle Analysis**: `npm run build -- --analyze`

### TypeScript Inteligente
```typescript
// Tipos utilitários
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type ApiResponse<T> = { data: T; error?: string };

// Props com defaults
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

### Acessibilidade por Design
- Elementos semânticos sempre
- ARIA labels automáticos
- Focus management
- Contraste WCAG AA (4.5:1)

## 🔄 Fluxo de Desenvolvimento

### Metodologia Ágil
1. **Análise**: User Story → Acceptance Criteria
2. **Design**: Wireframe → Component Tree
3. **TDD**: Test → Code → Refactor
4. **Review**: Code Review → QA
5. **Deploy**: CI/CD → Monitoring

### 🌿 Estratégia de Branching
**OBRIGATÓRIO**: Para toda alteração, refatoração ou correção de erro, criar uma branch da branch atual com nome descritivo ao contexto para manter separação das mudanças.

**Padrão de nomenclatura**:
- `feature/nome-descritivo` - Novas funcionalidades
- `fix/nome-do-bug` - Correções de bugs
- `refactor/componente-alterado` - Refatorações
- `chore/tarefa-manutencao` - Tarefas de manutenção

**Exemplo**:
```bash
git checkout -b feature/user-authentication
git checkout -b fix/login-validation-error
git checkout -b refactor/user-card-component
```

### Checklist de Qualidade
- [ ] Testes passando (>80% coverage)
- [ ] TypeScript sem erros
- [ ] ESLint + Prettier aplicados
- [ ] Performance auditada
- [ ] Acessibilidade validada
- [ ] Responsividade testada

## 📋 Templates de Código

### Componente Otimizado
```tsx
interface Props {
  title: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

const Component = memo<Props>(({ title, variant = 'primary', onClick }) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
      type="button"
    >
      {title}
    </button>
  );
});

Component.displayName = 'Component';
export default Component;
```

### Hook com Performance
```tsx
const useOptimizedHook = <T>(initialData: T[]) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const addItem = useCallback((item: T) => {
    setData(prev => [...prev, item]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
  }, []);

  return useMemo(() => ({
    data,
    loading,
    addItem,
    removeItem
  }), [data, loading, addItem, removeItem]);
};
```

## 📊 Monitoramento & Evolução

### Métricas Essenciais
- **Performance**: Core Web Vitals (LCP, FID, CLS)
- **Erros**: Error Boundary + Logging
- **Usuário**: Analytics + Heatmaps
- **Bundle**: Size tracking + Tree shaking

### Versionamento Semântico
- **MAJOR**: Breaking changes
- **MINOR**: New features
- **PATCH**: Bug fixes

### Documentação Viva
- Storybook para componentes
- JSDoc para funções complexas
- README com exemplos práticos
- Changelog automatizado

---

## 🎯 Resumo Executivo

### Pilares Fundamentais
1. **Arquitetura**: Modular e escalável
2. **Qualidade**: TDD + TypeScript + ESLint
3. **Performance**: Lazy loading + Memoização + Seletores
4. **UX**: Acessibilidade + Responsividade + Loading states
5. **DX**: Hot reload + Type safety + Error boundaries

### Ferramentas Core
- **Estado**: Zustand + React Query
- **Estilo**: Bootstrap + CSS Modules
- **Teste**: Vitest + Testing Library
- **Build**: Vite + TypeScript
- **Lint**: ESLint + Prettier