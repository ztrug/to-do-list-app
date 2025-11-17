import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

const inputSchema = z.object({
  todoId: z.string().min(1, "ID da tarefa é obrigatório"),
});

export const listCommentsProcedure = protectedProcedure
  .input(inputSchema)
  .query(async ({ ctx, input }) => {
    console.log("[listComments] Listando comentários da tarefa:", input.todoId);

    const todo = await ctx.prisma.todo.findFirst({
      where: {
        id: input.todoId,
        userId: ctx.userId,
      },
    });

    if (!todo) {
      console.error("[listComments] Tarefa não encontrada ou não pertence ao usuário");
      throw new Error("Tarefa não encontrada");
    }

    const comments = await ctx.prisma.comment.findMany({
      where: {
        todoId: input.todoId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("[listComments] Comentários encontrados:", comments.length);
    return { comments, count: comments.length };
  });

export default listCommentsProcedure;
