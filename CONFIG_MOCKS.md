# 🔧 Configuração do Sistema de Mocks

Este projeto utiliza um sistema de configuração baseado em variáveis de ambiente para controlar o uso de dados mockados vs. API real.

## 📁 Arquivos de Configuração

### `.env.development` (Desenvolvimento)
Configurações usadas durante desenvolvimento (`npm run dev`)
- **Commitado no Git** ✅
- `VITE_USE_MOCK_DATA=true` - Usa dados mockados por padrão
- `VITE_MOCK_DELAY=500` - Simula latência de rede (500ms)

### `.env.production` (Produção)
Configurações usadas no build de produção (`npm run build`)
- **Commitado no Git** ✅
- `VITE_USE_MOCK_DATA=false` - Sempre usa API real
- URL da API de produção configurada

### `.env.local` (Configurações Locais) [Opcional]
Sobrescreve as configurações para o seu ambiente local
- **NÃO commitado no Git** ❌
- Use para configurações pessoais/secretas

## 🚀 Como Usar

### Desenvolvimento com Dados Mockados (Padrão)
```bash
npm run dev
```
✅ Não precisa de backend rodando  
✅ Dados vem de `/src/mocks/data/`  
✅ Ideal para desenvolvimento frontend  

### Desenvolvimento com API Real
1. Crie um arquivo `.env.local`:
```env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=http://localhost:3000/api
```
2. Certifique-se que o backend está rodando
3. Execute `npm run dev`

### Produção
```bash
npm run build
npm run preview
```
✅ Sempre usa API real (configurada em `.env.production`)

## ⚙️ Variáveis de Ambiente Disponíveis

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_USE_MOCK_DATA` | Usar dados mockados? | `true` |
| `VITE_MOCK_DELAY` | Delay simulado em ms | `500` |
| `VITE_API_BASE_URL` | URL da API | `http://localhost:3000` |
| `VITE_ENABLE_LOGS` | Ativar logs no console? | `true` |
| `VITE_NODE_ENV` | Ambiente de execução | `development` |

## 🔍 Verificar Configuração Atual

Abra o Console do navegador e procure por:
```
📋 Configuração Atual: { useMockData: true, ... }
```

## 📝 Notas Importantes

1. **Todas as variáveis devem começar com `VITE_`** - Requisito do Vite
2. **Reinicie o servidor** após alterar arquivos `.env`
3. **Valores booleanos** são strings: `"true"` ou `"false"`
4. **Não commite `.env.local`** - É para configurações pessoais

## 🛠️ Gerenciamento Programático

Você também pode alterar configurações via código:

```typescript
import { configManager } from './config/app.config';

// Alternar para usar mocks
configManager.setUseMockData(true);

// Alterar delay
configManager.setMockDelay(1000);

// Ver configuração
configManager.printConfig();

// Resetar para .env
configManager.reset();
```

---

**💡 Dica**: Para desenvolvimento rápido sem backend, mantenha `VITE_USE_MOCK_DATA=true`
