import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

const inputSchema = z.object({
  todoId: z.string().min(1, "ID da tarefa é obrigatório"),
  filename: z.string().min(1, "Nome do arquivo é obrigatório"),
  fileUrl: z.string().min(1, "URL do arquivo é obrigatória"),
  fileType: z.string().min(1, "Tipo do arquivo é obrigatório"),
  fileSize: z.number().min(1, "Tamanho do arquivo é obrigatório"),
});

export const createAttachmentProcedure = protectedProcedure
  .input(inputSchema)
  .mutation(async ({ ctx, input }) => {
    console.log("[createAttachment] Criando anexo para tarefa:", input.todoId);

    const todo = await ctx.prisma.todo.findFirst({
      where: {
        id: input.todoId,
        userId: ctx.userId,
      },
    });

    if (!todo) {
      console.error("[createAttachment] Tarefa não encontrada ou não pertence ao usuário");
      throw new Error("Tarefa não encontrada");
    }

    const attachment = await ctx.prisma.attachment.create({
      data: {
        filename: input.filename,
        fileUrl: input.fileUrl,
        fileType: input.fileType,
        fileSize: input.fileSize,
        todoId: input.todoId,
        userId: ctx.userId,
      },
    });

    console.log("[createAttachment] Anexo criado com sucesso:", attachment.id);
    return attachment;
  });

export default createAttachmentProcedure;
