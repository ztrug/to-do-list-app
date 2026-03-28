# 🔌 Guia de Integração Frontend ↔ Backend

## 📋 Índice
1. [Configuração Inicial](#1-configuração-inicial)
2. [Estrutura do tRPC](#2-estrutura-do-trpc)
3. [Como Fazer Requisições](#3-como-fazer-requisições)
4. [Exemplos Práticos](#4-exemplos-práticos)
5. [Tratamento de Erros](#5-tratamento-de-erros)

---

## 1. Configuração Inicial

### Passo 1: Configurar Variável de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Para desenvolvimento local no computador
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:3000

# Para testar no celular físico (use o IP da sua máquina)
# EXPO_PUBLIC_RORK_API_BASE_URL=http://192.168.1.100:3000
```

### Passo 2: Verificar Conexão do Banco de Dados

No arquivo `.env`, configure também a conexão do PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
```

### Passo 3: Iniciar o Servidor

```bash
# Instalar dependências
bun install

# Rodar migrations do Prisma
bunx prisma migrate dev

# Iniciar o servidor backend
bun run dev
```

O servidor estará rodando em `http://localhost:3000`

---

## 2. Estrutura do tRPC

### Como o tRPC Funciona

```
Frontend (React Native)  →  tRPC Client  →  HTTP Request  →  Backend (Hono)
                                                                    ↓
                                                              tRPC Router
                                                                    ↓
                                                              Procedures
                                                                    ↓
                                                              PostgreSQL
```

### Endpoints Disponíveis

Baseado em `backend/trpc/app-router.ts`:

| Endpoint | Tipo | Descrição |
|----------|------|-----------|
| `trpc.example.hi.useQuery()` | Query | Exemplo de teste |
| `trpc.auth.register.useMutation()` | Mutation | Registrar usuário |
| `trpc.auth.login.useMutation()` | Mutation | Fazer login |
| `trpc.todos.list.useQuery()` | Query | Listar todos |
| `trpc.todos.create.useMutation()` | Mutation | Criar todo |
| `trpc.todos.update.useMutation()` | Mutation | Atualizar todo |
| `trpc.todos.delete.useMutation()` | Mutation | Deletar todo |
| `trpc.categories.list.useQuery()` | Query | Listar categorias |

---

## 3. Como Fazer Requisições

### Método 1: Em Componentes React (useQuery/useMutation)

```typescript
import { trpc } from '@/lib/trpc';
import { View, Text, Button } from 'react-native';

function TodosScreen() {
  // ✅ GET - Buscar dados (auto-refresh, cache, etc)
  const todosQuery = trpc.todos.list.useQuery();

  // ✅ POST/PUT/DELETE - Modificar dados
  const createMutation = trpc.todos.create.useMutation({
    onSuccess: () => {
      // Recarrega a lista após criar
      todosQuery.refetch();
    },
    onError: (error) => {
      console.error('Erro ao criar:', error);
    },
  });

  const handleCreate = () => {
    createMutation.mutate({
      title: 'Nova tarefa',
      priority: 'urgent',
    });
  };

  // Estados automáticos do React Query
  if (todosQuery.isLoading) return <Text>Carregando...</Text>;
  if (todosQuery.error) return <Text>Erro: {todosQuery.error.message}</Text>;

  return (
    <View>
      <Text>Total: {todosQuery.data?.length}</Text>
      <Button 
        title="Criar Todo" 
        onPress={handleCreate}
        disabled={createMutation.isPending}
      />
    </View>
  );
}
```

### Método 2: Fora de Componentes React

```typescript
import { trpcClient } from '@/lib/trpc';

// Em providers, funções utilitárias, etc
async function syncTodos() {
  try {
    const todos = await trpcClient.todos.list.query();
    console.log('Todos:', todos);
    
    await trpcClient.todos.create.mutate({
      title: 'Tarefa',
      priority: 'urgent',
    });
  } catch (error) {
    console.error('Erro:', error);
  }
}
```

---

## 4. Exemplos Práticos

### Exemplo 1: Login com API

```typescript
import { trpc } from '@/lib/trpc';
import { useState } from 'react';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      console.log('Login bem-sucedido:', data);
      // Salvar token, navegar, etc
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleLogin = () => {
    loginMutation.mutate({ email, password });
  };

  return (
    <View>
      <TextInput value={email} onChangeText={setEmail} />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button 
        title={loginMutation.isPending ? 'Entrando...' : 'Entrar'}
        onPress={handleLogin}
        disabled={loginMutation.isPending}
      />
    </View>
  );
}
```

### Exemplo 2: CRUD de Todos

```typescript
function TodosList() {
  // Buscar lista
  const todosQuery = trpc.todos.list.useQuery();

  // Criar
  const createMutation = trpc.todos.create.useMutation({
    onSuccess: () => todosQuery.refetch(),
  });

  // Atualizar
  const updateMutation = trpc.todos.update.useMutation({
    onSuccess: () => todosQuery.refetch(),
  });

  // Deletar
  const deleteMutation = trpc.todos.delete.useMutation({
    onSuccess: () => todosQuery.refetch(),
  });

  const handleToggle = (id: string, completed: boolean) => {
    updateMutation.mutate({ id, completed: !completed });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id });
  };

  return (
    <FlatList
      data={todosQuery.data}
      renderItem={({ item }) => (
        <View>
          <Text>{item.title}</Text>
          <Button title="Toggle" onPress={() => handleToggle(item.id, item.completed)} />
          <Button title="Delete" onPress={() => handleDelete(item.id)} />
        </View>
      )}
    />
  );
}
```

### Exemplo 3: Context com API

```typescript
import createContextHook from '@nkzw/create-context-hook';
import { trpc } from '@/lib/trpc';

export const [TodosContext, useTodos] = createContextHook(() => {
  const todosQuery = trpc.todos.list.useQuery();
  
  const createMutation = trpc.todos.create.useMutation({
    onSuccess: () => todosQuery.refetch(),
  });

  const updateMutation = trpc.todos.update.useMutation({
    onSuccess: () => todosQuery.refetch(),
  });

  const deleteMutation = trpc.todos.delete.useMutation({
    onSuccess: () => todosQuery.refetch(),
  });

  const addTodo = async (title: string, priority: string) => {
    await createMutation.mutateAsync({ title, priority });
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    await updateMutation.mutateAsync({ id, completed: !completed });
  };

  const deleteTodo = async (id: string) => {
    await deleteMutation.mutateAsync({ id });
  };

  return {
    todos: todosQuery.data ?? [],
    isLoading: todosQuery.isLoading,
    error: todosQuery.error,
    addTodo,
    toggleTodo,
    deleteTodo,
  };
});
```

---

## 5. Tratamento de Erros

### Erro: "No base url found"

**Causa:** Faltou configurar `EXPO_PUBLIC_RORK_API_BASE_URL`

**Solução:**
```bash
# Criar .env
echo 'EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:3000' > .env

# Reiniciar o Expo
bun expo start --clear
```

### Erro: "Network request failed"

**Causa:** Backend não está rodando ou URL incorreta

**Solução:**
```bash
# Verificar se o backend está rodando
curl http://localhost:3000/api/trpc/example.hi

# Se estiver testando no celular, use o IP local
# Descobrir seu IP:
# Windows: ipconfig
# Mac/Linux: ifconfig ou ip addr show
```

### Erro: "Prisma Client not generated"

**Causa:** Precisa gerar o cliente do Prisma

**Solução:**
```bash
bunx prisma generate
bunx prisma migrate dev
```

### Erro de CORS (Web)

Se estiver testando no navegador e der erro de CORS, adicione no `backend/hono.ts`:

```typescript
import { cors } from 'hono/cors';

const app = new Hono();
app.use('*', cors());
```

---

## 🎯 Checklist de Integração

- [ ] Arquivo `.env` criado com `EXPO_PUBLIC_RORK_API_BASE_URL`
- [ ] Banco de dados PostgreSQL rodando
- [ ] `DATABASE_URL` configurada no `.env`
- [ ] `bunx prisma migrate dev` executado
- [ ] Backend rodando em `http://localhost:3000`
- [ ] Consegue acessar `http://localhost:3000/api/trpc/example.hi` no navegador
- [ ] App reiniciado com `bun expo start --clear`

---

## 📚 Recursos Úteis

- **tRPC Docs:** https://trpc.io/docs
- **React Query Docs:** https://tanstack.com/query
- **Prisma Docs:** https://www.prisma.io/docs

## 🆘 Troubleshooting

### Ver logs do backend
```bash
# No terminal onde o backend está rodando
# Todos os console.log() aparecerão aqui
```

### Ver logs do frontend
```bash
# No terminal do Expo
# Ou use o React Native Debugger
```

### Testar endpoint direto
```bash
# GET request
curl http://localhost:3000/api/trpc/example.hi

# POST request
curl -X POST http://localhost:3000/api/trpc/todos.create \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","priority":"urgent"}'
```
