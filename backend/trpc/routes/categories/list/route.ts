import { publicProcedure } from "@/backend/trpc/create-context";

export default publicProcedure.query(async ({ ctx }) => {
  const categories = await ctx.prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return {
    categories,
  };
});
