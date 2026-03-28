import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

export default protectedProcedure
  .input(
    z
      .object({
        filter: z.enum(["all", "active", "completed"]).optional(),
        priorityFilter: z.enum(["all", "urgent", "intermediate", "not-urgent"]).optional(),
      })
      .optional()
  )
  .query(async ({ input, ctx }) => {
    const where: any = {
      userId: ctx.userId,
    };

    if (input?.filter === "active") {
      where.completed = false;
    } else if (input?.filter === "completed") {
      where.completed = true;
    }

    if (input?.priorityFilter && input.priorityFilter !== "all") {
      where.priority = input.priorityFilter;
    }

    const todos = await ctx.prisma.todo.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      todos,
    };
  });
