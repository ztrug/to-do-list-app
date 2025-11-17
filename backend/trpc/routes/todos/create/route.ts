import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

export default protectedProcedure
  .input(
    z.object({
      title: z.string().min(1),
      priority: z.enum(["urgent", "intermediate", "not-urgent"]),
      dueDate: z.string().datetime().optional(),
      categoryId: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const todo = await ctx.prisma.todo.create({
      data: {
        title: input.title,
        priority: input.priority,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        userId: ctx.userId,
        categoryId: input.categoryId,
      },
      include: {
        category: true,
      },
    });

    return {
      success: true,
      todo,
    };
  });
