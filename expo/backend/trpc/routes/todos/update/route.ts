import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

export default protectedProcedure
  .input(
    z.object({
      id: z.string(),
      completed: z.boolean().optional(),
      title: z.string().optional(),
      priority: z.enum(["urgent", "intermediate", "not-urgent"]).optional(),
      dueDate: z.string().datetime().optional().nullable(),
      categoryId: z.string().optional().nullable(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const todo = await ctx.prisma.todo.findUnique({
      where: { id: input.id },
    });

    if (!todo || todo.userId !== ctx.userId) {
      throw new Error("Tarefa não encontrada");
    }

    const updated = await ctx.prisma.todo.update({
      where: { id: input.id },
      data: {
        completed: input.completed,
        title: input.title,
        priority: input.priority,
        dueDate: input.dueDate ? new Date(input.dueDate) : input.dueDate === null ? null : undefined,
        categoryId: input.categoryId === null ? null : input.categoryId,
      },
      include: {
        category: true,
      },
    });

    return {
      success: true,
      todo: updated,
    };
  });
