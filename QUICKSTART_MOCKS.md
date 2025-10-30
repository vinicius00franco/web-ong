# 🚀 Quick Start - Sistema de Dados Mockados

## ▶️ Iniciar o Projeto

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar em modo desenvolvimento
npm run dev
```

## 🎭 Usar Dados Mockados (Padrão)

O projeto já vem configurado para usar dados mockados por padrão. Basta:

1. **Abrir o navegador** em `http://localhost:5173`
2. **Fazer login** com credenciais de teste:
   - Email: `admin@ong.com`
   - Senha: `admin123`

✅ **Pronto!** Você está usando dados mockados automaticamente.

### Ver/Alterar Configuração

Clique no botão **⚙️** flutuante no canto inferior direito:
- ✅ Checkbox marcado = **Dados Mockados** (não precisa de backend)
- ❌ Checkbox desmarcado = **API Real** (precisa de backend rodando)

## 🔄 Alternar para API Real

### Opção 1: Via Interface (mais fácil)
1. Clique no botão ⚙️
2. Desmarque o checkbox "Usar dados mockados"
3. Página recarrega automaticamente

### Opção 2: Via Código
```typescript
import { configManager } from './config/app.config';

// No início da aplicação ou em qualquer lugar
configManager.setUseMockData(false);
```

### Opção 3: Via localStorage (persiste)
```javascript
// No console do navegador
localStorage.setItem('useMockData', 'false');
location.reload();
```

## 📋 Credenciais de Teste

### Usuários Disponíveis (Modo Mock)

| Email | Senha | Role | Nome |
|-------|-------|------|------|
| `admin@ong.com` | `admin123` | admin | Admin Principal |
| `maria@ong.com` | `maria123` | manager | Maria Silva |
| `joao@ong.com` | `joao123` | volunteer | João Santos |

## 📦 Dados Disponíveis

### Produtos: 12 itens
- Cesta Básica, Kits de Higiene, Vestuário, Material Escolar, etc.
- **Categorias**: Alimentos, Higiene, Vestuário, Educação, Limpeza, Saúde

### Doações: 5 registros
- Status: pending, completed, cancelled

### Organização: ONG Solidária
- Dados completos com endereço

## 🧪 Testar o Sistema

```bash
# Rodar todos os testes
npm test

# Rodar testes com coverage
npm run test:coverage

# Testes específicos do sistema de mock
npm test mock-system
npm test config-manager
```

## 🎨 Ajustar Latência (Simular Rede Lenta)

No botão ⚙️, use o slider para ajustar o delay:
- **0ms** = Instantâneo
- **500ms** = Padrão (simula rede normal)
- **2000ms** = Rede lenta

Ou via código:
```typescript
configManager.setMockDelay(1000); // 1 segundo
```

## 🔧 Resetar Dados Mockados

Se você criou/editou/deletou produtos e quer voltar ao estado inicial:

```typescript
import { resetAllMocks } from './mocks';

resetAllMocks(); // Volta tudo ao estado inicial
```

## 📁 Estrutura Rápida

```
src/
├── mocks/
│   ├── data/              # 📄 JSONs com dados
│   ├── services/          # 🔧 Lógica de mock
│   └── index.ts           # 📦 Exports
├── config/
│   └── app.config.ts      # ⚙️ Configuração global
├── services/              # 🌐 Serviços (auto-detectam mock/API)
└── components/
    └── MockToggle/        # 🎛️ Toggle visual
```

## 🚨 Troubleshooting

### Problema: "Login failed" mesmo com credenciais corretas

**Solução**: Verifique se está usando dados mockados:
```typescript
console.log(configManager.getConfig().useMockData); // deve ser true
```

### Problema: Produtos não aparecem

**Solução**: Resete os mocks:
```typescript
import { resetAllMocks } from './mocks';
resetAllMocks();
location.reload();
```

### Problema: Mudanças não persistem

**Solução**: Dados mockados são mantidos apenas em memória durante a sessão. Ao recarregar a página, voltam ao estado inicial. Isso é proposital.

## 🎯 Próximos Passos

1. ✅ **Explorar a aplicação** com dados mockados
2. 📝 **Ver documentação completa** em `MOCK_SYSTEM.md`
3. 🧪 **Rodar testes** com `npm test`
4. 🔧 **Conectar ao backend** quando estiver pronto
5. 🚀 **Deploy** (mocks desabilitados automaticamente em produção)

## 💡 Dicas

- ✨ Desenvolva features sem depender do backend
- 🧪 Testes são mais rápidos com mocks
- 📊 Use delay variável para testar loading states
- 🎨 Mocks são ótimos para demos e apresentações

---

**Dúvidas?** Consulte `MOCK_SYSTEM.md` para documentação completa.
