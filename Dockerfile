FROM oven/bun:1

WORKDIR /app

# Copia somente os arquivos necessários para instalar dependências
COPY package.json bun.lockb ./
RUN bun install

# Copia o projeto inteiro
COPY . .

# Gera o Prisma Client
RUN bunx prisma generate

# Builda TypeScript se necessário (se usar tsx não precisa build)
# RUN bun run build

# Expõe a porta usada pelo Hono
EXPOSE 3000

# Inicia o servidor
CMD ["bun", "run", "server.ts"]
