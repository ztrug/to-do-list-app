import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

const inputSchema = z.object({
  todoId: z.string().min(1, "ID da tarefa é obrigatório"),
  content: z.string().min(1, "Conteúdo do comentário é obrigatório"),
});

export const createCommentProcedure = protectedProcedure
  .input(inputSchema)
  .mutation(async ({ ctx, input }) => {
    console.log("[createComment] Criando comentário na tarefa:", input.todoId);

    const todo = await ctx.prisma.todo.findFirst({
      where: {
        id: input.todoId,
        userId: ctx.userId,
      },
    });

    if (!todo) {
      console.error("[createComment] Tarefa não encontrada ou não pertence ao usuário");
      throw new Error("Tarefa não encontrada");
    }

    const comment = await ctx.prisma.comment.create({
      data: {
        content: input.content,
        todoId: input.todoId,
        userId: ctx.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    console.log("[createComment] Comentário criado com sucesso:", comment.id);
    return { comment };
  });

export default createCommentProcedure;
