import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.json({ status: "ok" }));

const port = Number(process.env.PORT) || 3000;

export default {
  fetch: app.fetch,
  port,
};
