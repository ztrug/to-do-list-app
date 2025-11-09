import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

const inputSchema = z.object({
  year: z.number().int().min(2020).max(2100),
  month: z.number().int().min(1).max(12),
});

export const monthlyReportProcedure = protectedProcedure
  .input(inputSchema)
  .query(async ({ ctx, input }) => {
    console.log(`[monthlyReport] Gerando relatório para ${input.month}/${input.year}`);

    const startDate = new Date(input.year, input.month - 1, 1);
    const endDate = new Date(input.year, input.month, 0, 23, 59, 59, 999);

    const todos = await ctx.prisma.todo.findMany({
      where: {
        userId: ctx.userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    const completedTodos = await ctx.prisma.todo.findMany({
      where: {
        userId: ctx.userId,
        completed: true,
        updatedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalCreated = todos.length;
    const totalCompleted = completedTodos.length;
    const urgent = todos.filter((t: { priority: string }) => t.priority === "urgent").length;
    const intermediate = todos.filter((t: { priority: string }) => t.priority === "intermediate").length;
    const notUrgent = todos.filter((t: { priority: string }) => t.priority === "notUrgent").length;

    const byCategory: Record<string, number> = {};
    todos.forEach((todo: { category: { name: string } | null }) => {
      const categoryName = todo.category?.name || "Sem categoria";
      byCategory[categoryName] = (byCategory[categoryName] || 0) + 1;
    });

    const completionRate = totalCreated > 0 ? (totalCompleted / totalCreated) * 100 : 0;

    console.log("[monthlyReport] Relatório gerado com sucesso");
    return {
      report: {
        period: {
          month: input.month,
          year: input.year,
          startDate,
          endDate,
        },
        summary: {
          totalCreated,
          totalCompleted,
          completionRate: Math.round(completionRate * 100) / 100,
          pending: totalCreated - totalCompleted,
        },
        byPriority: {
          urgent,
          intermediate,
          notUrgent,
        },
        byCategory,
      },
    };
  });

export default monthlyReportProcedure;
