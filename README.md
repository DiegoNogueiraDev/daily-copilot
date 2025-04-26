# 🤖 Daily-Copilot

Sistema que substitui reuniões de daily stand-up. Desenvolvedores registram seus resumos diários; o serviço classifica impedimentos e exibe métricas em dashboards interativos.

## 📋 Funcionalidades

- ✅ Registro de resumos diários
- 🏷️ Classificação automática de atividades (code, tests, etc)
- 🚧 Identificação de bloqueadores
- 💡 Sugestões automáticas para resolução
- 📊 Dashboard de métricas por projeto

## 🔧 Tecnologias

- **Frontend**: Next.js 15 com TailwindCSS
- **Backend**: Next.js Route Handlers e Server Actions
- **Database**: PostgreSQL + Prisma ORM
- **Classificação**: OpenRouter com modelo Llama-4-Maverick
- **Arquitetura**: Clean Architecture com DDD-lite

## 🏗️ Arquitetura

```
┌────────────┐          HTTP          ┌──────────────────┐
│ Frontend   │  ───────────────▶     │ MCP API (Next.js)│
│ Next.js 15 │                       │  • Route Handlers │
└────────────┘                       │  • Server Actions│
       ▲ WebSocket                   ├───────────────────┤
       │                             │ Application Core  │
       │                             │  • Use Cases      │
       │                             │  • Domain Models  │
       ▼                             ├───────────────────┤
┌────────────┐   gRPC/HTTP   ┌────────────┐   Prisma   ┌────────┐
│ Dashboard  │◀──────────────│ Classifier │───────────▶│Postgres│
│  LiveView  │               │ Llama‑4    │            └────────┘
└────────────┘               └────────────┘
```

## 🚀 Como executar

### Pré-requisitos

- Node.js 18+
- PostgreSQL

### Configuração

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Configure o arquivo `.env` com suas variáveis de ambiente:
   ```
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/daily_copilot"
   OPENROUTER_API_KEY="sua-chave-api"
   ```
4. Execute as migrações do banco de dados:
   ```
   npx prisma migrate dev
   ```
5. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```
6. Acesse http://localhost:3000

## 📝 API

### Registrar Resumo

```http
POST /api/summary

{
  "userId": "UUID",
  "projectId": "UUID",
  "text": "string",
  "date": "YYYY-MM-DD"
}
```

### Listar Métricas

```http
GET /api/metrics?projectId=UUID&period=week
```

## 📅 Roadmap

1. MVP (abril/2025): registro & dashboard day/week.
2. Sprint 2: heatmap mensal + export CSV.
3. Sprint 3: notificações Slack/Jira.

## 🧪 Testes

```bash
npm run test        # Executa testes unitários
npm run test:e2e    # Executa testes end-to-end
```

## 📄 Licença

ISC

---

Desenvolvido com ❤️ pelo Time Daily-Copilot
