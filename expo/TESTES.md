# Guia de Testes do Projeto

## Problemas Identificados e Soluções

### 1. Prisma Client não gerado

**Problema:** O erro `Module '"@prisma/client"' has no exported member 'PrismaClient'` indica que o Prisma Client não foi gerado.

**Solução:** Execute o seguinte comando:

```bash
bunx prisma generate
```

Este comando irá gerar os tipos do Prisma Client baseado no seu schema (`prisma/schema.prisma`).

### 2. Banco de dados não configurado

**Problema:** O arquivo `.env` não tinha a variável `DATABASE_URL` configurada.

**Solução:** Já atualizei o arquivo `.env` com uma URL de exemplo:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/todoapp?schema=public"
```

**Importante:** 
- Para rodar os testes, você NÃO precisa de um banco de dados real rodando, pois os testes usam mocks
- Para rodar o backend em produção, você precisará configurar um banco PostgreSQL real

### 3. Sistema de Mocks corrigido

**Alterações feitas:**

#### `backend/__tests__/mocks/prisma.ts`
- Removido o `beforeEach` do arquivo de mock
- Movido para o setup global dos testes

#### `backend/__tests__/setup.ts`
- Adicionado `mockReset(prisma)` no `afterEach` global
- Isso garante que os mocks sejam limpos entre cada teste

#### Testes de autenticação
- Corrigido `vi.mock('bcryptjs')` nos arquivos:
  - `backend/trpc/routes/auth/login/route.test.ts`
  - `backend/trpc/routes/auth/register/route.test.ts`
- Adicionada factory function correta para o mock do bcryptjs

#### `backend/trpc/routes/todos/overdue/route.test.ts`
- Adicionado mock faltante no teste "should only return incomplete todos"

## Como Rodar os Testes

### 1. Gerar o Prisma Client (obrigatório antes dos testes)

```bash
bunx prisma generate
```

### 2. Rodar todos os testes

```bash
bun test
```

### 3. Rodar testes em modo watch (útil para desenvolvimento)

```bash
bunx vitest
```

### 4. Rodar testes com UI interativa

```bash
bunx vitest --ui
```

## Estrutura de Testes

```
backend/
├── __tests__/
│   ├── helpers/          # Helpers para criar callers de teste
│   ├── mocks/            # Mocks compartilhados (Prisma)
│   └── setup.ts          # Configuração global dos testes
├── trpc/
│   └── routes/
│       ├── auth/         # Testes de autenticação
│       ├── todos/        # Testes de todos
│       ├── tags/         # Testes de tags
│       ├── comments/     # Testes de comentários
│       └── attachments/  # Testes de anexos
```

## Comandos Úteis

### Backend

```bash
# Gerar Prisma Client
bunx prisma generate

# Criar migração
bunx prisma migrate dev --name nome_da_migracao

# Rodar seed
bunx tsx prisma/seed.ts

# Iniciar servidor backend
bun server.ts
```

### Testes

```bash
# Rodar todos os testes
bun test

# Rodar testes específicos
bunx vitest backend/trpc/routes/todos

# Rodar com coverage
bunx vitest --coverage
```

## Status Atual dos Testes

Após as correções feitas:

✅ **Corrigido:**
- Sistema de mocks do Prisma
- Mock do bcryptjs
- Setup global dos testes
- Teste "should only return incomplete todos" no overdue

⚠️ **Próximo passo:**
- Execute `bunx prisma generate` para gerar o Prisma Client
- Depois execute `bun test` novamente

## Integração Contínua

Se você estiver usando CI/CD, adicione no seu pipeline:

```yaml
# Exemplo para GitHub Actions
- name: Generate Prisma Client
  run: bunx prisma generate

- name: Run tests
  run: bun test
```

## Troubleshooting

### Erro: "Cannot find module '@prisma/client'"

**Solução:** Execute `bunx prisma generate`

### Erro: "Expected this to be instanceof Mock"

**Solução:** 
- Verifique se você está importando o mock correto: `import { prisma } from '@/backend/__tests__/mocks/prisma'`
- Verifique se o `vi.mock('@/backend/lib/prisma')` está configurado no início do arquivo de teste

### Testes falhando com "undefined is not an object"

**Solução:**
- Certifique-se de mockar o retorno antes de chamar a função
- Exemplo: `prisma.todo.findMany.mockResolvedValue([])`

## Próximas Melhorias

1. **Adicionar testes de integração**
   - Testar fluxos completos de usuário
   - Testar interação entre múltiplos endpoints

2. **Melhorar coverage**
   - Adicionar testes para casos edge
   - Testar todos os caminhos de erro

3. **Adicionar testes E2E**
   - Usar Detox ou similar para testar o app completo
   - Testar navegação e fluxos de UI

4. **Performance tests**
   - Testar queries complexas
   - Verificar N+1 queries
