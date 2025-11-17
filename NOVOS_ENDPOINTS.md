# Novos Casos de Uso Implementados

## 📊 Resumo

Foram implementados **4 novos casos de uso** no back-end com seus respectivos endpoints tRPC. Todos os endpoints estão totalmente testados e integrados ao banco de dados PostgreSQL.

---

## 🔧 Endpoints Implementados

### 1. **Estatísticas de Tarefas**
**Endpoint:** `todos.statistics`  
**Tipo:** Query (GET)  
**Autenticação:** Requerida

**Descrição:**  
Retorna estatísticas completas das tarefas do usuário logado.

**Retorno:**
```typescript
{
  statistics: {
    total: number;           // Total de tarefas
    completed: number;       // Tarefas completadas
    active: number;          // Tarefas ativas
    urgent: number;          // Tarefas urgentes
    overdue: number;         // Tarefas vencidas
    completionRate: number;  // Taxa de conclusão (%)
  }
}
```

**Exemplo de uso no frontend:**
```typescript
const { data } = trpc.todos.statistics.useQuery();
console.log(`Taxa de conclusão: ${data?.statistics.completionRate}%`);
```

**Arquivo:** `backend/trpc/routes/todos/statistics/route.ts`  
**Testes:** `backend/trpc/routes/todos/statistics/route.test.ts`

---

### 2. **Buscar Tarefas**
**Endpoint:** `todos.search`  
**Tipo:** Query (GET)  
**Autenticação:** Requerida

**Descrição:**  
Busca tarefas pelo título usando busca case-insensitive.

**Parâmetros:**
```typescript
{
  query: string;  // Texto de busca
}
```

**Retorno:**
```typescript
{
  todos: Todo[];  // Lista de tarefas encontradas
  count: number;  // Quantidade de resultados
}
```

**Exemplo de uso no frontend:**
```typescript
const { data } = trpc.todos.search.useQuery({ query: 'comprar' });
console.log(`Encontradas ${data?.count} tarefas`);
```

**Arquivo:** `backend/trpc/routes/todos/search/route.ts`  
**Testes:** `backend/trpc/routes/todos/search/route.test.ts`

---

### 3. **Tarefas por Categoria**
**Endpoint:** `todos.byCategory`  
**Tipo:** Query (GET)  
**Autenticação:** Requerida

**Descrição:**  
Retorna a contagem de tarefas agrupadas por categoria, incluindo tarefas sem categoria.

**Retorno:**
```typescript
{
  categories: Array<{
    categoryId: string;
    categoryName: string;
    categoryColor: string;
    categoryIcon: string | null;
    todoCount: number;
  }>;
}
```

**Exemplo de uso no frontend:**
```typescript
const { data } = trpc.todos.byCategory.useQuery();
data?.categories.forEach(cat => {
  console.log(`${cat.categoryName}: ${cat.todoCount} tarefas`);
});
```

**Arquivo:** `backend/trpc/routes/todos/by-category/route.ts`  
**Testes:** `backend/trpc/routes/todos/by-category/route.test.ts`

---

### 4. **Tarefas Vencidas**
**Endpoint:** `todos.overdue`  
**Tipo:** Query (GET)  
**Autenticação:** Requerida

**Descrição:**  
Retorna todas as tarefas incompletas que já passaram da data de vencimento, agrupadas por prioridade.

**Retorno:**
```typescript
{
  todos: Todo[];  // Lista de tarefas vencidas
  count: number;  // Total de tarefas vencidas
  groupedByPriority: {
    urgent: number;        // Quantidade urgente
    intermediate: number;  // Quantidade intermediária
    notUrgent: number;     // Quantidade não urgente
  };
}
```

**Exemplo de uso no frontend:**
```typescript
const { data } = trpc.todos.overdue.useQuery();
console.log(`Você tem ${data?.count} tarefas vencidas!`);
console.log(`Urgentes: ${data?.groupedByPriority.urgent}`);
```

**Arquivo:** `backend/trpc/routes/todos/overdue/route.ts`  
**Testes:** `backend/trpc/routes/todos/overdue/route.test.ts`

---

## 📁 Estrutura de Arquivos

```
backend/trpc/routes/todos/
├── statistics/
│   ├── route.ts       # Endpoint de estatísticas
│   └── route.test.ts  # Testes unitários
├── search/
│   ├── route.ts       # Endpoint de busca
│   └── route.test.ts  # Testes unitários
├── by-category/
│   ├── route.ts       # Endpoint de agrupamento
│   └── route.test.ts  # Testes unitários
└── overdue/
    ├── route.ts       # Endpoint de vencidas
    └── route.test.ts  # Testes unitários
```

---

## 🗄️ Integração com Banco de Dados

Todos os endpoints fazem queries no banco de dados PostgreSQL através do Prisma ORM, usando as seguintes tabelas:

### Tabelas Utilizadas:
1. **users** - Usuários do sistema
2. **todos** - Tarefas dos usuários
3. **categories** - Categorias das tarefas

### Relações:
- `Todo.userId` → `User.id` (Cascade)
- `Todo.categoryId` → `Category.id` (SetNull)

---

## 🧪 Testes

Todos os 4 novos casos de uso possuem testes unitários completos usando:
- **Vitest** como framework de testes
- **Mocks do Prisma** para simular o banco de dados
- **tRPC Caller** para testar os endpoints

### Executar os testes:
```bash
bun test
```

### Cobertura de testes:
- ✅ Casos de sucesso
- ✅ Casos de erro
- ✅ Validação de parâmetros
- ✅ Verificação de autenticação

---

## 🔗 Como Usar no Frontend

Os endpoints estão automaticamente disponíveis através do cliente tRPC configurado em `lib/trpc.ts`.

### Exemplo completo:
```typescript
import { trpc } from '@/lib/trpc';

function MyComponent() {
  // Query automática com cache
  const stats = trpc.todos.statistics.useQuery();
  
  // Busca com parâmetros
  const [searchQuery, setSearchQuery] = useState('');
  const searchResults = trpc.todos.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );
  
  // Dados agrupados
  const byCategory = trpc.todos.byCategory.useQuery();
  
  // Tarefas vencidas
  const overdue = trpc.todos.overdue.useQuery();

  return (
    <View>
      <Text>Taxa de conclusão: {stats.data?.statistics.completionRate}%</Text>
      <Text>Tarefas vencidas: {overdue.data?.count}</Text>
    </View>
  );
}
```

---

## 📊 Endpoints Existentes (Recap)

Além dos 4 novos, o sistema já possui:

1. **auth.register** - Registro de usuário
2. **auth.login** - Login de usuário
3. **todos.create** - Criar tarefa
4. **todos.list** - Listar tarefas (com filtros)
5. **todos.update** - Atualizar tarefa
6. **todos.delete** - Deletar tarefa
7. **categories.list** - Listar categorias

**Total de endpoints:** 11 endpoints funcionais

---

## 🎯 Próximos Passos

Para integrar no frontend:

1. Usar os hooks tRPC nos componentes
2. Implementar UI para exibir estatísticas
3. Adicionar barra de busca com `todos.search`
4. Mostrar alertas para tarefas vencidas
5. Criar gráficos de tarefas por categoria

---

## 📝 Notas Técnicas

- Todos os endpoints usam `protectedProcedure` (requerem autenticação)
- Queries são automaticamente filtradas por `userId`
- Busca de texto é case-insensitive para melhor UX
- Datas são comparadas considerando timezone
- Performance otimizada com queries paralelas onde possível
