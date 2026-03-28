# Integração Frontend-Backend

## Configuração

### 1. Variável de Ambiente

O frontend precisa de uma variável de ambiente para saber onde está o backend. Crie um arquivo `.env` na raiz do projeto com:

```env
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:3000
```

**Importante:**
- Para desenvolvimento local: `http://localhost:3000`
- Para o backend no Render: `https://seu-app.onrender.com`
- Para testar no dispositivo móvel com backend local: Use o IP da sua máquina, ex: `http://192.168.1.100:3000`

### 2. Como Funciona a Autenticação

O sistema usa tokens JWT para autenticação:

1. **Login/Registro**: Quando o usuário faz login ou se registra, o backend retorna um token
2. **Armazenamento**: O token é salvo no AsyncStorage com a chave `@auth_token`
3. **Requisições**: Todas as requisições ao backend incluem automaticamente o token no header `Authorization: Bearer {token}`
4. **Validação**: O backend valida o token em todas as rotas protegidas

### 3. Estrutura de Integração

#### AuthContext (`app/contexts/AuthContext.tsx`)
- **Responsabilidades:**
  - Login via `trpc.auth.login.useMutation()`
  - Registro via `trpc.auth.register.useMutation()`
  - Armazenamento do token e dados do usuário
  - Logout (remove token e dados)

#### TodosContext (`app/contexts/TodosContext.tsx`)
- **Responsabilidades:**
  - Listar todos via `trpc.todos.list.useQuery()`
  - Criar todo via `trpc.todos.create.useMutation()`
  - Atualizar todo via `trpc.todos.update.useMutation()`
  - Deletar todo via `trpc.todos.delete.useMutation()`
  - Filtros locais (all, active, completed, priority)

#### Cliente tRPC (`lib/trpc.ts`)
- **Configuração:**
  - Conecta ao backend usando a URL configurada
  - Adiciona automaticamente o token de autenticação em todas as requisições
  - Usa SuperJSON para serialização de dados (Dates, etc)

### 4. Endpoints Disponíveis

#### Autenticação
- `auth.register` - Registro de novo usuário
- `auth.login` - Login de usuário

#### Todos
- `todos.list` - Lista todos do usuário (com filtros)
- `todos.create` - Cria novo todo
- `todos.update` - Atualiza todo existente
- `todos.delete` - Deleta todo
- `todos.statistics` - Estatísticas dos todos
- `todos.search` - Busca todos
- `todos.byCategory` - Todos por categoria
- `todos.overdue` - Todos atrasados

#### Categorias
- `categories.list` - Lista todas as categorias

#### Tags
- `tags.create` - Cria nova tag
- `tags.list` - Lista todas as tags

#### Comentários
- `comments.create` - Cria comentário em todo
- `comments.list` - Lista comentários de um todo

#### Anexos
- `attachments.list` - Lista anexos de um todo
- `attachments.create` - Cria anexo
- `attachments.delete` - Deleta anexo

#### Relatórios
- `reports.monthly` - Relatório mensal

### 5. Como Usar tRPC nas Páginas

#### Queries (Leitura de Dados)
```typescript
// Em um componente React
const categoriesQuery = trpc.categories.list.useQuery();

// Acessar dados
const categories = categoriesQuery.data?.categories || [];

// Verificar estado
if (categoriesQuery.isLoading) {
  return <Text>Carregando...</Text>;
}

if (categoriesQuery.error) {
  return <Text>Erro: {categoriesQuery.error.message}</Text>;
}
```

#### Mutations (Modificação de Dados)
```typescript
// Em um componente React
const createTagMutation = trpc.tags.create.useMutation({
  onSuccess: () => {
    // Refetch das tags após criar
    tagsQuery.refetch();
  },
});

// Usar mutation
const handleCreateTag = async () => {
  try {
    await createTagMutation.mutateAsync({
      name: 'Nova Tag',
      color: '#ff0000',
    });
  } catch (error) {
    console.error('Erro ao criar tag:', error);
  }
};
```

### 6. Testando a Integração

#### Local (Desenvolvimento)
```bash
# Terminal 1 - Backend
cd /caminho/do/projeto
bun run dev

# Terminal 2 - Frontend
cd /caminho/do/projeto
bun run start
```

#### Com Backend no Render
1. Faça deploy do backend no Render
2. Atualize `.env` com a URL do Render
3. Inicie o app: `bun run start`

### 7. Solução de Problemas

#### Erro: "No base url found"
- Verifique se o arquivo `.env` existe na raiz do projeto
- Verifique se a variável `EXPO_PUBLIC_RORK_API_BASE_URL` está definida
- Reinicie o servidor Expo após alterar o `.env`

#### Erro: "Network request failed"
- Verifique se o backend está rodando
- Verifique se a URL no `.env` está correta
- Se estiver testando no celular, use o IP da máquina ao invés de localhost

#### Erro: "Unauthorized"
- O token pode ter expirado ou ser inválido
- Faça logout e login novamente
- Verifique se o token está sendo enviado nas requisições (DevTools)

#### Erro: "CORS"
- O backend já está configurado para aceitar requisições de qualquer origem
- Se ainda assim houver erro, verifique a configuração do CORS no `backend/hono.ts`

### 8. Próximos Passos

Para integrar mais funcionalidades:

1. **Adicionar nova página:**
   - Crie o arquivo em `app/`
   - Use `trpc.{rota}.useQuery()` ou `trpc.{rota}.useMutation()`
   - Siga os exemplos de `AuthContext` e `TodosContext`

2. **Adicionar novo endpoint:**
   - Crie em `backend/trpc/routes/`
   - Adicione ao router em `backend/trpc/app-router.ts`
   - Use no frontend via `trpc.{namespace}.{rota}`

3. **Otimistic Updates:**
   - Para melhor UX, implemente updates otimistas
   - Atualize o cache local antes da resposta do servidor
   - Reverta em caso de erro
