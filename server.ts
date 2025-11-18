import { Hono } from "hono";

const app = new Hono();

// Rota teste
app.get("/", (c) => c.json({ status: "ok" }));

// Porta do Render
const port = Number(process.env.PORT) || 3000;

// Inicia o servidor no Bun
Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Server running on port ${port}`);
