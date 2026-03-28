import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

export default protectedProcedure
  .input(
    z.object({
      query: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    if (!input.query.trim()) {
      return {
        todos: [],
      };
    }

    const todos = await ctx.prisma.todo.findMany({
      where: {
        userId: ctx.userId,
        title: {
          contains: input.query,
          mode: "insensitive",
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      todos,
      count: todos.length,
    };
  });
