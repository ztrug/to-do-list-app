import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { prisma } from "@/backend/lib/prisma";

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const authHeader = opts.req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  let userId: string | null = null;
  
  if (token) {
    try {
      userId = token;
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }
  
  return {
    req: opts.req,
    prisma,
    userId,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});
