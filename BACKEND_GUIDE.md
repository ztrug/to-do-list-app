# 📚 Guia do Backend - Todo App

## 📁 Estrutura do Backend

```
backend/
├── trpc/                         # API tRPC
│   ├── routes/                   # Rotas organizadas por domínio
│   │   ├── auth/                # Autenticação
│   │   │   ├── register/
│   │   │   │   ├── route.ts     # Lógica de registro
│   │   │   │   └── route.test.ts # Testes
│   │   │   └── login/
│   │   │       ├── route.ts     # Lógica de login
│   │   │       └── route.test.ts # Testes
│   │   ├── todos/               # Gerenciamento de tarefas
│   │   │   ├── create/
│   │   │   │   ├── route.ts
│   │   │   │   └── route.test.ts
│   │   │   ├── list/
│   │   │   │   ├── route.ts
│   │   │   │   └── route.test.ts
│   │   │   ├── update/
│   │   │   │   └── route.ts
│   │   │   └── delete/
│   │   │       └── route.ts
│   │   └── categories/          # Categorias
│   │       └── list/
│   │           └── route.ts
│   ├── app-router.ts            # Router principal (registra todas as rotas)
│   └── create-context.ts        # Contexto tRPC (auth, prisma)
├── lib/
│   └── prisma.ts                # Cliente Prisma singleton
├── __tests__/
│   ├── mocks/
│   │   └── prisma.ts            # Mock do Prisma para testes
│   └── helpers/
│       └── trpc-caller.ts       # Helper para criar caller nos testes
└── hono.ts                      # Servidor HTTP (Hono)
```

## 🗄️ Banco de Dados PostgreSQL

### 3 Tabelas Principais:

#### 1. **users** (Usuários)
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  how_found TEXT NOT NULL,
  profile_photo TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. **todos** (Tarefas)
```sql
CREATE TABLE todos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT NOT NULL,
  due_date TIMESTAMP,
  notification_id TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. **categories** (Categorias)
```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 Casos de Uso Implementados

### 1. **Registro de Usuário**
- **Arquivo**: `backend/trpc/routes/auth/register/route.ts`
- **Endpoint**: `auth.register`
- **Tipo**: Mutation
- **Input**:
  ```typescript
  {
    email: string;
    password: string;
    name: string;
    age: number;
    howFound: string;
  }
  ```
- **Output**:
  ```typescript
  {
    success: boolean;
    user: {
      id: string;
      email: string;
      name: string;
      age: number;
      howFound: string;
      profilePhoto: string | null;
      createdAt: Date;
    };
    token: string;
  }
  ```
- **Lógica**:
  1. Verifica se email já existe
  2. Criptografa senha com bcrypt
  3. Cria usuário no banco
  4. Retorna dados do usuário e token

### 2. **Login**
- **Arquivo**: `backend/trpc/routes/auth/login/route.ts`
- **Endpoint**: `auth.login`
- **Tipo**: Mutation
- **Input**:
  ```typescript
  {
    email: string;
    password: string;
  }
  ```
- **Output**:
  ```typescript
  {
    success: boolean;
    user: { ... };
    token: string;
  }
  ```
- **Lógica**:
  1. Busca usuário por email
  2. Compara senha com bcrypt
  3. Retorna dados e token

### 3. **Criar Tarefa**
- **Arquivo**: `backend/trpc/routes/todos/create/route.ts`
- **Endpoint**: `todos.create`
- **Tipo**: Mutation (protegido)
- **Input**:
  ```typescript
  {
    title: string;
    priority: "urgent" | "intermediate" | "not-urgent";
    dueDate?: string; // ISO 8601
    categoryId?: string;
  }
  ```
- **Output**:
  ```typescript
  {
    success: boolean;
    todo: {
      id: string;
      title: string;
      completed: boolean;
      priority: string;
      dueDate: Date | null;
      userId: string;
      categoryId: string | null;
      category: Category | null;
      createdAt: Date;
      updatedAt: Date;
    };
  }
  ```

### 4. **Listar Tarefas**
- **Arquivo**: `backend/trpc/routes/todos/list/route.ts`
- **Endpoint**: `todos.list`
- **Tipo**: Query (protegido)
- **Input**:
  ```typescript
  {
    filter?: "all" | "active" | "completed";
    priorityFilter?: "all" | "urgent" | "intermediate" | "not-urgent";
  }
  ```
- **Output**:
  ```typescript
  {
    todos: Todo[];
  }
  ```
- **Lógica**:
  1. Filtra por userId (usuário autenticado)
  2. Aplica filtros de status e prioridade
  3. Ordena por data de criação (desc)
  4. Inclui dados da categoria

### 5. **Atualizar Tarefa**
- **Arquivo**: `backend/trpc/routes/todos/update/route.ts`
- **Endpoint**: `todos.update`
- **Tipo**: Mutation (protegido)

### 6. **Deletar Tarefa**
- **Arquivo**: `backend/trpc/routes/todos/delete/route.ts`
- **Endpoint**: `todos.delete`
- **Tipo**: Mutation (protegido)

## 🧪 Testes Unitários

### Como Funcionam os Testes

Os testes usam **mocks** do Prisma, **não acessam o banco de dados real**.

#### 1. **Mock do Prisma**
```typescript
// backend/__tests__/mocks/prisma.ts
import { mockDeep } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';

export const prisma = mockDeep<PrismaClient>();
```

#### 2. **Exemplo de Teste**
```typescript
// backend/trpc/routes/auth/register/route.test.ts
import { prisma } from '@/backend/__tests__/mocks/prisma';
import { appRouter } from '@/backend/trpc/app-router';

it('should register a new user', async () => {
  // Mock do comportamento do Prisma
  prisma.user.findUnique.mockResolvedValue(null);
  prisma.user.create.mockResolvedValue(mockUser);

  // Criar caller
  const caller = appRouter.createCaller({
    req: {} as any,
    prisma,
    userId: null,
  });

  // Executar mutation
  const result = await caller.auth.register({
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    age: 25,
    howFound: 'Search',
  });

  // Verificar resultado
  expect(result.success).toBe(true);
  expect(result.user.email).toBe('test@example.com');
});
```

### Rodar Testes
```bash
bun test
```

### Cobertura de Testes
- ✅ Registro de usuário (sucesso e erro)
- ✅ Login (sucesso, usuário não encontrado, senha incorreta)
- ✅ Criar tarefa (com e sem campos opcionais)
- ✅ Listar tarefas (todos, filtro por status, filtro por prioridade)

## 🔐 Autenticação

### Sistema de Token Simples

1. **Login/Registro**: Retorna `token` (userId)
2. **Frontend**: Envia token no header
   ```typescript
   headers: {
     'Authorization': 'Bearer {token}'
   }
   ```
3. **Backend**: Middleware `protectedProcedure` valida token
   ```typescript
   // backend/trpc/create-context.ts
   export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
     if (!ctx.userId) {
       throw new TRPCError({ code: 'UNAUTHORIZED' });
     }
     return next({ ctx: { ...ctx, userId: ctx.userId } });
   });
   ```

## 📦 Comandos Úteis

### Prisma
```bash
# Gerar cliente Prisma
bun run db:generate

# Criar migration
bun run db:migrate

# Popular banco com dados iniciais
bun run db:seed

# Abrir Prisma Studio (GUI)
bun run db:studio
```

### Testes
```bash
# Rodar todos os testes
bun test

# Rodar testes em modo watch
bun test --watch

# Rodar testes com UI
bun test --ui
```

## 🔄 Fluxo de Dados

```
Frontend (React Native)
    ↓
tRPC Client (lib/trpc.ts)
    ↓
HTTP Request → Backend (Hono)
    ↓
tRPC Router (backend/trpc/app-router.ts)
    ↓
Route Handler (backend/trpc/routes/.../route.ts)
    ↓
Prisma Client (backend/lib/prisma.ts)
    ↓
PostgreSQL Database
```

## 📝 Exemplo de Uso no Frontend

```typescript
import { trpc } from '@/lib/trpc';

// Em um componente React
function MyComponent() {
  // Query (GET)
  const todosQuery = trpc.todos.list.useQuery({
    filter: 'active',
    priorityFilter: 'urgent',
  });

  // Mutation (POST/PUT/DELETE)
  const createTodoMutation = trpc.todos.create.useMutation({
    onSuccess: () => {
      todosQuery.refetch();
    },
  });

  const handleCreate = () => {
    createTodoMutation.mutate({
      title: 'Nova tarefa',
      priority: 'urgent',
      dueDate: new Date().toISOString(),
    });
  };

  return (
    <View>
      {todosQuery.data?.todos.map(todo => (
        <Text key={todo.id}>{todo.title}</Text>
      ))}
      <Button onPress={handleCreate} title="Criar" />
    </View>
  );
}
```

---

**Dúvidas?** Consulte a documentação do [Prisma](https://www.prisma.io/docs) e [tRPC](https://trpc.io/docs)
