import { protectedProcedure } from "@/backend/trpc/create-context";

export default protectedProcedure.query(async ({ ctx }) => {
  const [totalTodos, completedTodos, activeTodos, urgentTodos, overdueTodos] = await Promise.all([
    ctx.prisma.todo.count({
      where: { userId: ctx.userId },
    }),
    ctx.prisma.todo.count({
      where: {
        userId: ctx.userId,
        completed: true,
      },
    }),
    ctx.prisma.todo.count({
      where: {
        userId: ctx.userId,
        completed: false,
      },
    }),
    ctx.prisma.todo.count({
      where: {
        userId: ctx.userId,
        priority: "urgent",
      },
    }),
    ctx.prisma.todo.count({
      where: {
        userId: ctx.userId,
        dueDate: {
          lt: new Date(),
        },
        completed: false,
      },
    }),
  ]);

  const completionRate = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  return {
    statistics: {
      total: totalTodos,
      completed: completedTodos,
      active: activeTodos,
      urgent: urgentTodos,
      overdue: overdueTodos,
      completionRate: Math.round(completionRate * 10) / 10,
    },
  };
});
