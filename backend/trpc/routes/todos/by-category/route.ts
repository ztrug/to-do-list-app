import { protectedProcedure } from "@/backend/trpc/create-context";

export default protectedProcedure.query(async ({ ctx }) => {
  const categoriesWithCount = await ctx.prisma.category.findMany({
    include: {
      _count: {
        select: {
          todos: {
            where: {
              userId: ctx.userId,
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const uncategorizedCount = await ctx.prisma.todo.count({
    where: {
      userId: ctx.userId,
      categoryId: null,
    },
  });

  const result = categoriesWithCount.map((category: any) => ({
    categoryId: category.id,
    categoryName: category.name,
    categoryColor: category.color,
    categoryIcon: category.icon,
    todoCount: category._count.todos,
  }));

  result.push({
    categoryId: "uncategorized",
    categoryName: "Sem categoria",
    categoryColor: "#9CA3AF",
    categoryIcon: null,
    todoCount: uncategorizedCount,
  });

  return {
    categories: result,
  };
});
