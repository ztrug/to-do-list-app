import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import bcrypt from "bcryptjs";

export default publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(1),
      age: z.number().int().min(1),
      howFound: z.string().min(1),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const existingUser = await ctx.prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existingUser) {
      throw new Error("Email já cadastrado");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await ctx.prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        password: hashedPassword,
        name: input.name,
        age: input.age,
        howFound: input.howFound,
      },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        howFound: true,
        profilePhoto: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      user,
      token: user.id,
    };
  });
