import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

const inputSchema = z.object({
  todoId: z.string().min(1, "ID da tarefa é obrigatório"),
});

export const listAttachmentsProcedure = protectedProcedure
  .input(inputSchema)
  .query(async ({ ctx, input }) => {
    console.log("[listAttachments] Listando anexos da tarefa:", input.todoId);

    const todo = await ctx.prisma.todo.findFirst({
      where: {
        id: input.todoId,
        userId: ctx.userId,
      },
    });

    if (!todo) {
      console.error("[listAttachments] Tarefa não encontrada ou não pertence ao usuário");
      throw new Error("Tarefa não encontrada");
    }

    const attachments = await ctx.prisma.attachment.findMany({
      where: {
        todoId: input.todoId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalSize = attachments.reduce((sum: number, att: { fileSize: number }) => sum + att.fileSize, 0);

    console.log("[listAttachments] Anexos encontrados:", attachments.length);
    return {
      attachments,
      count: attachments.length,
      totalSize,
    };
  });

export default listAttachmentsProcedure;
