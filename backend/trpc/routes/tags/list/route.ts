import { protectedProcedure } from "@/backend/trpc/create-context";

export const listTagsProcedure = protectedProcedure.query(async ({ ctx }) => {
  console.log("[listTags] Listando tags do usuário:", ctx.userId);

  const tags = await ctx.prisma.tag.findMany({
    where: {
      userId: ctx.userId,
    },
    include: {
      _count: {
        select: {
          todos: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  console.log("[listTags] Tags encontradas:", tags.length);
  
  return {
    tags: tags.map((tag: { id: string; name: string; color: string; _count: { todos: number }; createdAt: Date }) => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
      todoCount: tag._count.todos,
      createdAt: tag.createdAt,
    })),
  };
});

export default listTagsProcedure;
