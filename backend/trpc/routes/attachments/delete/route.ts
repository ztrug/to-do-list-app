import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

const inputSchema = z.object({
  attachmentId: z.string().min(1, "ID do anexo é obrigatório"),
});

export const deleteAttachmentProcedure = protectedProcedure
  .input(inputSchema)
  .mutation(async ({ ctx, input }) => {
    console.log("[deleteAttachment] Excluindo anexo:", input.attachmentId);

    const attachment = await ctx.prisma.attachment.findFirst({
      where: {
        id: input.attachmentId,
        userId: ctx.userId,
      },
    });

    if (!attachment) {
      console.error("[deleteAttachment] Anexo não encontrado ou não pertence ao usuário");
      throw new Error("Anexo não encontrado");
    }

    await ctx.prisma.attachment.delete({
      where: {
        id: input.attachmentId,
      },
    });

    console.log("[deleteAttachment] Anexo excluído com sucesso");
    return { success: true };
  });

export default deleteAttachmentProcedure;
