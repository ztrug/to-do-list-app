import { Hono } from "hono";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";
import { trpcServer } from "@hono/trpc-server";

const app = new Hono();

// habilita CORS para tudo
app.use("*", cors());

// ROTA DO TRPC — APENAS ESSA
app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
  })
);

// ROTA TESTE
app.get("/", (c) => c.json({ status: "ok" }));

// inicia servidor
const port = Number(process.env.PORT) || 3000;
Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Server running on port ${port}`);
export default app;
