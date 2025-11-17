# Integração de Câmera e Anexos de Imagens

## 📸 Funcionalidades Implementadas

### Backend
Criados 2 novos endpoints para gerenciar anexos de imagens:

1. **`POST /api/trpc/attachments.create`** - Criar anexo
   - Arquivo: `backend/trpc/routes/attachments/create/route.ts`
   - Parâmetros:
     - `todoId`: ID da tarefa
     - `filename`: Nome do arquivo
     - `fileUrl`: URL ou base64 da imagem
     - `fileType`: Tipo MIME (ex: `image/jpeg`)
     - `fileSize`: Tamanho em bytes
   - Validações:
     - Verifica se a tarefa existe e pertence ao usuário
     - Cria registro no banco de dados

2. **`DELETE /api/trpc/attachments.delete`** - Excluir anexo
   - Arquivo: `backend/trpc/routes/attachments/delete/route.ts`
   - Parâmetros:
     - `attachmentId`: ID do anexo
   - Validações:
     - Verifica se o anexo existe e pertence ao usuário
     - Remove do banco de dados

3. **`GET /api/trpc/attachments.list`** (já existia)
   - Lista todos os anexos de uma tarefa
   - Retorna quantidade e tamanho total dos anexos

### Frontend
Atualizada a tela de detalhes da tarefa (`app/task-details.tsx`) com:

#### 1. **Captura de Foto via Câmera** 📷
   - Integração com `expo-camera`
   - Solicita permissão de câmera automaticamente
   - Interface de câmera fullscreen com botões de captura e cancelamento
   - Converte foto para base64 e envia para o backend
   - **Compatível com dispositivos móveis (iOS/Android)**
   - **Na web**: Redireciona automaticamente para seleção de galeria

#### 2. **Seleção de Imagens da Galeria** 🖼️
   - Integração com `expo-image-picker`
   - Permite edição básica da imagem antes de anexar
   - Suporta compressão (qualidade 0.7)
   - Converte para base64 e envia para o backend
   - **Compatível com web e mobile**

#### 3. **Visualização de Anexos**
   - Lista todas as imagens anexadas à tarefa
   - Mostra miniatura, nome do arquivo e tamanho
   - Formatação automática de tamanhos (B, KB, MB)
   - Layout responsivo com cards

#### 4. **Exclusão de Anexos**
   - Botão de exclusão em cada anexo
   - Confirmação antes de excluir
   - Atualização automática da lista após exclusão

#### 5. **Estados de Loading**
   - Indicador visual durante o upload
   - Indicador visual durante o carregamento da lista
   - Desabilita botões durante operações

### Tecnologias Utilizadas
- **`expo-camera`**: Captura de fotos no mobile
- **`expo-image-picker`**: Seleção de imagens da galeria
- **`expo-image`**: Exibição otimizada de imagens
- **tRPC**: Comunicação type-safe com o backend
- **React Query**: Gerenciamento de estado e cache
- **Prisma**: ORM para persistência no PostgreSQL

### Banco de Dados
A tabela `attachments` já existia no schema Prisma com os campos:
- `id`: ID único
- `filename`: Nome do arquivo
- `fileUrl`: URL ou base64 da imagem
- `fileType`: Tipo MIME
- `fileSize`: Tamanho em bytes
- `createdAt`: Data de criação
- `todoId`: Relação com a tarefa
- `userId`: Relação com o usuário

### Compatibilidade
✅ **Mobile (iOS/Android)**: Todas as funcionalidades
✅ **Web**: Seleção de galeria (câmera não disponível)

### Como Usar

1. **Tirar Foto (Mobile)**:
   - Abra os detalhes de uma tarefa
   - Toque no botão "Câmera"
   - Permita o acesso à câmera (primeira vez)
   - Tire a foto
   - A imagem será anexada automaticamente

2. **Selecionar da Galeria**:
   - Abra os detalhes de uma tarefa
   - Toque no botão "Galeria"
   - Selecione uma imagem
   - Edite se necessário (cortar, girar)
   - Confirme
   - A imagem será anexada automaticamente

3. **Excluir Anexo**:
   - Na lista de anexos, toque no ícone "X"
   - Confirme a exclusão
   - O anexo será removido

### Melhorias Futuras (Sugestões)
- Upload para serviço de storage (S3, Cloudinary) ao invés de base64
- Suporte para outros tipos de arquivo (PDF, vídeos)
- Visualização em tela cheia dos anexos
- Compartilhamento de imagens
- Filtros e edição avançada de imagens
