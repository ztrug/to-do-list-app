import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import registerRoute from "./routes/auth/register/route";
import loginRoute from "./routes/auth/login/route";
import createTodoRoute from "./routes/todos/create/route";
import listTodosRoute from "./routes/todos/list/route";
import updateTodoRoute from "./routes/todos/update/route";
import deleteTodoRoute from "./routes/todos/delete/route";
import listCategoriesRoute from "./routes/categories/list/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  auth: createTRPCRouter({
    register: registerRoute,
    login: loginRoute,
  }),
  todos: createTRPCRouter({
    create: createTodoRoute,
    list: listTodosRoute,
    update: updateTodoRoute,
    delete: deleteTodoRoute,
  }),
  categories: createTRPCRouter({
    list: listCategoriesRoute,
  }),
});

export type AppRouter = typeof appRouter;
