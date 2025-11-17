# Guia de Deploy no Render

Este guia explica como fazer o deploy do backend no Render.

## Pré-requisitos

1. Conta no [Render](https://render.com)
2. Repositório Git (GitHub, GitLab ou Bitbucket) com o código
3. Arquivo `render.yaml` configurado (já incluído no projeto)

## Configuração Automática (Recomendado)

O projeto já possui um arquivo `render.yaml` que automatiza o deploy:

### 1. Conectar Repositório ao Render

1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique em **"New +"** → **"Blueprint"**
3. Conecte seu repositório Git
4. O Render detectará automaticamente o `render.yaml`
5. Clique em **"Apply"**

### 2. O que o Render fará automaticamente:

- Criar um Web Service para o backend
- Criar um banco PostgreSQL
- Configurar variáveis de ambiente
- Executar migrations do Prisma
- Iniciar o servidor

## Configuração Manual

Se preferir configurar manualmente:

### 1. Criar Banco de Dados PostgreSQL

1. No Render Dashboard, clique em **"New +"** → **"PostgreSQL"**
2. Nome: `todo-app-db`
3. Database: `todo_app`
4. Plano: **Starter** (grátis)
5. Clique em **"Create Database"**
6. Copie a **Internal Database URL** ou **External Database URL**

### 2. Criar Web Service

1. No Render Dashboard, clique em **"New +"** → **"Web Service"**
2. Conecte seu repositório
3. Configure:
   - **Name**: `todo-app-backend`
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     bun install && bunx prisma generate && bunx prisma migrate deploy
     ```
   - **Start Command**: 
     ```bash
     bun run server.ts
     ```

### 3. Configurar Variáveis de Ambiente

No painel do Web Service, vá em **"Environment"** e adicione:

- `DATABASE_URL`: Cole a URL do PostgreSQL (do passo 1)
- `NODE_ENV`: `production`
- `PORT`: `3000` (opcional, Render define automaticamente)

### 4. Deploy

1. Clique em **"Create Web Service"**
2. O Render iniciará o deploy automaticamente
3. Aguarde o build e deploy completarem

## Verificar Deploy

Após o deploy:

1. Acesse a URL fornecida pelo Render (ex: `https://todo-app-backend.onrender.com`)
2. Você deve ver: `{"status":"ok","message":"API is running"}`
3. Teste os endpoints tRPC: `https://todo-app-backend.onrender.com/api/trpc`

## Atualizar Frontend

Após o deploy do backend, atualize a URL da API no frontend:

```typescript
// lib/trpc.ts
const url = "https://todo-app-backend.onrender.com/api/trpc";
```

## Migrations do Prisma

O Render executa `prisma migrate deploy` automaticamente no build.

Se precisar rodar migrations manualmente:

1. No painel do Web Service, vá em **"Shell"**
2. Execute:
   ```bash
   bunx prisma migrate deploy
   ```

## Seed do Banco de Dados

Para popular o banco com dados iniciais:

1. No painel do Web Service, vá em **"Shell"**
2. Execute:
   ```bash
   bun run db:seed
   ```

## Monitoramento

- **Logs**: Acesse a aba **"Logs"** no painel do service
- **Metrics**: Veja uso de CPU, memória e requests
- **Health Checks**: Render verifica automaticamente se o serviço está online

## Troubleshooting

### Erro de Conexão com Banco

Verifique se a `DATABASE_URL` está correta e aponta para o banco PostgreSQL do Render.

### Migrations Falhando

Execute manualmente via Shell:
```bash
bunx prisma migrate reset --force
bunx prisma migrate deploy
```

### Build Falhando

Verifique os logs de build no Render. Certifique-se de que todas as dependências estão no `package.json`.

### Servidor não Iniciando

Verifique se o comando de start está correto: `bun run server.ts`

## URLs Importantes

- **Backend URL**: `https://[seu-service].onrender.com`
- **tRPC Endpoint**: `https://[seu-service].onrender.com/api/trpc`
- **Health Check**: `https://[seu-service].onrender.com/`

## Plano Gratuito

O plano gratuito do Render:
- ✅ 750 horas/mês
- ✅ PostgreSQL 256MB
- ⚠️ Serviço hiberna após 15min de inatividade (primeira request demora ~30s)

Para produção, considere o plano pago ($7/mês) que mantém o serviço sempre ativo.

## Próximos Passos

1. ✅ Deploy do backend no Render
2. ✅ Configurar variáveis de ambiente
3. ⬜ Atualizar URL da API no frontend
4. ⬜ Gerar APK com a URL de produção
5. ⬜ Testar app mobile conectado ao backend em produção
