import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const app = new Hono();

// Habilita CORS
app.use("*", cors());

// Registra o TRPC na rota correta
app.use(
  "/api/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
  })
);

// Rota teste
app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

// Inicia o servidor
const port = Number(process.env.PORT) || 3000;

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Server running on port ${port}`);

export default app;
