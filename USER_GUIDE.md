# 🎯 Guia de Uso - Sistema de Gerenciamento de Usuários

## 🚀 Como Usar o Sistema

### 1. Acessar a Página de Usuários

Na sidebar, clique em **"Usuários"** ou navegue para `/ong/users`

### 2. Visualizar Lista de Usuários

A página exibe:
- **Breadcrumbs**: Navegação (Home > Dashboard > Usuários)
- **Estatísticas**: Total de usuários e contagem por role
- **Lista de Usuários**: Cards com informações de cada usuário
- **Filtros**: Busca por nome/email e filtro por role

### 3. Criar Novo Usuário

**Passo 1**: Clique no botão **"Novo Usuário"** (canto superior direito)

**Passo 2**: O modal abrirá com o formulário vazio

```
┌─────────────────────────────────────┐
│  Criar Novo Usuário               ✕ │
├─────────────────────────────────────┤
│                                     │
│  Nome *                             │
│  [____________________________]      │
│                                     │
│  Email *                            │
│  [____________________________]      │
│                                     │
│  Função *                           │
│  [Voluntário ▼]                     │
│     - Voluntário                    │
│     - Gerente                       │
│     - Administrador                 │
│                                     │
├─────────────────────────────────────┤
│  [Cancelar] [Criar Usuário]         │
└─────────────────────────────────────┘
```

**Passo 3**: Preencha os campos:
- **Nome**: Nome completo (obrigatório)
- **Email**: Email válido (obrigatório)
- **Função**: Selecione a função/role

**Passo 4**: Clique em **"Criar Usuário"**

**Validações Automáticas**:
- ❌ Nome vazio → Erro: "Nome é obrigatório"
- ❌ Email vazio → Erro: "Email é obrigatório"
- ❌ Email inválido → Erro: "Email inválido"
- ✅ Todos válidos → Usuário criado com sucesso

### 4. Editar Usuário

**Passo 1**: Na lista, clique em um card de usuário e procure pelo botão **"Editar"** (ou similar)

**Passo 2**: O modal abrirá em modo edição

```
┌─────────────────────────────────────┐
│  Editar Usuário                   ✕ │
├─────────────────────────────────────┤
│                                     │
│  Nome *                             │
│  [João Silva____________]           │
│                                     │
│  Email *                            │
│  [joao@example.com______]           │
│                                     │
│  Função *                           │
│  [Administrador ▼]                  │
│                                     │
├─────────────────────────────────────┤
│  [Cancelar] [Atualizar]             │
└─────────────────────────────────────┘
```

**Passo 3**: Modifique os campos desejados

**Passo 4**: Clique em **"Atualizar"**

### 5. Deletar Usuário

**Passo 1**: No card do usuário, clique no botão **"Deletar"**

**Passo 2**: Modal de confirmação aparecerá:

```
┌────────────────────────────────┐
│  Confirmar exclusão           ✕ │
├────────────────────────────────┤
│                                │
│  Tem certeza que deseja       │
│  excluir este usuário?         │
│  Esta ação não pode ser       │
│  desfeita.                     │
│                                │
├────────────────────────────────┤
│  [Cancelar] [Confirmar]        │
└────────────────────────────────┘
```

**Passo 3**: Clique em **"Confirmar"** para deletar ou **"Cancelar"** para voltar

### 6. Atualizar Lista

Clique no botão **"Atualizar"** (ícone de refresh) para recarregar a lista manualmente

## 📊 Entendendo as Estatísticas

No topo da página há 4 cards com estatísticas:

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│      5       │  │      2       │  │      1       │  │      2       │
│ Total de     │  │ Administrad. │  │   Gerentes   │  │ Voluntários  │
│ Usuários     │  │              │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

- **Total de Usuários**: Número total de usuários cadastrados
- **Administradores**: Usuários com role `admin`
- **Gerentes**: Usuários com role `manager`
- **Voluntários**: Usuários com role `volunteer`

## 🔍 Roles (Funções)

Existem 3 tipos de roles diferentes:

| Role | Descrição |
|------|-----------|
| **volunteer** | Voluntário - nível básico de acesso |
| **manager** | Gerente - acesso intermediário |
| **admin** | Administrador - acesso completo |

## ⌨️ Validação de Email

O sistema valida emails usando o padrão:
- Deve conter: `nome@dominio.extensao`
- Exemplos válidos:
  - ✅ `joao@example.com`
  - ✅ `maria.santos@org.br`
  - ✅ `usuario+tag@sub.example.co.uk`
- Exemplos inválidos:
  - ❌ `invalid-email`
  - ❌ `user@`
  - ❌ `@example.com`

## 💾 Fluxo de Dados

```
Página (UsersListPage)
    ↓
useUsers Hook
    ↓
usersService
    ↓
API/Mock Service
    ↓
Component Updates (Cards, Stats)
```

## ⚠️ Mensagens de Erro

O sistema exibe diferentes mensagens de erro:

| Erro | Causa | Solução |
|------|-------|---------|
| "Nome é obrigatório" | Campo de nome vazio | Preencha o nome |
| "Email é obrigatório" | Campo de email vazio | Preencha o email |
| "Email inválido" | Formato de email incorreto | Use formato `user@example.com` |
| Outros erros da API | Problema com servidor | Contacte o administrador |

## 🎨 Estados de Interação

### Botões
- **Habilitado**: Normal (azul ou outline)
- **Desabilitado**: Cinza, não clicável (durante loading)
- **Carregando**: Mostra spinner + "Salvando..."

### Campos de Formulário
- **Normal**: Branco/cinza
- **Erro**: Vermelho com mensagem
- **Desabilitado**: Cinza, não editável

## 🔄 Comportamento do Modal

### Abrindo
1. Overlay backdrop escurece fundo
2. Modal se anima ao abrir
3. Foco automático no primeiro campo

### Fechando
Pode ser fechado por:
- Clicando no botão ✕
- Clicando no "Cancelar"
- Clicando fora (no backdrop)
- Envio bem-sucedido

### Comportamento após Sucesso
1. Modal fecha automaticamente
2. Overlay desaparece
3. Lista é atualizada
4. Estatísticas são recalculadas

## 📱 Responsividade

O sistema funciona em:
- **Desktop**: Layout com 4 colunas de stats
- **Tablet**: Layout com 2 colunas de stats
- **Mobile**: Layout com 1 coluna de stats

## 🐛 Troubleshooting

### "Modal não fecha após criar usuário"
- Verifique se o formulário foi validado corretamente
- Procure por mensagens de erro no console (F12)

### "Lista não atualiza"
- Clique no botão "Atualizar"
- Verifique se o usuário foi realmente criado
- Procure por erros no console

### "Botões desabilitados"
- Isso é normal durante o carregamento
- Aguarde o processo completar
- Se ficar preso, recarregue a página

## 🎓 Exemplos de Uso

### Criar Administrador
```
Nome: João Silva
Email: joao@organization.com
Função: Administrador
→ Click em "Criar Usuário"
```

### Editar para Gerente
```
1. Clique em "Editar" no card
2. Mude "Função" para "Gerente"
3. Clique em "Atualizar"
```

### Deletar Usuário
```
1. Clique em "Deletar"
2. Confirme no modal
3. Usuário removido da lista
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique este guia
2. Abra o console (F12) para ver erros
3. Contacte o administrador do sistema
