# GymPass API - SOLID

![Node.js](https://img.shields.io/badge/node.js-18+-green)
![TypeScript](https://img.shields.io/badge/typescript-5.9+-blue)
![Fastify](https://img.shields.io/badge/fastify-5.5+-black)
![Prisma](https://img.shields.io/badge/prisma-6.14+-darkblue)
![PostgreSQL](https://img.shields.io/badge/postgresql-latest-blue)

Uma API RESTful desenvolvida com princípios SOLID para um sistema de check-ins em academias, similar ao GymPass. A aplicação permite que usuários se cadastrem, façam check-ins em academias próximas e administradores gerenciem academias e validem check-ins.

## 🚀 Funcionalidades

### ✅ Requisitos Funcionais (RFs)

- **Usuários**
  - [x] Cadastro de usuários
  - [x] Autenticação via JWT
  - [x] Obter perfil do usuário logado
  - [x] Obter número de check-ins realizados
  - [x] Obter histórico de check-ins

- **Academias**
  - [x] Cadastro de academias (apenas administradores)
  - [x] Busca de academias por nome
  - [x] Listagem de academias próximas (até 10km)

- **Check-ins**
  - [x] Realizar check-in em uma academia
  - [x] Validação de check-ins (apenas administradores)

### 🔐 Regras de Negócio (RNs)

- [x] Usuário não pode se cadastrar com e-mail duplicado
- [x] Usuário não pode fazer 2 check-ins no mesmo dia
- [x] Usuário só pode fazer check-in se estiver próximo (100m) da academia
- [x] Check-in só pode ser validado até 20 minutos após criação
- [x] Check-in só pode ser validado por administradores
- [x] Academia só pode ser cadastrada por administradores

### ⚙️ Requisitos Não-Funcionais (RNFs)

- [x] Senhas criptografadas com bcryptjs
- [x] Dados persistidos em PostgreSQL
- [x] Listas paginadas com 20 itens por página
- [x] Usuário identificado por JWT (JSON Web Token)

## 🛠️ Stack Tecnológica

**Backend:**

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset do JavaScript
- **Fastify** - Framework web rápido e eficiente
- **Prisma** - ORM moderno para TypeScript/Node.js
- **PostgreSQL** - Banco de dados relacional

**Autenticação & Segurança:**

- **JWT** - Autenticação via tokens
- **bcryptjs** - Criptografia de senhas
- **Zod** - Validação de schemas

**Testes:**

- **Vitest** - Framework de testes unitários e E2E
- **Supertest** - Testes de integração HTTP

**DevOps:**

- **Docker** - Containerização do PostgreSQL
- **ESLint** - Linting de código
- **GitHub Actions** - CI/CD

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker e Docker Compose (para o banco de dados)

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd api-solid
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Ambiente
NODE_ENV=dev
PORT=3333

# Banco de dados
DATABASE_URL="postgresql://app:1q2w3e4r@localhost:5432/api-solid-db?schema=public"

# JWT
JWT_SECRET=sua-chave-secreta-super-segura
```

### 4. Inicie o banco de dados

```bash
docker-compose up -d
```

### 5. Execute as migrações

```bash
npx prisma migrate dev
```

### 6. Inicie o servidor

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm start
```

O servidor estará rodando em `http://localhost:3333`

## 📚 Endpoints da API

### 🔐 Autenticação

| Método  | Endpoint         | Descrição     | Autenticação |
| ------- | ---------------- | ------------- | ------------ |
| `POST`  | `/auth/login`    | Fazer login   | ❌           |
| `PATCH` | `/token/refresh` | Renovar token | ❌           |

### 👥 Usuários

| Método   | Endpoint     | Descrição         | Autenticação |
| -------- | ------------ | ----------------- | ------------ |
| `POST`   | `/users`     | Cadastrar usuário | ❌           |
| `GET`    | `/users`     | Listar usuários   | ✅ JWT       |
| `GET`    | `/users/me`  | Perfil do usuário | ✅ JWT       |
| `DELETE` | `/users/:id` | Deletar usuário   | ✅ JWT       |

### 🏋️ Academias

| Método | Endpoint       | Descrição          | Autenticação   |
| ------ | -------------- | ------------------ | -------------- |
| `POST` | `/gyms`        | Cadastrar academia | ✅ JWT + Admin |
| `GET`  | `/gyms`        | Listar academias   | ✅ JWT         |
| `GET`  | `/gyms/nearby` | Academias próximas | ✅ JWT         |

### ✅ Check-ins

| Método  | Endpoint                         | Descrição              | Autenticação   |
| ------- | -------------------------------- | ---------------------- | -------------- |
| `POST`  | `/check-ins`                     | Fazer check-in         | ✅ JWT         |
| `GET`   | `/check-ins/:userId`             | Histórico de check-ins | ✅ JWT         |
| `GET`   | `/check-ins/:userId/count`       | Contador de check-ins  | ✅ JWT         |
| `PATCH` | `/check-ins/:checkInId/validate` | Validar check-in       | ✅ JWT + Admin |

## 🧪 Testes

### Executar testes unitários

```bash
# Executar uma vez
npm test

# Modo watch
npm run test:watch

# Com coverage
npm run test:coverage
```

### Executar testes E2E

```bash
# Executar uma vez
npm run test:e2e

# Modo watch
npm run test:e2e:watch
```

## 📁 Estrutura do Projeto

```
src/
├── @types/           # Definições de tipos TypeScript
├── env/              # Configuração de variáveis de ambiente
├── fastify/          # Configuração do servidor Fastify
├── http/             # Camada HTTP
│   ├── controllers/  # Controllers das rotas
│   ├── middlewares/  # Middlewares de autenticação
│   └── routes/       # Definições das rotas
├── lib/              # Configurações de bibliotecas
├── repositories/     # Camada de acesso a dados
│   ├── in-memory/    # Repositórios em memória (testes)
│   ├── interfaces/   # Contratos dos repositórios
│   └── prisma/       # Implementações com Prisma
├── use-cases/        # Regras de negócio
│   ├── errors/       # Classes de erro customizadas
│   ├── factories/    # Factory pattern para use cases
│   └── tests/        # Testes unitários dos use cases
└── utils/            # Utilitários e helpers
```

## 🐳 Docker

### Banco de dados

O projeto inclui um `docker-compose.yml` configurado com PostgreSQL:

```bash
# Iniciar o banco
docker-compose up -d

# Parar o banco
docker-compose down

# Ver logs
docker-compose logs postgres
```

## 🔧 Scripts Disponíveis

| Script                  | Descrição                                 |
| ----------------------- | ----------------------------------------- |
| `npm run start:dev`     | Inicia o servidor em modo desenvolvimento |
| `npm run build`         | Compila o projeto para produção           |
| `npm start`             | Inicia o servidor em modo produção        |
| `npm test`              | Executa testes unitários                  |
| `npm run test:e2e`      | Executa testes end-to-end                 |
| `npm run test:watch`    | Executa testes em modo watch              |
| `npm run test:coverage` | Executa testes com coverage               |

## 📝 Exemplos de Uso

### Cadastrar usuário

```bash
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456"
  }'
```

### Fazer login

```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "123456"
  }'
```

### Listar academias próximas

```bash
curl -X GET "http://localhost:3333/gyms/nearby?latitude=-27.2092052&longitude=-49.6401091" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 Fluxo Principal - Check-in em Academia

O diagrama abaixo ilustra o fluxo mais importante da aplicação: o processo de check-in de um usuário em uma academia.

```mermaid
sequenceDiagram
    participant U as 👤 Usuário
    participant API as 🌐 API
    participant Auth as 🔐 Auth Middleware
    participant UC as 📋 Create Check-in Use Case
    participant GR as 🏪 Gym Repository
    participant CR as ✅ Check-in Repository
    participant DB as 🗄️ PostgreSQL

    U->>API: POST /check-ins
    Note over U,API: { gymId, latitude, longitude }

    API->>Auth: Verificar JWT Token
    Auth-->>API: ✅ Token válido (userId)

    API->>UC: Executar caso de uso
    Note over UC: Aplicar regras de negócio

    UC->>GR: Buscar academia por ID
    GR->>DB: SELECT gym WHERE id = gymId
    DB-->>GR: 📍 Dados da academia
    GR-->>UC: Academia encontrada

    UC->>UC: Validar distância (100m)
    Note over UC: Calcular distância entre<br/>coordenadas do usuário<br/>e da academia

    UC->>CR: Verificar check-in do dia
    CR->>DB: SELECT check-in WHERE userId<br/>AND DATE(createdAt) = TODAY
    DB-->>CR: 📋 Check-ins do dia
    CR-->>UC: Resultado da verificação

    alt ❌ Validações falharam
        UC-->>API: Erro (distância/check-in duplicado)
        API-->>U: 400 Bad Request
    else ✅ Validações passaram
        UC->>CR: Criar novo check-in
        CR->>DB: INSERT INTO check_ins
        DB-->>CR: ✅ Check-in criado
        CR-->>UC: Check-in salvo
        UC-->>API: 🎉 Check-in realizado
        API-->>U: 201 Created
    end
```

### 🔍 Regras de Negócio Aplicadas

1. **Autenticação**: Usuário deve estar logado (JWT válido)
2. **Proximidade**: Usuário deve estar a no máximo 100m da academia
3. **Unicidade**: Apenas 1 check-in por dia por usuário
4. **Academia**: Academia deve existir no sistema

### ⏱️ Validação de Check-in (Administradores)

```mermaid
flowchart TD
    A[🔧 Admin inicia validação] --> B{Check-in existe?}
    B -->|❌ Não| C[404 Not Found]
    B -->|✅ Sim| D{Dentro de 20min?}
    D -->|❌ Não| E[400 Tempo expirado]
    D -->|✅ Sim| F{Já validado?}
    F -->|✅ Sim| G[400 Já validado]
    F -->|❌ Não| H[✅ Validar check-in]
    H --> I[💾 Salvar no banco]
    I --> J[🎉 200 OK - Validado]
```

## 🏗️ Arquitetura

O projeto segue os princípios SOLID e utiliza:

- **Repository Pattern** - Abstração da camada de dados
- **Use Cases** - Encapsulamento das regras de negócio
- **Dependency Injection** - Inversão de dependências
- **Factory Pattern** - Criação de instâncias dos use cases
- **Clean Architecture** - Separação clara das responsabilidades
