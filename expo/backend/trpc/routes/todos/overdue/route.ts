import { protectedProcedure } from "@/backend/trpc/create-context";

export default protectedProcedure.query(async ({ ctx }) => {
  const now = new Date();

  const overdueTodos = await ctx.prisma.todo.findMany({
    where: {
      userId: ctx.userId,
      completed: false,
      dueDate: {
        lt: now,
      },
    },
    include: {
      category: true,
    },
    orderBy: {
      dueDate: "asc",
    },
  });

  const groupedByPriority = {
    urgent: overdueTodos.filter((todo: any) => todo.priority === "urgent"),
    intermediate: overdueTodos.filter((todo: any) => todo.priority === "intermediate"),
    notUrgent: overdueTodos.filter((todo: any) => todo.priority === "not-urgent"),
  };

  return {
    todos: overdueTodos,
    count: overdueTodos.length,
    groupedByPriority: {
      urgent: groupedByPriority.urgent.length,
      intermediate: groupedByPriority.intermediate.length,
      notUrgent: groupedByPriority.notUrgent.length,
    },
  };
});
