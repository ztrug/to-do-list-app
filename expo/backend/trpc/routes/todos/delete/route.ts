import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

export default protectedProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const todo = await ctx.prisma.todo.findUnique({
      where: { id: input.id },
    });

    if (!todo || todo.userId !== ctx.userId) {
      throw new Error("Tarefa não encontrada");
    }

    await ctx.prisma.todo.delete({
      where: { id: input.id },
    });

    return {
      success: true,
    };
  });
