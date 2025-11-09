import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import registerRoute from "./routes/auth/register/route";
import loginRoute from "./routes/auth/login/route";
import createTodoRoute from "./routes/todos/create/route";
import listTodosRoute from "./routes/todos/list/route";
import updateTodoRoute from "./routes/todos/update/route";
import deleteTodoRoute from "./routes/todos/delete/route";
import listCategoriesRoute from "./routes/categories/list/route";
import statisticsTodosRoute from "./routes/todos/statistics/route";
import searchTodosRoute from "./routes/todos/search/route";
import byCategoryTodosRoute from "./routes/todos/by-category/route";
import overdueTodosRoute from "./routes/todos/overdue/route";
import createTagRoute from "./routes/tags/create/route";
import listTagsRoute from "./routes/tags/list/route";
import createCommentRoute from "./routes/comments/create/route";
import listCommentsRoute from "./routes/comments/list/route";
import listAttachmentsRoute from "./routes/attachments/list/route";
import createAttachmentRoute from "./routes/attachments/create/route";
import deleteAttachmentRoute from "./routes/attachments/delete/route";
import monthlyReportRoute from "./routes/reports/monthly/route";

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
    statistics: statisticsTodosRoute,
    search: searchTodosRoute,
    byCategory: byCategoryTodosRoute,
    overdue: overdueTodosRoute,
  }),
  categories: createTRPCRouter({
    list: listCategoriesRoute,
  }),
  tags: createTRPCRouter({
    create: createTagRoute,
    list: listTagsRoute,
  }),
  comments: createTRPCRouter({
    create: createCommentRoute,
    list: listCommentsRoute,
  }),
  attachments: createTRPCRouter({
    list: listAttachmentsRoute,
    create: createAttachmentRoute,
    delete: deleteAttachmentRoute,
  }),
  reports: createTRPCRouter({
    monthly: monthlyReportRoute,
  }),
});

export type AppRouter = typeof appRouter;
