import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";

const inputSchema = z.object({
  name: z.string().min(1, "Nome da tag é obrigatório"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Cor inválida (use formato HEX)"),
});

export const createTagProcedure = protectedProcedure
  .input(inputSchema)
  .mutation(async ({ ctx, input }) => {
    console.log("[createTag] Criando tag:", input.name);
    
    const existingTag = await ctx.prisma.tag.findUnique({
      where: {
        userId_name: {
          userId: ctx.userId,
          name: input.name,
        },
      },
    });

    if (existingTag) {
      console.error("[createTag] Tag já existe:", input.name);
      throw new Error("Você já possui uma tag com este nome");
    }

    const tag = await ctx.prisma.tag.create({
      data: {
        name: input.name,
        color: input.color,
        userId: ctx.userId,
      },
    });

    console.log("[createTag] Tag criada com sucesso:", tag.id);
    return { tag };
  });

export default createTagProcedure;
