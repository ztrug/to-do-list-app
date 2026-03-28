# Como Configurar URL do Backend no Frontend

O frontend já está preparado para conectar com o backend em produção.

## Configuração da URL

A URL do backend é configurada através da variável de ambiente `EXPO_PUBLIC_RORK_API_BASE_URL`.

### Para Desenvolvimento Local

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:3000
```

### Para Produção (Render)

Após fazer o deploy no Render, você receberá uma URL como:
`https://todo-app-backend.onrender.com`

Atualize o arquivo `.env`:

```env
EXPO_PUBLIC_RORK_API_BASE_URL=https://todo-app-backend.onrender.com
```

## Verificar Conexão

Para testar se a conexão está funcionando:

1. Abra o app
2. Tente fazer login ou registrar um usuário
3. Verifique os logs do console
4. Se houver erro de conexão, verifique:
   - A URL do backend está correta?
   - O backend está rodando?
   - Há logs de erro no Render?

## Para Gerar APK de Produção

Antes de gerar o APK, certifique-se de que `.env` está configurado com a URL de produção:

```env
EXPO_PUBLIC_RORK_API_BASE_URL=https://todo-app-backend.onrender.com
```

Depois disso, gere o APK seguindo o processo normal do EAS Build.

## Estrutura Atual

O arquivo `lib/trpc.ts` já está configurado para ler a variável de ambiente automaticamente:

```typescript
const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  throw new Error(
    "No base url found, please set EXPO_PUBLIC_RORK_API_BASE_URL"
  );
};
```

Isso significa que você não precisa alterar nenhum código, apenas configurar a variável de ambiente corretamente.
