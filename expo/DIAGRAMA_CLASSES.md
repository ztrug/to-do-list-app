# Diagrama de Classes - Sistema de Gerenciamento de Tarefas

## 📦 Visão Geral

O sistema utiliza **Prisma ORM** com **PostgreSQL** e segue uma arquitetura em camadas:
- **Camada de Apresentação:** React Native (Expo)
- **Camada de Aplicação:** tRPC (Type-safe API)
- **Camada de Domínio:** Modelos Prisma
- **Camada de Persistência:** PostgreSQL

---

## 🗂️ Classes do Domínio (Modelos Prisma)

### 1. User (Usuário)

```typescript
class User {
  // Identificação
  + id: String @id @default(cuid())
  + email: String @unique
  - password: String
  
  // Informações Pessoais
  + name: String
  + age: Int
  + howFound: String
  + profilePhoto: String?
  
  // Timestamps
  + createdAt: DateTime @default(now())
  + updatedAt: DateTime @updatedAt
  
  // Relacionamentos
  + todos: Todo[]
  + tags: Tag[]
  + comments: Comment[]
  + attachments: Attachment[]
}
```

**Responsabilidades:**
- Armazenar credenciais de autenticação
- Gerenciar informações pessoais
- Relacionar com todas as entidades do sistema

**Relacionamentos:**
- **1:N** com Todo (um usuário tem várias tarefas)
- **1:N** com Tag (um usuário tem várias tags)
- **1:N** com Comment (um usuário cria vários comentários)
- **1:N** com Attachment (um usuário cria vários anexos)

---

### 2. Category (Categoria)

```typescript
class Category {
  // Identificação
  + id: String @id @default(cuid())
  + name: String @unique
  
  // Personalização
  + color: String
  + icon: String?
  
  // Timestamps
  + createdAt: DateTime @default(now())
  + updatedAt: DateTime @updatedAt
  
  // Relacionamentos
  + todos: Todo[]
}
```

**Responsabilidades:**
- Agrupar tarefas por tipo/contexto
- Fornecer identificação visual (cor e ícone)

**Relacionamentos:**
- **1:N** com Todo (uma categoria tem várias tarefas)

**Nota:** Categorias são **globais** (não vinculadas a usuário específico)

---

### 3. Todo (Tarefa)

```typescript
class Todo {
  // Identificação
  + id: String @id @default(cuid())
  
  // Informações da Tarefa
  + title: String
  + completed: Boolean @default(false)
  + priority: String // "urgent" | "intermediate" | "notUrgent"
  + dueDate: DateTime?
  + notificationId: String?
  
  // Timestamps
  + createdAt: DateTime @default(now())
  + updatedAt: DateTime @updatedAt
  
  // Chaves Estrangeiras
  + userId: String
  + categoryId: String?
  
  // Relacionamentos
  + user: User
  + category: Category?
  + comments: Comment[]
  + attachments: Attachment[]
  + tags: TodoTag[]
  
  // Índices
  @@index([userId])
  @@index([categoryId])
}
```

**Responsabilidades:**
- Representar uma tarefa individual
- Gerenciar status de conclusão
- Armazenar prioridade e prazo
- Relacionar com categoria, comentários, anexos e tags

**Relacionamentos:**
- **N:1** com User (muitas tarefas pertencem a um usuário)
- **N:1** com Category (muitas tarefas pertencem a uma categoria)
- **1:N** com Comment (uma tarefa tem vários comentários)
- **1:N** com Attachment (uma tarefa tem vários anexos)
- **N:N** com Tag através de TodoTag (uma tarefa tem várias tags)

**Regras de Negócio:**
- Tarefa sem dueDate não pode estar vencida
- Priority deve ser um dos valores válidos
- DeleteCascade: ao excluir tarefa, exclui comentários, anexos e associações com tags

---

### 4. Tag (Etiqueta)

```typescript
class Tag {
  // Identificação
  + id: String @id @default(cuid())
  + name: String
  + color: String
  
  // Timestamps
  + createdAt: DateTime @default(now())
  + updatedAt: DateTime @updatedAt
  
  // Chaves Estrangeiras
  + userId: String
  
  // Relacionamentos
  + user: User
  + todos: TodoTag[]
  
  // Constraints
  @@unique([userId, name])
  @@index([userId])
}
```

**Responsabilidades:**
- Permitir categorização personalizada pelo usuário
- Fornecer identificação visual (cor)
- Associar múltiplas tarefas

**Relacionamentos:**
- **N:1** com User (muitas tags pertencem a um usuário)
- **N:N** com Todo através de TodoTag (uma tag pode estar em várias tarefas)

**Regras de Negócio:**
- Nome de tag deve ser único por usuário
- Usuário não pode ter duas tags com mesmo nome

---

### 5. TodoTag (Associação Tarefa-Tag)

```typescript
class TodoTag {
  // Identificação
  + id: String @id @default(cuid())
  + createdAt: DateTime @default(now())
  
  // Chaves Estrangeiras
  + todoId: String
  + tagId: String
  
  // Relacionamentos
  + todo: Todo
  + tag: Tag
  
  // Constraints
  @@unique([todoId, tagId])
  @@index([todoId])
  @@index([tagId])
}
```

**Responsabilidades:**
- Implementar relacionamento N:N entre Todo e Tag
- Evitar duplicação de associações

**Tipo:** Tabela de junção (Join Table)

**Regras de Negócio:**
- Uma tarefa não pode ter a mesma tag duas vezes
- DeleteCascade: ao excluir tarefa ou tag, remove a associação

---

### 6. Comment (Comentário)

```typescript
class Comment {
  // Identificação
  + id: String @id @default(cuid())
  
  // Conteúdo
  + content: String
  
  // Timestamps
  + createdAt: DateTime @default(now())
  + updatedAt: DateTime @updatedAt
  
  // Chaves Estrangeiras
  + todoId: String
  + userId: String
  
  // Relacionamentos
  + todo: Todo
  + user: User
  
  // Índices
  @@index([todoId])
  @@index([userId])
}
```

**Responsabilidades:**
- Armazenar notas/comentários sobre tarefas
- Rastrear autor e timestamp
- Permitir colaboração e histórico

**Relacionamentos:**
- **N:1** com Todo (muitos comentários pertencem a uma tarefa)
- **N:1** com User (muitos comentários são criados por um usuário)

**Regras de Negócio:**
- Comentário deve ter conteúdo não vazio
- DeleteCascade: ao excluir tarefa, exclui comentários
- DeleteCascade: ao excluir usuário, exclui comentários

---

### 7. Attachment (Anexo)

```typescript
class Attachment {
  // Identificação
  + id: String @id @default(cuid())
  
  // Informações do Arquivo
  + filename: String
  + fileUrl: String // base64 ou URL
  + fileType: String // MIME type (image/jpeg, etc)
  + fileSize: Int // bytes
  
  // Timestamp
  + createdAt: DateTime @default(now())
  
  // Chaves Estrangeiras
  + todoId: String
  + userId: String
  
  // Relacionamentos
  + todo: Todo
  + user: User
  
  // Índices
  @@index([todoId])
  @@index([userId])
}
```

**Responsabilidades:**
- Armazenar metadados de arquivos anexados
- Vincular arquivos a tarefas específicas
- Rastrear autor e tamanho

**Relacionamentos:**
- **N:1** com Todo (muitos anexos pertencem a uma tarefa)
- **N:1** com User (muitos anexos são criados por um usuário)

**Regras de Negócio:**
- Arquivo deve ter tamanho > 0
- fileType deve ser MIME type válido
- DeleteCascade: ao excluir tarefa, exclui anexos
- DeleteCascade: ao excluir usuário, exclui anexos

**Integração com Dispositivo:**
- Captura via **expo-camera** (mobile)
- Seleção via **expo-image-picker** (mobile/web)
- Armazenamento em base64 (pode ser migrado para S3/Cloudinary)

---

## 🔄 Relacionamentos Entre Classes

```
User 1───────N Todo
User 1───────N Tag
User 1───────N Comment
User 1───────N Attachment

Category 1───────N Todo

Todo 1───────N Comment
Todo 1───────N Attachment
Todo N───────N Tag (através de TodoTag)

TodoTag N───────1 Todo
TodoTag N───────1 Tag
```

---

## 📊 Cardinalidades

| Relacionamento | Tipo | Delete Rule |
|----------------|------|-------------|
| User → Todo | 1:N | CASCADE |
| User → Tag | 1:N | CASCADE |
| User → Comment | 1:N | CASCADE |
| User → Attachment | 1:N | CASCADE |
| Category → Todo | 1:N | SET NULL |
| Todo → Comment | 1:N | CASCADE |
| Todo → Attachment | 1:N | CASCADE |
| Todo ↔ Tag | N:N | CASCADE (via TodoTag) |

---

## 🎯 Classes de Serviço (Backend tRPC)

### AuthService
```typescript
class AuthService {
  + register(data: RegisterInput): Promise<AuthResponse>
  + login(data: LoginInput): Promise<AuthResponse>
  - hashPassword(password: string): string
  - generateToken(userId: string): string
}
```

**Endpoints:**
- `auth.register` (Mutation)
- `auth.login` (Mutation)

---

### TodoService
```typescript
class TodoService {
  + create(data: CreateTodoInput, userId: string): Promise<Todo>
  + list(filters: TodoFilters, userId: string): Promise<Todo[]>
  + update(id: string, data: UpdateTodoInput, userId: string): Promise<Todo>
  + delete(id: string, userId: string): Promise<void>
  + getStatistics(userId: string): Promise<Statistics>
  + search(query: string, userId: string): Promise<SearchResult>
  + getByCategory(userId: string): Promise<CategoryGroup[]>
  + getOverdue(userId: string): Promise<OverdueResult>
}
```

**Endpoints:**
- `todos.create` (Mutation)
- `todos.list` (Query)
- `todos.update` (Mutation)
- `todos.delete` (Mutation)
- `todos.statistics` (Query)
- `todos.search` (Query)
- `todos.byCategory` (Query)
- `todos.overdue` (Query)

---

### CategoryService
```typescript
class CategoryService {
  + list(): Promise<Category[]>
}
```

**Endpoints:**
- `categories.list` (Query)

---

### TagService
```typescript
class TagService {
  + create(data: CreateTagInput, userId: string): Promise<Tag>
  + list(userId: string): Promise<TagWithCount[]>
  - validateUniqueTagName(name: string, userId: string): void
  - validateHexColor(color: string): void
}
```

**Endpoints:**
- `tags.create` (Mutation)
- `tags.list` (Query)

---

### CommentService
```typescript
class CommentService {
  + create(data: CreateCommentInput, userId: string): Promise<Comment>
  + list(todoId: string, userId: string): Promise<CommentListResult>
  - validateTodoOwnership(todoId: string, userId: string): Promise<void>
}
```

**Endpoints:**
- `comments.create` (Mutation)
- `comments.list` (Query)

---

### AttachmentService
```typescript
class AttachmentService {
  + create(data: CreateAttachmentInput, userId: string): Promise<Attachment>
  + list(todoId: string, userId: string): Promise<AttachmentListResult>
  + delete(id: string, userId: string): Promise<void>
  - validateTodoOwnership(todoId: string, userId: string): Promise<void>
  - calculateTotalSize(attachments: Attachment[]): number
}
```

**Endpoints:**
- `attachments.create` (Mutation)
- `attachments.list` (Query)
- `attachments.delete` (Mutation)

---

### ReportService
```typescript
class ReportService {
  + generateMonthlyReport(year: number, month: number, userId: string): Promise<MonthlyReport>
  - getDateRange(year: number, month: number): { start: Date, end: Date }
  - calculateCompletionRate(total: number, completed: number): number
  - groupByPriority(todos: Todo[]): PriorityGroup
  - groupByCategory(todos: Todo[]): Record<string, number>
}
```

**Endpoints:**
- `reports.monthly` (Query)

---

## 🔧 Classes de Contexto (Frontend)

### AuthContext
```typescript
class AuthContext {
  + user: User | null
  + token: string | null
  + isAuthenticated: boolean
  + isLoading: boolean
  
  + login(email: string, password: string): Promise<void>
  + register(data: RegisterData): Promise<void>
  + logout(): Promise<void>
  + refreshUser(): Promise<void>
}
```

**Arquivo:** `app/contexts/AuthContext.tsx`  
**Tecnologia:** `@nkzw/create-context-hook`

---

### TodosContext
```typescript
class TodosContext {
  + todos: Todo[]
  + filters: TodoFilters
  + isLoading: boolean
  
  + setFilters(filters: TodoFilters): void
  + refetchTodos(): Promise<void>
}
```

**Arquivo:** `app/contexts/TodosContext.tsx`  
**Tecnologia:** `@nkzw/create-context-hook` + React Query

---

## 📱 Classes de Interface (Telas)

### HomeScreen
```typescript
class HomeScreen {
  - filters: TodoFilters
  - searchQuery: string
  
  + renderTodoList(): JSX.Element
  + renderFilters(): JSX.Element
  + handleCreateTodo(): void
  + handleToggleComplete(id: string): void
  + navigateToDetails(id: string): void
}
```

**Arquivo:** `app/index.tsx`

---

### TaskDetailsScreen
```typescript
class TaskDetailsScreen {
  - todoId: string
  - cameraVisible: boolean
  
  + renderTaskInfo(): JSX.Element
  + renderComments(): JSX.Element
  + renderAttachments(): JSX.Element
  + handleEdit(): void
  + handleDelete(): void
  + openCamera(): void
  + pickImage(): void
  + addComment(content: string): void
  + deleteAttachment(id: string): void
}
```

**Arquivo:** `app/task-details.tsx`

---

### StatisticsScreen
```typescript
class StatisticsScreen {
  + renderGeneralStats(): JSX.Element
  + renderCategoryChart(): JSX.Element
  + renderOverdueTasks(): JSX.Element
  + renderMonthlyReport(): JSX.Element
}
```

**Arquivo:** `app/statistics.tsx`

---

### CalendarScreen
```typescript
class CalendarScreen {
  - selectedDate: Date
  
  + renderCalendar(): JSX.Element
  + renderTasksForDate(date: Date): JSX.Element
  + navigateMonth(direction: "prev" | "next"): void
}
```

**Arquivo:** `app/calendar.tsx`

---

### ProfileScreen
```typescript
class ProfileScreen {
  + renderUserInfo(): JSX.Element
  + handleEditProfile(): void
  + handleUpdateProfilePhoto(): void
}
```

**Arquivo:** `app/profile.tsx`

---

### SettingsScreen
```typescript
class SettingsScreen {
  + renderTagManagement(): JSX.Element
  + renderNotificationSettings(): JSX.Element
  + handleCreateTag(name: string, color: string): void
  + handleDeleteTag(id: string): void
}
```

**Arquivo:** `app/settings.tsx`

---

## 🔐 Classes de Segurança

### AuthMiddleware
```typescript
class AuthMiddleware {
  + verifyToken(token: string): Promise<TokenPayload>
  + getUserFromToken(token: string): Promise<User>
  + requireAuth(): Middleware
}
```

**Uso:** Todos os procedimentos protegidos usam `protectedProcedure`

---

## 📊 Classes de Validação (Zod)

### Validators
```typescript
class TodoValidator {
  + CreateTodoSchema: ZodSchema
  + UpdateTodoSchema: ZodSchema
  + TodoFiltersSchema: ZodSchema
}

class TagValidator {
  + CreateTagSchema: ZodSchema
  + HexColorSchema: ZodSchema
}

class CommentValidator {
  + CreateCommentSchema: ZodSchema
}

class AttachmentValidator {
  + CreateAttachmentSchema: ZodSchema
  + MimeTypeSchema: ZodSchema
}

class ReportValidator {
  + MonthlyReportInputSchema: ZodSchema
  + YearSchema: ZodSchema // 2020-2100
  + MonthSchema: ZodSchema // 1-12
}
```

---

## 🎨 Classes de Utilidade

### DateHelper
```typescript
class DateHelper {
  + isOverdue(date: Date): boolean
  + formatDate(date: Date): string
  + getMonthRange(year: number, month: number): { start: Date, end: Date }
  + addDays(date: Date, days: number): Date
}
```

---

### FileHelper
```typescript
class FileHelper {
  + base64ToBlob(base64: string): Blob
  + formatFileSize(bytes: number): string // "1.5 MB"
  + getMimeType(filename: string): string
  + compressImage(uri: string, quality: number): Promise<string>
}
```

---

### CameraHelper
```typescript
class CameraHelper {
  + requestPermissions(): Promise<boolean>
  + capturePhoto(cameraRef: CameraRef): Promise<string>
  + convertToBase64(uri: string): Promise<string>
}
```

---

## 📐 Padrões de Design Utilizados

### Repository Pattern
- Prisma Client abstrai acesso ao banco de dados
- Cada serviço acessa dados via Prisma

### Factory Pattern
- `createTRPCRouter()` cria routers
- `protectedProcedure` cria procedimentos autenticados

### Context Pattern
- `@nkzw/create-context-hook` para estado global
- React Context API para compartilhar dados

### Observer Pattern
- React Query para cache e revalidação
- useQuery/useMutation para reatividade

### Strategy Pattern
- Diferentes estratégias de filtro em `todos.list`
- Diferentes tipos de relatório

---

## 🔄 Fluxo de Dados

```
Frontend (React Native)
    ↓
tRPC Client (Type-safe)
    ↓
tRPC Router (Backend)
    ↓
Service Layer (Business Logic)
    ↓
Prisma Client (ORM)
    ↓
PostgreSQL Database
```

---

## 📊 Resumo Quantitativo

- **Classes de Domínio:** 7 (User, Category, Todo, Tag, TodoTag, Comment, Attachment)
- **Classes de Serviço:** 7 (Auth, Todo, Category, Tag, Comment, Attachment, Report)
- **Classes de Contexto:** 2 (Auth, Todos)
- **Classes de Interface:** 6 (Home, TaskDetails, Statistics, Calendar, Profile, Settings)
- **Classes de Utilidade:** 3 (DateHelper, FileHelper, CameraHelper)
- **Classes de Validação:** 5 conjuntos de schemas Zod

**Total:** ~30 classes/módulos principais

---

## 🔗 Dependências Externas

- **Prisma:** ORM para PostgreSQL
- **tRPC:** API type-safe
- **Expo:** Framework React Native
- **expo-camera:** Captura de fotos
- **expo-image-picker:** Seleção de imagens
- **Zod:** Validação de schemas
- **React Query:** Cache e sincronização
- **@nkzw/create-context-hook:** Context API simplificado
