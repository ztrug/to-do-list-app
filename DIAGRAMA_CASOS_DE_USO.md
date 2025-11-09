# Diagrama de Casos de Uso - Sistema de Gerenciamento de Tarefas

## 👤 Atores

### Usuário Não Autenticado
- Usuário que ainda não está logado no sistema

### Usuário Autenticado
- Usuário registrado e logado no sistema

---

## 📋 Casos de Uso

### 1. Gerenciamento de Autenticação

#### UC01 - Registrar Usuário
**Ator:** Usuário Não Autenticado  
**Descrição:** Permite que um novo usuário crie uma conta no sistema  
**Fluxo Principal:**
1. Usuário acessa a tela de registro
2. Usuário fornece: email, senha, nome, idade, como conheceu o app
3. Sistema valida os dados
4. Sistema cria nova conta
5. Sistema retorna token de autenticação

**Endpoint:** `auth.register`  
**Tela:** `app/register.tsx`

---

#### UC02 - Fazer Login
**Ator:** Usuário Não Autenticado  
**Descrição:** Permite que usuário acesse sua conta  
**Fluxo Principal:**
1. Usuário acessa a tela de login
2. Usuário fornece email e senha
3. Sistema valida credenciais
4. Sistema retorna token de autenticação
5. Sistema redireciona para página principal

**Endpoint:** `auth.login`  
**Tela:** `app/login.tsx`

---

### 2. Gerenciamento de Tarefas (CRUD)

#### UC03 - Criar Tarefa
**Ator:** Usuário Autenticado  
**Descrição:** Permite criar uma nova tarefa  
**Fluxo Principal:**
1. Usuário clica em "Nova Tarefa"
2. Usuário preenche: título, prioridade, data de vencimento, categoria
3. Sistema valida os dados
4. Sistema cria a tarefa vinculada ao usuário
5. Sistema atualiza a lista de tarefas

**Endpoint:** `todos.create`  
**Tela:** `app/index.tsx`

---

#### UC04 - Listar Tarefas
**Ator:** Usuário Autenticado  
**Descrição:** Visualiza todas as suas tarefas com filtros  
**Fluxo Principal:**
1. Sistema carrega todas as tarefas do usuário
2. Usuário pode filtrar por: status (completo/incompleto), categoria, prioridade
3. Sistema aplica filtros e exibe resultados

**Endpoint:** `todos.list`  
**Tela:** `app/index.tsx`

---

#### UC05 - Atualizar Tarefa
**Ator:** Usuário Autenticado  
**Descrição:** Edita informações de uma tarefa existente  
**Fluxo Principal:**
1. Usuário seleciona uma tarefa
2. Usuário altera: título, prioridade, data, status, categoria
3. Sistema valida as alterações
4. Sistema atualiza a tarefa no banco
5. Sistema atualiza a visualização

**Endpoint:** `todos.update`  
**Telas:** `app/index.tsx`, `app/task-details.tsx`

---

#### UC06 - Excluir Tarefa
**Ator:** Usuário Autenticado  
**Descrição:** Remove uma tarefa permanentemente  
**Fluxo Principal:**
1. Usuário seleciona uma tarefa
2. Usuário clica em excluir
3. Sistema solicita confirmação
4. Sistema remove a tarefa e todos os dados relacionados (comentários, anexos, tags)
5. Sistema atualiza a lista

**Endpoint:** `todos.delete`  
**Tela:** `app/task-details.tsx`

---

### 3. Análise e Relatórios

#### UC07 - Visualizar Estatísticas Gerais
**Ator:** Usuário Autenticado  
**Descrição:** Visualiza métricas de produtividade  
**Fluxo Principal:**
1. Usuário acessa a tela de estatísticas
2. Sistema calcula:
   - Total de tarefas
   - Tarefas completadas
   - Tarefas ativas
   - Tarefas urgentes
   - Tarefas vencidas
   - Taxa de conclusão (%)
3. Sistema exibe as estatísticas

**Endpoint:** `todos.statistics`  
**Tela:** `app/statistics.tsx`

---

#### UC08 - Visualizar Tarefas por Categoria
**Ator:** Usuário Autenticado  
**Descrição:** Vê a distribuição de tarefas por categoria  
**Fluxo Principal:**
1. Sistema agrupa tarefas por categoria
2. Sistema conta quantidade por categoria
3. Sistema exibe lista com nome, cor, ícone e quantidade

**Endpoint:** `todos.byCategory`  
**Tela:** `app/statistics.tsx`

---

#### UC09 - Visualizar Tarefas Vencidas
**Ator:** Usuário Autenticado  
**Descrição:** Lista tarefas que passaram da data de vencimento  
**Fluxo Principal:**
1. Sistema busca tarefas com dueDate < hoje e completed = false
2. Sistema agrupa por prioridade (urgente, intermediário, não urgente)
3. Sistema exibe lista ordenada

**Endpoint:** `todos.overdue`  
**Tela:** `app/statistics.tsx`

---

#### UC10 - Gerar Relatório Mensal
**Ator:** Usuário Autenticado  
**Descrição:** Gera relatório detalhado de um mês específico  
**Fluxo Principal:**
1. Usuário seleciona ano e mês
2. Sistema busca tarefas criadas e completadas no período
3. Sistema calcula:
   - Total criado
   - Total completado
   - Taxa de conclusão
   - Distribuição por prioridade
   - Distribuição por categoria
4. Sistema exibe relatório

**Endpoint:** `reports.monthly`  
**Tela:** `app/statistics.tsx`

---

### 4. Busca e Filtros

#### UC11 - Buscar Tarefas
**Ator:** Usuário Autenticado  
**Descrição:** Busca tarefas por texto  
**Fluxo Principal:**
1. Usuário digita termo de busca
2. Sistema busca no título (case-insensitive)
3. Sistema retorna resultados e contagem

**Endpoint:** `todos.search`  
**Tela:** `app/index.tsx`

---

### 5. Gerenciamento de Categorias

#### UC12 - Listar Categorias
**Ator:** Usuário Autenticado  
**Descrição:** Visualiza todas as categorias disponíveis  
**Fluxo Principal:**
1. Sistema carrega categorias predefinidas
2. Sistema exibe nome, cor e ícone de cada categoria

**Endpoint:** `categories.list`  
**Tela:** `app/index.tsx`

---

### 6. Gerenciamento de Tags

#### UC13 - Criar Tag Personalizada
**Ator:** Usuário Autenticado  
**Descrição:** Cria etiqueta personalizada para organizar tarefas  
**Fluxo Principal:**
1. Usuário clica em "Nova Tag"
2. Usuário fornece: nome e cor (HEX)
3. Sistema valida:
   - Nome não vazio
   - Cor no formato HEX válido
   - Nome não duplicado para o usuário
4. Sistema cria a tag vinculada ao usuário

**Endpoint:** `tags.create`  
**Tela:** `app/settings.tsx`

---

#### UC14 - Listar Tags do Usuário
**Ator:** Usuário Autenticado  
**Descrição:** Visualiza todas as tags criadas  
**Fluxo Principal:**
1. Sistema busca tags do usuário
2. Sistema conta quantidade de tarefas com cada tag
3. Sistema exibe lista com nome, cor e contagem

**Endpoint:** `tags.list`  
**Tela:** `app/settings.tsx`

---

### 7. Gerenciamento de Comentários

#### UC15 - Adicionar Comentário
**Ator:** Usuário Autenticado  
**Descrição:** Adiciona nota/comentário a uma tarefa  
**Fluxo Principal:**
1. Usuário abre detalhes da tarefa
2. Usuário escreve comentário
3. Sistema valida:
   - Tarefa existe e pertence ao usuário
   - Conteúdo não vazio
4. Sistema salva comentário com timestamp
5. Sistema atualiza lista de comentários

**Endpoint:** `comments.create`  
**Tela:** `app/task-details.tsx`

---

#### UC16 - Listar Comentários de Tarefa
**Ator:** Usuário Autenticado  
**Descrição:** Visualiza todos os comentários de uma tarefa  
**Fluxo Principal:**
1. Usuário abre detalhes da tarefa
2. Sistema busca comentários ordenados por data
3. Sistema exibe: conteúdo, autor, data
4. Sistema mostra contagem total

**Endpoint:** `comments.list`  
**Tela:** `app/task-details.tsx`

---

### 8. Gerenciamento de Anexos (Integração com Câmera)

#### UC17 - Capturar Foto com Câmera
**Ator:** Usuário Autenticado  
**Descrição:** Tira foto com câmera do dispositivo e anexa à tarefa  
**Pré-condição:** Dispositivo móvel (iOS/Android)  
**Fluxo Principal:**
1. Usuário abre detalhes da tarefa
2. Usuário clica em "Câmera"
3. Sistema solicita permissão de câmera (primeira vez)
4. Sistema abre interface da câmera
5. Usuário tira foto e confirma
6. Sistema converte imagem para base64
7. Sistema cria anexo vinculado à tarefa
8. Sistema atualiza lista de anexos

**Endpoint:** `attachments.create`  
**Tela:** `app/task-details.tsx`  
**Tecnologia:** `expo-camera`

---

#### UC18 - Selecionar Imagem da Galeria
**Ator:** Usuário Autenticado  
**Descrição:** Seleciona imagem existente da galeria  
**Fluxo Principal:**
1. Usuário abre detalhes da tarefa
2. Usuário clica em "Galeria"
3. Sistema abre seletor de imagens
4. Usuário escolhe imagem
5. Usuário pode editar (cortar, girar)
6. Sistema comprime imagem (qualidade 0.7)
7. Sistema converte para base64
8. Sistema cria anexo vinculado à tarefa
9. Sistema atualiza lista de anexos

**Endpoint:** `attachments.create`  
**Tela:** `app/task-details.tsx`  
**Tecnologia:** `expo-image-picker`

---

#### UC19 - Listar Anexos de Tarefa
**Ator:** Usuário Autenticado  
**Descrição:** Visualiza todos os anexos de uma tarefa  
**Fluxo Principal:**
1. Usuário abre detalhes da tarefa
2. Sistema busca anexos vinculados
3. Sistema calcula tamanho total
4. Sistema exibe: miniatura, nome, tipo, tamanho, data

**Endpoint:** `attachments.list`  
**Tela:** `app/task-details.tsx`

---

#### UC20 - Excluir Anexo
**Ator:** Usuário Autenticado  
**Descrição:** Remove um anexo de uma tarefa  
**Fluxo Principal:**
1. Usuário visualiza lista de anexos
2. Usuário clica em excluir anexo específico
3. Sistema solicita confirmação
4. Sistema valida:
   - Anexo existe
   - Anexo pertence ao usuário
5. Sistema remove registro do banco
6. Sistema atualiza lista de anexos

**Endpoint:** `attachments.delete`  
**Tela:** `app/task-details.tsx`

---

### 9. Visualização e Navegação

#### UC21 - Visualizar Calendário
**Ator:** Usuário Autenticado  
**Descrição:** Visualiza tarefas em formato de calendário  
**Fluxo Principal:**
1. Usuário acessa tela de calendário
2. Sistema exibe tarefas organizadas por data de vencimento
3. Usuário pode navegar entre meses

**Tela:** `app/calendar.tsx`

---

#### UC22 - Visualizar Perfil
**Ator:** Usuário Autenticado  
**Descrição:** Visualiza informações da conta  
**Fluxo Principal:**
1. Usuário acessa tela de perfil
2. Sistema exibe: nome, email, foto de perfil, idade
3. Usuário pode editar informações

**Tela:** `app/profile.tsx`

---

#### UC23 - Acessar Configurações
**Ator:** Usuário Autenticado  
**Descrição:** Gerencia preferências do app  
**Fluxo Principal:**
1. Usuário acessa tela de configurações
2. Usuário pode gerenciar tags, notificações, tema

**Tela:** `app/settings.tsx`

---

## 🔗 Relacionamentos Entre Casos de Uso

### Dependências:
- **UC03-UC06** (CRUD Tarefas) → Dependem de **UC02** (Login)
- **UC15-UC16** (Comentários) → Dependem de **UC03** (Tarefa criada)
- **UC17-UC20** (Anexos) → Dependem de **UC03** (Tarefa criada)
- **UC07-UC10** (Relatórios) → Dependem de **UC03-UC06** (Dados de tarefas)
- **UC13-UC14** (Tags) → Independentes, mas usados em **UC03, UC05**

### Extensões:
- **UC03** (Criar Tarefa) pode incluir **UC13** (Criar Tag)
- **UC05** (Atualizar Tarefa) pode incluir **UC15** (Adicionar Comentário)
- **UC05** (Atualizar Tarefa) pode incluir **UC17/UC18** (Adicionar Anexo)

---

## 📊 Resumo Quantitativo

- **Total de Casos de Uso:** 23
- **Casos de Uso de Autenticação:** 2
- **Casos de Uso de Tarefas (CRUD):** 4
- **Casos de Uso de Análise:** 4
- **Casos de Uso de Busca:** 1
- **Casos de Uso de Categorias:** 1
- **Casos de Uso de Tags:** 2
- **Casos de Uso de Comentários:** 2
- **Casos de Uso de Anexos:** 4 (inclui integração com câmera)
- **Casos de Uso de Visualização:** 3

---

## 🎯 Casos de Uso por Prioridade

### Críticos (Sistema não funciona sem):
- UC01, UC02 - Autenticação
- UC03, UC04, UC05, UC06 - CRUD Tarefas

### Importantes (Funcionalidade principal):
- UC07, UC08, UC09 - Estatísticas
- UC11 - Busca
- UC12 - Categorias
- UC19 - Listar Anexos

### Diferenciais (Valor agregado):
- UC10 - Relatório Mensal
- UC13, UC14 - Tags Personalizadas
- UC15, UC16 - Comentários
- UC17, UC18, UC20 - Gerenciamento de Anexos com Câmera
- UC21, UC22, UC23 - Visualizações

---

## 🔐 Requisitos de Segurança

Todos os casos de uso de UC03 a UC23 requerem:
- ✅ Autenticação (token JWT)
- ✅ Autorização (usuário só acessa seus próprios dados)
- ✅ Validação de entrada (Zod)
- ✅ Proteção contra SQL Injection (Prisma ORM)
- ✅ Isolamento de dados por userId
