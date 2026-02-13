---


# GitHub Shoppers — Full Stack Application

Aplicação Full Stack desenvolvida com **Node.js, TypeScript, PostgreSQL e React**, implementando um sistema de catálogo e compras com decremento atômico de estoque, autenticação JWT e integração externa com a GitHub API.

O projeto foi construído utilizando práticas modernas de engenharia de software, arquitetura em camadas e desenvolvimento assistido por IA (AI-Assisted Development).

---

# Visão Geral

O sistema permite:

- Cadastro e autenticação de usuários via JWT
- Criação e listagem de itens de catálogo
- Registro de compras com decremento atômico de estoque
- Integração com GitHub API para identificar comprador
- Interface web funcional em React
- Testes automatizados de integração
- Arquitetura modular e escalável

---

# Arquitetura Geral

Arquitetura full stack dividida em duas aplicações independentes:

```

github-shoppers/

backend/     → API REST (Node.js + TypeScript + PostgreSQL)
frontend/    → Interface Web (React + Vite + Ant Design)

```

Fluxo:

```

Frontend (React)
↓ HTTP
Backend API (Express)
↓
Service Layer
↓
Repository Layer
↓
PostgreSQL (Supabase)
↓
GitHub API (integração externa)

```

---

# Stack Tecnológica

## Backend

- Node.js 22+
- TypeScript
- Express
- PostgreSQL (Supabase)
- Knex (migrations)
- pg

## Frontend

- React 18
- TypeScript
- Vite
- Ant Design
- React Router

## Segurança

- JWT
- bcrypt

## Testes

- Vitest
- Supertest

## Validação

- Zod

## Integração externa

- GitHub API

---

# Estrutura do Projeto

```

github-shoppers/

backend/
│
├── src/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── routes/
│   ├── middlewares/
│   ├── infra/
│   ├── db/
│   ├── tests/
│   ├── app.ts
│   └── server.ts
│
└── package.json

frontend/
│
├── src/
│   ├── api/
│   ├── auth/
│   ├── pages/
│   ├── App.tsx
│   └── main.tsx
│
└── package.json

```

---

# Banco de Dados

PostgreSQL hospedado no Supabase.

## usuarios

```

id
email
password_hash
created_at
updated_at

```

## itens

```

id
nome
preco
qtd_atual
created_at
updated_at

```

## compras

```

id
item_id
comprador_github_login
created_at

```

---

# Execução do Projeto

## 1. Backend

Entrar na pasta backend:

```bash
cd backend
```

Instalar dependências:

```bash
npm install
```

Criar arquivo `.env`:

```env
PORT=3001

DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME

JWT_SECRET=uma_string_segura
JWT_EXPIRES_IN=7d

NODE_ENV=development
```

Executar migrations:

```bash
npm run migrate:latest
```

Iniciar servidor:

```bash
npm run dev
```

Servidor disponível em:

```
http://localhost:3001
```

Health check:

```bash
curl http://localhost:3001/health
```

---

## 2. Frontend

Entrar na pasta frontend:

```bash
cd frontend
```

Instalar dependências:

```bash
npm install
```

Executar:

```bash
npm run dev
```

Frontend disponível em:

```
http://localhost:5173
```

O frontend utiliza proxy configurado no Vite para comunicar com o backend:

```
/auth    → localhost:3001
/itens   → localhost:3001
/compras → localhost:3001
```

---

# Fluxo de Uso

1. Criar conta (Register)
2. Fazer login
3. Criar itens no catálogo
4. Comprar item
5. Ver histórico de compras

---

# Endpoints Backend

## Auth

POST /auth/register
POST /auth/login

## Itens

GET /itens
POST /itens

## Compras

POST /compras
GET /compras

---

# Regra Crítica: Decremento Atômico de Estoque

Implementado com operação atômica SQL:

```sql
UPDATE itens
SET qtd_atual = qtd_atual - 1
WHERE id = $1 AND qtd_atual > 0
RETURNING *
```

Garantias:

- consistência
- integridade
- ausência de race conditions

Se não houver estoque:

HTTP 409

---

# Integração com GitHub API

Endpoint utilizado:

```
https://api.github.com/users
```

Seleciona usuário aleatório como comprador.

---

# Testes Automatizados

Executar:

```bash
npm test
```

Cobertura:

- autenticação
- proteção JWT
- criação de item
- compra com decremento de estoque
- erro 409
- join correto em GET /compras

Todos os testes são testes reais de integração.

---

# Segurança

Implementado:

- hash de senha com bcrypt
- autenticação JWT
- validação com Zod
- middleware de autenticação
- tratamento centralizado de erros

---

# Frontend

Interface construída com React e Ant Design.

Funcionalidades:

- Registro de usuário
- Login
- Listagem de itens
- Criação de itens
- Compra de itens
- Visualização de compras
- Controle de autenticação via JWT

---

# Observabilidade

Sistema implementa:

- logs estruturados
- request_id por requisição
- health check de banco

---

# Desenvolvimento Assistido por IA

O desenvolvimento utilizou AI-Assisted Development com ChatGPT para:

- definição de arquitetura
- implementação incremental
- validação de padrões
- criação de testes automatizados
- revisão estrutural

Metodologia:

- decomposição em milestones
- validação incremental
- foco em consistência transacional

---

# Características Production-Ready

- arquitetura em camadas
- migrations versionadas
- autenticação segura
- tratamento de erros estruturado
- testes automatizados
- integração externa resiliente
- frontend desacoplado

---

# Autor

Desenvolvido como parte de avaliação técnica para vaga de Desenvolvedor Full Stack AI Code.

Diogo Bispo

```

```
