# 🤖 AGENTS.md - Diretrizes Inteligentes de Desenvolvimento

## 📁 1. Arquitetura e Estrutura

### 1.1 Estrutura Baseada em Domínio
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

## 🎯 2. Princípios SOLID Aplicados

### 2.1 SRP - Responsabilidade Única
- Componente = Uma função específica
- Hook customizado = Uma lógica isolada
- Store = Um domínio de dados

### 2.2 OCP - Aberto para Extensão, Fechado para Modificação
- Props para customização
- Composição sobre herança
- Interfaces bem definidas

### 2.3 LSP - Substituição de Liskov
- Contratos consistentes
- Comportamento previsível

### 2.4 ISP - Segregação de Interfaces
- Props mínimas necessárias
- Evitar "god components"

### 2.5 DIP - Inversão de Dependências
- Abstrações, não implementações
- Injeção de dependências
- Interfaces para contratos

## � 3. Componentes e Composição

### 3.1 Padrões de Reutilização
- **Compound Components**: API declarativa
- **Custom Hooks**: Lógica compartilhada
- **Render Props**: Flexibilidade máxima
- **Children as Function**: Controle total

### 3.2 Diretriz Obrigatória de Composição

#### ⚠️ REGRA: Composição de Componentes Reutilizáveis
**Sempre implementar código através de composição de vários componentes reutilizáveis.**

#### Princípios Fundamentais
- **Composição sobre Herança**: Combinar componentes pequenos vs. hierarquias complexas
- **Componentes Atômicos**: Criar básicos (botões, inputs, cards) para combinação
- **Flexibilidade Máxima**: Customização via props e children
- **Reutilização Sistemática**: Design para múltiplos contextos

#### Padrão de Implementação
```tsx
// ❌ Evitar: Componente monolítico
const UserProfile = ({ user }) => (
  <div className="profile">
    <img src={user.avatar} alt={user.name} />
    <h2>{user.name}</h2>
    <p>{user.email}</p>
    <button>Editar</button>
  </div>
);

// ✅ Recomendado: Composição reutilizável
const UserProfile = ({ user, onEdit }) => (
  <Card>
    <Avatar src={user.avatar} alt={user.name} />
    <UserInfo name={user.name} email={user.email} />
    <Button onClick={onEdit}>Editar</Button>
  </Card>
);
```

#### Benefícios da Composição
- **Manutenibilidade**: Alterações isoladas em componentes específicos
- **Testabilidade**: Testes unitários simples e focados
- **Reutilização**: Uso em diferentes contextos
- **Performance**: Otimizações independentes
- **Consistência**: Padrões visuais uniformes

## 🗄️ 4. Gerenciamento de Estado

### 4.1 Hierarquia de Estado
1. **Local**: `useState` para UI temporária
2. **Compartilhado**: Zustand para dados globais
3. **Servidor**: React Query para cache de API

### 4.2 Store Otimizada com Zustand
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
      const user: User = await authService.login(credentials);
      set({ user, isAuthenticated: true });
    },
    logout: () => set({ user: null, isAuthenticated: false })
  }),
  { name: 'auth' }
));

// Seletor otimizado
const useUser = () => useAuthStore(state => state.user);
```

### 4.3 Performance com Seletores
```typescript
// ❌ Re-render desnecessário
const { user, posts, comments } = useStore();

// ✅ Re-render apenas quando necessário
const user = useStore(state => state.user);
```

## 🎨 5. Estilização Estratégica

### 5.1 Bootstrap + CSS Modules
- **Bootstrap**: Layout, grid, componentes base
- **CSS Modules**: Customizações específicas
- **Variáveis CSS**: Temas e consistência

### 5.2 Mobile-First + Performance
- **Breakpoints**: `sm(576px) → md(768px) → lg(992px) → xl(1200px)`
- **CSS crítico**: Inline para performance
- **Lazy loading**: Estilos não essenciais

## 🧪 6. Testes e Qualidade

### 6.1 TDD - Desenvolvimento Orientado a Testes

#### Ciclo Red → Green → Refactor
1. **Red**: Teste falha (define comportamento esperado)
2. **Green**: Código mínimo funcional
3. **Refactor**: Otimização sem quebrar testes

#### Pirâmide de Testes
- **70% Unit**: Componentes isolados, hooks, utils
- **20% Integration**: Fluxos entre componentes
- **10% E2E**: Jornadas críticas do usuário

### 6.2 Padrão de Teste
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

## 🚀 7. Performance e Otimizações

### 7.1 Otimizações Críticas
- **Code Splitting**: `React.lazy()` + `Suspense`
- **Memoização**: `React.memo` para componentes puros
- **Seletores**: Zustand com seletores específicos
- **Bundle Analysis**: `npm run build -- --analyze`

### 7.2 TypeScript Inteligente
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

### 7.3 Acessibilidade por Design
- **Elementos semânticos**: Sempre usar tags apropriadas
- **ARIA labels**: Automáticos quando necessário
- **Focus management**: Navegação por teclado
- **Contraste**: WCAG AA (4.5:1) mínimo

## 🔄 8. Fluxo de Desenvolvimento

### 8.1 Metodologia Ágil
1. **Análise**: User Story → Acceptance Criteria
2. **Design**: Wireframe → Component Tree
3. **TDD**: Test → Code → Refactor
4. **Review**: Code Review → QA
5. **Deploy**: CI/CD → Monitoring

### 8.2 Estratégia de Branching

#### ⚠️ REGRA OBRIGATÓRIA: Branch por Alteração
**Sempre criar nova branch antes de qualquer alteração de código.**

#### Casos Aplicáveis
- ✅ Novas funcionalidades (`feat/`)
- ✅ Correções de bugs (`fix/`)
- ✅ Refatorações (`refactor/`)
- ✅ Manutenção (`chore/`)

#### Padrão de Nomenclatura
- `feat/nome-descritivo` - Novas funcionalidades
- `fix/nome-do-bug` - Correções de bugs
- `refactor/componente-alterado` - Refatorações
- `chore/tarefa-manutencao` - Manutenção

#### Fluxo Obrigatório
```bash
# 1. Criar branch específica
git checkout -b feat/user-authentication

# 2. Commits descritivos
git add .
git commit -m "feat: implement user authentication flow"

# 3. Push da branch
git push origin feat/user-authentication
```

#### ❌ PROIBIDO
- Commits diretos na main/master
- Branches genéricas (ex: "test", "temp")

### 8.3 Checklist de Qualidade
- [ ] Testes passando (>80% coverage)
- [ ] TypeScript sem erros
- [ ] ESLint + Prettier aplicados
- [ ] Performance auditada
- [ ] Acessibilidade validada
- [ ] Responsividade testada

## 📋 9. Templates e Padrões de Código

### 9.1 Componente Otimizado
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

### 9.2 Hook com Performance
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

## 📊 10. Monitoramento e Evolução

### 10.1 Métricas Essenciais
- **Performance**: Core Web Vitals (LCP, FID, CLS)
- **Erros**: Error Boundary + Logging
- **Usuário**: Analytics + Heatmaps
- **Bundle**: Size tracking + Tree shaking

### 10.2 Versionamento Semântico
- **MAJOR**: Breaking changes
- **MINOR**: New features
- **PATCH**: Bug fixes

### 10.3 Documentação Viva
- **Storybook**: Para componentes
- **JSDoc**: Funções complexas
- **README**: Exemplos práticos
- **Changelog**: Automatizado

---

## 🎯 11. Resumo Executivo

### 11.1 Pilares Fundamentais
1. **Arquitetura**: Modular e escalável
2. **Qualidade**: TDD + TypeScript + ESLint
3. **Performance**: Lazy loading + Memoização + Seletores
4. **UX**: Acessibilidade + Responsividade + Loading states
5. **DX**: Hot reload + Type safety + Error boundaries

### 11.2 Stack Tecnológica Core
- **Estado**: Zustand + React Query
- **Estilo**: Bootstrap + CSS Modules
- **Testes**: Vitest + Testing Library
- **Build**: Vite + TypeScript
- **Lint**: ESLint + Prettier