import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import bcrypt from "bcryptjs";

export default publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user) {
      throw new Error("Email ou senha incorretos");
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password);

    if (!isValidPassword) {
      throw new Error("Email ou senha incorretos");
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        age: user.age,
        howFound: user.howFound,
        profilePhoto: user.profilePhoto,
        createdAt: user.createdAt,
      },
      token: user.id,
    };
  });
