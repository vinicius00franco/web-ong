# Tarefas do Projeto Frontend (React)

## Setup do Projeto
* Criar a aplicação React (SPA), preferencialmente com Vite ou Create React App.

## Estrutura de Pastas (Baseada em Componentes)
Definir a arquitetura de pastas para escalabilidade. Exemplo:

src/
├── components/
│   ├── Button/
│   │   ├── index.tsx       
│   │   └── index.css       
│   ├── Header/
│   │   ├── index.tsx
│   │   └── index.scss
│   └── Card/
│       └── index.tsx
├── pages/
│   ├── Home/
│   │   ├── index.tsx       
│   │   └── index.css       
│   └── About/
│       └── index.tsx
└── App.tsx


## Instalação de Bibliotecas
Adicionar dependências: `react-router-dom`, `axios` e `bootstrap`.

## Configuração de Estilos
Importar o CSS do Bootstrap no arquivo principal.

## Dockerização (Frontend)
* Criar um Dockerfile para o frontend (build multi-stage com Nginx).
* Adicionar o serviço ao `docker-compose.yml`.

---

# Fase 1: Autenticação e Área Restrita (ONG)

**História:** Como Usuário da ONG, posso fazer login em uma área restrita para gerenciar meus dados de forma segura.

## Regras de Negócio Aplicáveis

* **RN-TEN-01 (Segurança de Tenancy):** Uma ONG autenticada nunca deve poder visualizar ou editar dados de outra ONG.
* **RN-TEN-02 (Derivação de Tenancy):** O `organization_id` deve ser derivado exclusivamente do token/sessão do usuário autenticado no backend.
* **RN-TEN-03 (Cliente Não Confiável):** O backend nunca deve confiar no `organization_id` enviado pelo client-side (frontend).

## Tarefas:
### Gerenciamento de Estado (Autenticação)
* Criar um `AuthContext` (React Context) para armazenar o token JWT e os dados do usuário.

### Roteamento (Público/Privado)
* Configurar o `react-router-dom`.
* Criar um componente `ProtectedRoute` que verifique o `AuthContext`.
* Definir rotas públicas (ex: `/`, `/login`) e privadas (ex: `/ong/*`).

### Página de Login
* Criar um formulário de login (`/login`).
* Ao submeter, chamar o endpoint de autenticação da API.
* Salvar dados no `AuthContext` e redirecionar para a área restrita.

### Layout da Área Restrita
* Criar um componente `OngLayout` (Navbar, etc.) para as páginas restritas.

---

# Fase 2: CRUD de Produtos (ONG)

**História:** Como Usuário da ONG, posso criar, listar, editar e deletar os produtos pertencentes exclusivamente à minha organização.

## Regras de Negócio Aplicáveis

* **RN-PROD-01 (Campos Obrigatórios):** O CRUD de produtos deve gerenciar: `name`, `description`, `price` (suportar decimais), `category`, `image_url`, `stock_qty` e `weight_grams`.
* (As regras RN-TEN-01, RN-TEN-02 e RN-TEN-03 são críticas aqui para garantir que a API filtre os produtos corretamente).

## Tarefas:
### Listagem de Produtos da ONG
* Criar a página `/ong/products`.
* Chamar `GET /api/ong/products` (endpoint restrito).
* Exibir os produtos em uma tabela (Bootstrap).
    * **Nota de Segurança (Ref: RN-TEN-01, RN-TEN-02):** A API (backend) é responsável por filtrar os produtos pelo `organization_id` com base no token.

### Formulário de Produto (Reutilizável)
* Criar um componente `ProductForm` contendo todos os campos da RN-PROD-01.

### Criação de Produto
* Criar a página `/ong/products/new`.
* No submit, chamar `POST /api/ong/products`.

### Edição de Produto
* Criar a página `/ong/products/edit/[uuid]`.
* Buscar dados com `GET /api/ong/products/[uuid]`.
* No submit, chamar `PUT /api/ong/products/[uuid]`.

### Deleção de Produto
* Adicionar botão "Deletar" na listagem.
* Usar Modal (Bootstrap) de confirmação antes de chamar `DELETE /api/ong/products/[uuid]`.

---

# Fase 3: Portal Público e Busca

**História:** Como Visitante, posso visualizar o catálogo de produtos de todas as ONGs, aplicar filtros e usar uma busca inteligente.

## Regras de Negócio Aplicáveis

* **RN-PUB-01 (Catálogo Público):** A listagem principal deve ser paginada e conter produtos de todas as ONGs.
* **RN-PUB-02 (Filtros Manuais):** O portal deve permitir filtragem por categoria e faixa de preço.
* **RN-BUSCA-01 (Busca Natural):** A busca deve aceitar linguagem natural (ex: "doces até 50 reais").
* **RN-BUSCA-02 (Interpretação AI):** O sistema deve usar uma API de LLM para converter a busca natural em filtros estruturados (ex: `{ category: 'Doces', price_max: 50 }`).
* **RN-BUSCA-03 (Feedback de Busca):** O frontend deve exibir ao usuário a interpretação dos filtros aplicada pela AI (ex: "Resultados para: Categoria=Doces; Preço ≤ 50").
* **RN-BUSCA-04 (Fallback Crítico):** Se a chamada à AI falhar ou exceder o timeout, a busca deve reverter para uma busca textual simples (ex: `ILIKE`) no nome e descrição do produto.

## Tarefas:
### Catálogo de Produtos (Público)
* Criar a página inicial (`/`).
* Chamar `GET /api/public/products` para buscar a lista (Ref: RN-PUB-01).
* Renderizar os produtos (Cards Bootstrap).
* Implementar componente `Pagination` (Bootstrap).

### Filtros Manuais
* Adicionar controles (Dropdown, Input) para os filtros da RN-PUB-02.
* Refazer a chamada a `GET /api/public/products` com query params.

### Busca Inteligente (AI)
* Implementar barra de busca (`Input Group` Bootstrap).
* Chamar endpoint `GET /api/public/search` com o texto (Ref: RN-BUSCA-01).
* **Exibição da Interpretação (RN-BUSCA-03):** Exibir a interpretação dos filtros retornada pela API (usar `Alert` Bootstrap).
* **Tratamento de Fallback (RN-BUSCA-04):** O frontend deve exibir resultados normais caso a API indique que o fallback foi aplicado (ex: a API não retorna uma "interpretação").

---

# Fase 4: Carrinho e Finalização do Pedido (MVP)

**História:** Como Visitante, posso adicionar itens ao meu carrinho, revisá-los e finalizar um pedido (sem pagamento).

## Regras de Negócio Aplicáveis

* **RN-PED-01 (Persistência do Pedido):** O botão "Realizar Pedido" deve salvar um registro estruturado do pedido no banco de dados.
* **RN-PED-02 (Estrutura de Itens):** Os itens do pedido devem registrar o preço no momento da compra e o `organization_id` (para saber de qual ONG é o item).
* **RN-PED-03 (Escopo MVP):** Pagamento real e baixa de estoque imediata não são necessários nesta etapa.

## Tarefas:
### Gerenciamento de Estado (Carrinho)
* Criar um `CartContext` para gerenciar a lista de itens no carrinho (ex: `[{ product, quantity }]`).

### Interação com Carrinho
* Nos Cards de produto, adicionar botão "Adicionar ao Carrinho".
* Incluir seletor de quantidade.

### Página do Carrinho
* Criar a rota `/cart`.
* Listar itens, permitir ajustes de quantidade.
* Adicionar botão "Realizar Pedido" que chama a API para salvar o pedido (Ref: RN-PED-01, RN-PED-02).

---

# Fase 5: Logs e Observabilidade (MVP)

**História:** Como Dev, preciso que a aplicação gere logs estruturados para monitoramento e depuração.

## Regras de Negócio Aplicáveis

* **RN-LOG-01 (Logs de Requisição):** Todas as requisições devem gerar logs estruturados (JSON) contendo: `timestamp`, `rota`, `método`, `status`, `latência`, e identificadores (ex: `userId`, `organization_id` se aplicável).
* **RN-LOG-02 (Log Específico da Busca):** A Busca Inteligente deve ter um log específico contendo: `texto de entrada`, `filtros gerados pela AI`, `sucesso da AI` (boolean) e `fallback aplicado` (boolean).

## Tarefas:
### Configuração de Logger (Backend)
* Implementar um logger centralizado (ex: Winston, Monolog) para formatar logs como JSON (Ref: RN-LOG-01).

### Middleware de Log de Requisição
* Criar um middleware global no backend para capturar e logar os dados da RN-LOG-01 para todas as rotas.

### Log da Busca AI
* No serviço de busca (backend), implementar o log customizado com os campos da RN-LOG-02.